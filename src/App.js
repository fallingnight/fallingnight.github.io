import React, { useState, useRef, useEffect } from 'react';
import Switch from './components/Switch';
import './components/css/Switch.css';

function pointsToString(points) {
    let result = "";
    points.forEach(point => {
        result += point[0] + "," + point[1] + " ";
    });
    return result;
}

function norm(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

function dot(u, v) {
    return u[0] * v[0] + u[1] * v[1];
}

function cross(u, v) {
    return u[0] * v[1] - u[1] * v[0];
}

function reflect(u, v) {
    const dr = dot(u, v)
    return [u[0] - 2 * dr * v[0], u[1] - 2 * dr * v[1]];
}

function refract(intersection, v, IOR, waveLength, IORChange) {
    const direction = Math.sign(dot(v, intersection.normal));
    const IOR2 = (IOR + waveLength * IORChange) ** (direction > 0 ? -1 : 1);
    const angleIn = Math.acos(Math.abs(dot(v, intersection.normal) / (norm(v) * norm(intersection.normal))));
    const sinAngleOut = Math.sin(angleIn) / IOR2;
    if (sinAngleOut > 1)  // Total reflection
        return undefined;
    const angleOut = Math.asin(sinAngleOut);
    const f = direction * Math.sin(angleIn) * (1 / Math.tan(angleOut) - 1 / Math.tan(angleIn));
    const vOut = [v[0] + intersection.normal[0] * f, v[1] + intersection.normal[1] * f];
    const length = norm(vOut);
    return [vOut[0] / length, vOut[1] / length];
}

function rayLineIntersection(rayOrigin, rayDirection, line) {
    const pointA = line[0], pointB = line[1];
    const lineDirection = [pointB[0] - pointA[0], pointB[1] - pointA[1]];

    const determinant = cross(rayDirection, lineDirection);
    if (determinant === 0)  // Parallel
        return undefined;

    const pointARelative = [pointA[0] - rayOrigin[0], pointA[1] - rayOrigin[1]];
    const u = cross(pointARelative, rayDirection) / determinant;
    const t = cross(pointARelative, lineDirection) / determinant;

    if (u >= 0 && u <= 1 && t >= 0) {
        const intersection = [rayOrigin[0] + t * rayDirection[0], rayOrigin[1] + t * rayDirection[1]];

        const lineLengthInv = 1 / Math.sqrt(lineDirection[0] * lineDirection[0] + lineDirection[1] * lineDirection[1]);

        return {
            point: intersection,
            distance: Math.sqrt((intersection[0] - rayOrigin[0]) ** 2 + (intersection[1] - rayOrigin[1]) ** 2),
            normal: [lineDirection[1] * lineLengthInv, -lineDirection[0] * lineLengthInv]
        };
    } else {
        return undefined;
    }
}

function rayPolylineIntersection(rayOrigin, rayDirection, polyline) {
    const result = {
        point: undefined,
        distance: Infinity,
        normal: undefined
    };

    for (let i = 1; i <= polyline.length; i++) {
        const intersection = rayLineIntersection(rayOrigin, rayDirection, [polyline[i - 1], polyline[i % polyline.length]]);
        if (!intersection)
            continue;
        if (intersection.distance < result.distance) {
            result.point = intersection.point;
            result.distance = intersection.distance;
            result.normal = intersection.normal;
        }
    }

    return result.point ? result : undefined;
}

function rayRectangleIntersection(rayOrigin, rayDirection, xMin, xMax, yMin, yMax) {  // rayOrigin must be inside the rectangle.
    const result = {
        point: undefined,
        distance: Infinity,
        normal: undefined
    };

    if (rayDirection[0] > 0) {
        result.point = [xMax, rayOrigin[1] + (xMax - rayOrigin[0]) / rayDirection[0] * rayDirection[1]];
        result.distance = norm([result.point[0] - rayOrigin[0], result.point[1] - rayOrigin[1]]);
        result.normal = [1, 0];
    }
    if (rayDirection[0] < 0) {
        const point = [xMin, rayOrigin[1] + (xMin - rayOrigin[0]) / rayDirection[0] * rayDirection[1]];
        const distance = norm([point[0] - rayOrigin[0], point[1] - rayOrigin[1]]);
        if (distance < result.distance) {
            result.point = point;
            result.distance = distance;
            result.normal = [-1, 0];
        }
    }
    if (rayDirection[1] > 0) {
        const point = [rayOrigin[0] + (yMax - rayOrigin[1]) / rayDirection[1] * rayDirection[0], yMax];
        const distance = norm([point[0] - rayOrigin[0], point[1] - rayOrigin[1]]);
        if (distance < result.distance) {
            result.point = point;
            result.distance = distance;
            result.normal = [0, 1];
        }
    }
    if (rayDirection[1] < 0) {
        const point = [rayOrigin[0] + (yMin - rayOrigin[1]) / rayDirection[1] * rayDirection[0], yMin];
        const distance = norm([point[0] - rayOrigin[0], point[1] - rayOrigin[1]]);
        if (distance < result.distance) {
            result.point = point;
            result.distance = distance;
            result.normal = [0, -1];
        }
    }

    return result.point ? result : undefined;
}

const App = ({ prism, lightStrength, refStrength, IOR, IORChange, spectrumRange, spectrumDivide, RGBInSpectrum, RGBInSpectrumStrength, spectrumToRGBRadius, lightRange, lightBeamNumber }) => {
    const divRef = useRef(null);
    const canvasRef = useRef(null);
    const svgRef = useRef(null);

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [rotation, setRotation] = useState(0.70);
    const [dragingInformation, setDragingInformation] = useState();
    const [enableReflect, setEnableReflect] = useState(false);

    const handleSwitch = (newState) => {
        setEnableReflect(newState);
    };

    function repaint() {
        const canvas = canvasRef.current;
        if (!canvas)
            return;

        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        const scaleFactor = Math.min(width, height) / 2;

        const ctx = canvas.getContext("2d");

        ctx.globalCompositeOperation = 'source-over';  // Normal mode

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = 'lighter';  // Additive mode

        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const prismInCanvas = prism.map(point => [(point[0] * cos - point[1] * sin) * scaleFactor + width / 2,
        (point[0] * sin + point[1] * cos) * scaleFactor + height / 2]);

        for (let i = 0; i < lightBeamNumber; i++) {
            for (let j = 0; j < spectrumDivide; j++) {
                const waveLength = j / (spectrumDivide - 1) * (spectrumRange[1] - spectrumRange[0]) + spectrumRange[0];
                let p = [0, height / 2 + (i / (lightBeamNumber - 1) - 0.5) * lightRange * scaleFactor];
                let v = [1, -0.10];
                ctx.beginPath();
                const rgb = [0, 0, 0];
                for (let k = 0; k < 3; k++)
                    for (let l = 0; l < RGBInSpectrum[k].length; l++)
                        rgb[k] += 1 / (Math.sqrt(2 * Math.PI) * spectrumToRGBRadius) * Math.exp(- ((RGBInSpectrum[k][l] - waveLength) ** 2) / (2 * spectrumToRGBRadius ** 2)) * RGBInSpectrumStrength[k][l];
                ctx.strokeStyle = "rgba(" + rgb[0] * 255 + ", " + rgb[1] * 255 + ", " + rgb[2] * 255 + ", " + lightStrength + ")";
                ctx.lineWidth = scaleFactor * 0.005;
                // ctx.lineJoin = 'round'
                // ctx.lineCap = 'round';
                ctx.moveTo(p[0], p[1])
                for (let k = 0; k < 3; k++) {
                    p[0] += v[0] * 0.1;
                    p[1] += v[1] * 0.1;
                    const intersection = rayPolylineIntersection(p, v, prismInCanvas);
                    if (!intersection) {
                        const intersection = rayRectangleIntersection(p, v, 0, width, 0, height);
                        ctx.lineTo(intersection.point[0], intersection.point[1]);
                        ctx.stroke();
                        break;
                    }
                    ctx.lineTo(intersection.point[0], intersection.point[1]);
                    ctx.stroke();
                    p = intersection.point;
                    if (enableReflect) {
                        ctx.beginPath();
                        ctx.moveTo(intersection.point[0], intersection.point[1]);
                        let r = reflect(v, intersection.normal);
                        const rLength = norm(r);
                        r[0] /= rLength;
                        r[1] /= rLength;
                        let pr = [p[0] + r[0] * 0.1, p[1] + r[1] * 0.1]
                        ctx.strokeStyle = "rgba(" + rgb[0] * 255 + ", " + rgb[1] * 255 + ", " + rgb[2] * 255 + ", " + lightStrength * refStrength + ")";
                        const rIntersection = rayPolylineIntersection(pr, r, prismInCanvas);
                        if (rIntersection) {
                            ctx.lineTo(rIntersection.point[0], rIntersection.point[1]);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(rIntersection.point[0], rIntersection.point[1]);
                            pr = rIntersection.point;
                            const rRefract = refract(rIntersection, r, IOR, waveLength, IORChange);
                            if (rRefract) {
                                r = rRefract;
                                pr = [pr[0] + r[0] * 0.1, pr[1] + r[1] * 0.1];
                            }
                        } else {
                            if (k === 0) {
                                ctx.lineWidth = scaleFactor * 0.003;
                            }
                        }
                        const rRectIntersection = rayRectangleIntersection(pr, r, 0, width, 0, height);
                        ctx.lineTo(rRectIntersection.point[0], rRectIntersection.point[1]);
                        ctx.stroke();
                        ctx.lineWidth = scaleFactor * 0.005;
                    }

                    ctx.beginPath();
                    ctx.strokeStyle = "rgba(" + rgb[0] * 255 + ", " + rgb[1] * 255 + ", " + rgb[2] * 255 + ", " + lightStrength * (1 - refStrength) + ")";
                    ctx.moveTo(intersection.point[0], intersection.point[1]);
                    // console.log(intersection);
                    p = intersection.point;
                    const vRefract = refract(intersection, v, IOR, waveLength, IORChange);
                    if (!vRefract) {
                        break;
                    }
                    v = vRefract;
                }
                //ctx.stroke();
            }
        }

    }

    useEffect(() => {
        if (divRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            setWidth(divRef.current.offsetWidth);
            setHeight(divRef.current.offsetHeight);
            canvas.width = divRef.current.offsetWidth;
            canvas.height = divRef.current.offsetHeight;

            repaint();
        }
    }, [divRef.current, canvasRef.current]);

    useEffect(repaint, [rotation]);
    useEffect(repaint, [enableReflect]);

    return (
        <div
            ref={divRef}
            style={{
                overflow: "hidden",
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%"
            }}>



            {/*Light*/}
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    zIndex: 1
                }} />

            {/*Prism*/}

            {divRef.current && canvasRef.current &&
                <svg
                    ref={svgRef}
                    width={width}
                    height={height}
                    viewBox="-1 -1 2 2"
                    style={{
                        zIndex: 2,
                        position: "relative",
                        top: 0,
                        left: 0,
                        filter: "url(#glow)",
                    }}
                    onPointerMove={event => {
                        if (!dragingInformation)
                            return;

                        const x = event.clientX;
                        const y = event.clientY;
                        const centerX = width / 2;
                        const centerY = height / 2;
                        const da = Math.atan2(y - centerY, x - centerX) - Math.atan2(dragingInformation.startY - centerY, dragingInformation.startX - centerX);
                        setRotation(dragingInformation.startRotation + da);
                    }}
                    onPointerUp={event => {
                        setDragingInformation(undefined);
                    }}>
                    <defs>
                        <filter id="glow">

                            <feMorphology in="SourceGraphic" operator="dilate" radius="3" result="expanded" />
                            <feGaussianBlur in="expanded" stdDeviation="5" result="blurredEdge" />
                            <feMerge>
                                <feMergeNode in="SourceGraphic" />
                                <feMergeNode in="blurredEdge" />
                            </feMerge>
                        </filter>
                    </defs>



                    <polygon
                        points={pointsToString(prism)}
                        fill="rgba(255, 255, 255, 0.1)"
                        stroke="rgba(255, 255, 255, 0.8)"
                        stroke-width={0.02}
                        onPointerDown={event => {
                            setDragingInformation({
                                startX: event.clientX,
                                startY: event.clientY,
                                startRotation: rotation
                            });
                        }}
                        transform={"rotate(" + rotation * 180 / Math.PI + ")"}
                    />
                </svg>}
            <Switch onToggle={handleSwitch}></Switch>


        </div>
    );
}
export default App;
