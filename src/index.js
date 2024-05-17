import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ProjectSlider from './components/ProjectSlider';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
const scaleFactor = 0.35;
root.render(
    <React.StrictMode>
        <App
            prism={[[1 * scaleFactor, 0 * scaleFactor],
            [-1 / 2 * scaleFactor, 3 ** 0.5 / 2 * scaleFactor],
            [-1 / 2 * scaleFactor, -(3 ** 0.5) / 2 * scaleFactor]]}
            lightStrength={0.05}
            refStrength={0.15}
            IOR={1.5}
            IORChange={0.1}
            spectrumRange={[-1.7, 1.7]}
            spectrumDivide={120}
            RGBInSpectrum={[[-1, 2], [0], [1]]}
            RGBInSpectrumStrength={[[1, 1], [1.1], [1.4]]}
            spectrumToRGBRadius={0.7}
            lightRange={0.08}
            lightBeamNumber={20} />
    </React.StrictMode>
);

const sliderRoot = ReactDOM.createRoot(document.getElementById('recent_release'));
sliderRoot.render(
    <React.StrictMode>
        <ProjectSlider></ProjectSlider>
    </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
