// JavaScript Document
var obj = document.getElementById("logo1");
var obj_spinner = document.getElementById("cube-spinner");
var divElements = document.querySelectorAll('.spinner div');
var k = 0;
var enableCube = false;
var int = setInterval("Time()", 300);


function Time() {
    k += 10;
    if (k == 360) {
        k = 0;
    }
    obj.style.filter = "hue-rotate(" + k + "deg)";

    divElements.forEach(function (divElement) {
        divElement.style.filter = "hue-rotate(" + k + "deg)";;
    });
}
Time();

obj.onclick = function () {
    //obj.style.filter = "hue-rotate(0deg)";
    //clearInterval(int);
    enableCube = !enableCube;
    if (enableCube) {
        obj_spinner.style.display = 'block';
        document.addEventListener('mousemove', function (e) {
            obj_spinner.style.left = e.clientX + 'px';
            obj_spinner.style.top = e.clientY + 'px';
        });
    } else {
        obj_spinner.style.display = 'none';
    }
}

