const dl = 0.05;

document.addEventListener('DOMContentLoaded', function () {
    let textElement = document.getElementById('bounce-text');
    let text = textElement.innerText;
    textElement.innerHTML = '';
    for (let i = 0; i < text.length; i++) {
        let span = document.createElement('span');
        span.textContent = text[i];
        span.style.display = 'inline-block';
        textElement.appendChild(span);
    }

    let colorTitleElement = document.getElementById('color-text');
    let colorTilte = colorTitleElement.innerText;
    const titleLen = colorTilte.length;
    colorTitleElement.innerHTML = '';
    for (let i = 0; i < titleLen; i++) {
        let span = document.createElement('span');
        let text_item = colorTilte[i];
        if (text_item === ' ') {
            text_item = '&nbsp;';
        }
        span.innerHTML = text_item;
        span.style.display = 'inline-block';
        span.style.animationDelay = i * dl + "s";
        span.classList.add("colorTitle");
        colorTitleElement.appendChild(span);
    }
    let colorLinkElement = document.getElementById('color-link');
    let colorLink = colorLinkElement.innerText;
    const linkLen = colorLink.length;
    colorLinkElement.innerHTML = '';
    for (let i = 0; i < linkLen; i++) {
        let span = document.createElement('span');
        let text_item = colorLink[i];
        if (text_item === ' ') {
            text_item = '&nbsp;';
        }
        span.innerHTML = text_item;
        span.style.display = 'inline-block';
        span.classList.add("colorLink");
        span.style.animationDelay = (i + titleLen) * dl + "s";
        colorLinkElement.appendChild(span);
    }

    colorTitleElement.addEventListener('mouseover', function () {
        let spanElements = colorTitleElement.querySelectorAll('span');
        spanElements.forEach(function (spanElement) {
            spanElement.style.animationDelay = "0s";
        });
    });

    colorLinkElement.addEventListener('mouseover', function () {
        let spanElements = colorLinkElement.querySelectorAll('span');
        spanElements.forEach(function (spanElement) {
            spanElement.style.animation = "none";
            spanElement.style.opacity = "1.0";
        });

    });
});

