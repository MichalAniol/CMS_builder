const editor = document.getElementById('editor'),
    effect = document.getElementById('effect'),
    result = document.getElementById('result'),
    leftBor = document.getElementById('left_border'),
    rightBor = document.getElementById('right_border'),
    sizeNow = document.getElementById('size_now'),
    changeImme = document.getElementById('chang_imme'),
    change = document.getElementById('change'),
    sourse = document.getElementById('sourse'),
    webSrc = document.getElementById('web_src');

const getH = item => item.getBoundingClientRect().height;
const getRect = item => item.getBoundingClientRect();

const v = {
    clickDown: false,
    posY: 0,
    posX: 0,
    editorH: 0,
    effectH: 0,
    resL: 0,
    resR: 0,
    resT: 0,
    resH: 0,
    resC: 0,
    resA: 0,
    leftBor: false,
    changeImme: false
}

const changeImmeOnOff = () => {
    if (v.changeImme) {
        v.changeImme = false;
        changeImme.innerHTML = 'change immediately: off';
        change.disabled = false;
    } else {
        v.changeImme = true;
        changeImme.innerHTML = 'change immediately: on'
        change.disabled = true;
        setChange();
    }
}

const setChange = () => {
    let r1 = sourse.value;
    let p1 = r1.indexOf('src="/data/include/cms')
    console.log('%c p1:', 'background: #ffcc00; color: #003300', p1)
    while (p1 > -1) {
        r1 = r1.replace('src="/data/include/cms', 'src="' + webSrc.value + '/data/include/cms')
        p1 = r1.indexOf('src="/data/include/cms')
    }
    result.innerHTML = r1;
    effect.style.height = 'auto'
    measuerResult();
}

const setImmChange = () => {
    if (v.changeImme) {
        setTimeout(() => {
            setChange();
        }, 30);
    }
}

const clearWhiteSpaces = (r, fi, ci) => {
    r1 = r;
    r2 = ''

    p1 = r1.indexOf('<');
    while (p1 > -1) {
        let p2 = r1.indexOf('>')
        let a = r1.slice(0, p1);
        let b = r1.slice(p1, p2 + 1);
        let p3 = b.indexOf(fi);
        while (p3 > -1) {
            b = b.replace(fi, ci);
            p3 = b.indexOf(fi);
        }

        let c = r1.slice(p2 + 1, r1.length);
        r2 += a + b;
        r1 = c;

        p1 = r1.indexOf('<');
    }

    return r2;
}

const deleteClasses = () => {
    let r1 = sourse.value,
        r2 = '';

    let p1 = r1.indexOf('class="');
    while (p1 > -1) {
        let a = r1.slice(0, p1);
        let b = r1.slice(p1, r1.length).replace('class="', '');
        let p2 = b.indexOf('"');
        r1 = b.slice(p2 + 1, b.length);
        p1 = r1.indexOf('class="');
        r2 += a;
    }
    r2 += r1;

    r1 = clearWhiteSpaces(r2, '  ', ' ');
    r2 = clearWhiteSpaces(r1, ' >', '>');

    sourse.value = r2;
}

const deleteStyles = () => {
    let r1 = sourse.value,
        r2 = '';

    let p1 = r1.indexOf('style="');
    while (p1 > -1) {
        let a = r1.slice(0, p1);
        let b = r1.slice(p1, r1.length).replace('style="', '');
        let p2 = b.indexOf('"');
        r1 = b.slice(p2 + 1, b.length);
        p1 = r1.indexOf('style="');
        r2 += a;
    }
    r2 += r1;

    r1 = clearWhiteSpaces(r2, '  ', ' ');
    r2 = clearWhiteSpaces(r1, ' >', '>');

    sourse.value = r2;
}

const copy = () => {
    sourse.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error(err)
    }
}

const moveSpliter = e => {
    if (!v.clickDown) {
        v.posY = e.clientY;
        v.editorH = getH(editor);
        v.effectH = getH(effect);
        v.clickDown = true;
    }
    let y = e.clientY - v.posY,
        ediH = v.editorH + y,
        effH = v.effectH - y;

    // if (ediH > 100 && (window.innerHeight - (ediH)) > 100) {
    editor.style.height = (ediH) + 'px';
    // effect.style.height = (effH) + 'px';
    measuerResult();
    // }
}

const fitBorders = () => {
    let r = getRect(result);
    v.resL = r.left - 10;
    v.resR = r.right - 10;

    leftBor.style.top = v.resT + 'px';
    leftBor.style.left = v.resL + 'px';
    leftBor.style.height = v.resH + 'px';

    rightBor.style.top = v.resT + 'px';
    rightBor.style.left = v.resR + 'px';
    rightBor.style.height = v.resH + 'px';

    sizeNow.innerHTML = 'width: ' + r.width + 'px';
}

const measuerResult = () => {
    let r = getRect(result);
    v.resC = (r.left + r.right) / 2;
    v.resA = (r.right - r.left);
    v.resT = r.top;
    v.resH = r.height;

    fitBorders();
}

const setResultWith = (w = window.innerWidth - 20) => {
    result.style.width = w + 'px';
    fitBorders();
}

const changeResWidth = e => {
    if (!v.clickDown) {
        v.posX = e.clientX;
        v.clickDown = true;
        v.leftBor = v.posX < v.resC;
        measuerResult();
    }

    let x = v.leftBor ? ((v.resA / 2) - (e.clientX - v.posX)) * 2 : ((v.resA / 2) + (e.clientX - v.posX)) * 2;
    if (x < 320) { x = 320 }
    result.style.width = x + 'px';
    fitBorders();
}

const mouseDown = (e) => {
    if (e.target.className == 'spliter') {
        document.addEventListener('mousemove', moveSpliter)
    }
    if (e.target.className == 'border') {
        document.addEventListener('mousemove', changeResWidth)
    }
    v.clickDown = false;

}

const mouseUp = () => {
    document.removeEventListener('mousemove', moveSpliter);
    document.removeEventListener('mousemove', changeResWidth);
    let r = getRect(result);
    v.resA = (r.right - r.left);
}

const start = () => {
    document.body.onmousedown = e => mouseDown(e);
    document.body.onmouseup = e => mouseUp();
    measuerResult();
    measuerResult();
    webSrc.value = 'https://www.dezynfekcja24.com';
}

start();