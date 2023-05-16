let scales = new Array(16);
scales[0] = [0, 4, 7, 2, 5, 9, 4, 7, 11, 5, 9, 12, 7, 11, 14, 9, 12, 16, 11, 14, 17];
scales[1] = [0, 4, 7, 2, 5, 9, 4, 7, 11, 4, 7, 11, 7, 11, 14, 9, 12, 16, 9, 12, 16];
scales[2] = [0, 4, 7, 2, 6, 9, 4, 7, 11, 6, 9, 12, 7, 11, 14, 9, 12, 16, 11, 14, 18];
scales[3] = [0, 4, 7, 2, 5, 9, 4, 7, 10, 5, 9, 12, 7, 10, 14, 9, 12, 16, 10, 14, 17];
scales[4] = [0, 3, 7, 2, 5, 8, 3, 7, 10, 5, 8, 12, 7, 10, 14, 8, 12, 15, 10, 14, 17];
scales[5] = [0, 3, 7, 0, 3, 7, 3, 7, 10, 5, 8, 12, 7, 10, 14, 7, 10, 14, 10, 14, 17];
scales[6] = [0, 3, 7, 2, 5, 9, 3, 7, 10, 5, 9, 12, 7, 10, 14, 9, 12, 15, 10, 14, 17];
scales[7] = [0, 3, 7, 1, 5, 8, 3, 7, 10, 5, 8, 12, 7, 10, 13, 8, 12, 15, 10, 13, 17];
scales[8] = [0, 3, 6, 1, 5, 8, 3, 6, 10, 5, 8, 12, 6, 10, 13, 8, 12, 15, 10, 13, 17];

let modes = ["Major", "Major (pentatonic)", "Lydian", "Mixolydian", "Minor", "Minor (pentatonic)", "Dorian", "Phrygian", "Locrian"];
let piano = ['A2', 'Bb2', 'B2', 'C2', 'Db2', 'D2', 'Eb2', 'E2', 'F2', 'Gb2', 'G2', 'Ab2', 'A3', 'Bb3', 'B3', 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5', 'Db5', 'D5', 'Eb5', 'E5', 'F5', 'Gb5', 'G5', 'Ab5'];
let notes = ['a', 'a-', 'b', 'c', 'c-', 'd', 'd-', 'e', 'f', 'f-', 'g', 'g-'];

let quart, base, speed, disturb, sindex, beats, beat, freq, offset, A, B, C, D;
let iowa = new Array(72);

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let gainNode;
let curTime = 0;
let winNow = 0;
let test = 0;

for (let k = 0; k < 2 * piano.length; k++) {
    let prefix = 'iowa/med/';
    let postfix = '-49-96.mp3';

    if (k < piano.length) {
        prefix = 'iowa/soft/';
        postfix = '-1-48.mp3';
    }
    iowa[k] = prefix + piano[k % piano.length] + postfix;
}
function curve(t) {
    let X = Math.sin(freq * t / 12) * Math.cos(A * t + 2 * Math.PI * B);
    let Y = Math.cos(freq * t / 12 + 2 * Math.PI * C) * Math.sin(D * t);

    return [Math.round(Math.abs(X * 6)) % 7, 8 - Math.floor(Math.abs(Y * 5)) % 6];
}
function compose(time, prev) {
    if (time === 0) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioCtx.createGain();
        gainNode.connect(audioCtx.destination);

        curTime = audioCtx.currentTime;
        winNow = window.performance.now();
    }
    let step = curve(time);

    let scale = scales[sindex];
    let level = base + scale[3 * step[0]];

    let passed = beat - time % beat;
    if (time % 32 != 0) passed = 32 - time % 32;
    while (Math.pow(2, step[1]) > passed) step[1]--;

    let silence = (step[1] < 8 && Math.random() < disturb);
    let c = new Array(48);
    let dot = 1;

    if (time % beat === 0) {
        let tone;
        let newoff = offset;

        for (let i = newoff; i < scale.length; i += 3) {
            if (scale[i] % 12 === level - base) {
                tone = i - newoff;
                break;
            }
        }
        if (sindex !== 1 && sindex !== 5) {
            if (prev === base + scale[tone]) {
                let rnd = Math.random();
                if (rnd < 10 * disturb) newoff++;
                if (rnd > 1 - 10 * disturb) newoff--;
                if (newoff < 0 || newoff > 2) newoff = 1;

                for (let j = newoff; j < scale.length; j += 3) {
                    if (scale[j] % 12 === level - base) {
                        tone = j - newoff;
                        break;
                    }
                }
            }
        }
        let l = 0;
        for (let i = 1; i <= base + scale[tone]; i++) if (notes[i % 12].length === 1) l++;
        l = 100 - 5 * l;

        for (let i = 0; i < 3; i++) {
            let t = l;
            l = base + scale[tone + i];

            for (let j = t + 1; j <= l; j++) if (notes[j % 12].length != 1) t++;
            if (i != 0) t = 5 * (t - l) - 50;

            for (let j = 0; j < 16; j++) {
                c[3 * j + i] = l;
            }
        }
    }
    else if (step[1] > 5 && Math.random() < 2.5 * disturb && passed - 1.5 * Math.pow(2, step[1]) >= 0) dot = 1.5;

    if (c[0] !== undefined) {
        let ranq = Math.random();
        let ranb = Math.random();

        for (let i = 0; i < quart.length; i++) {
            let bias = quart[i];
            if (ranq < 5 * disturb) bias = quart[quart.length - i - 1];
            if (bias === -1) continue;

            if (Math.random() < 5 * disturb) {
                let crand = c[Math.floor(Math.random() * quart.length)];

                play(crand, (time + bias) * (30 - speed), 5 * step[1] / 100, 0);
                if (Math.random() < disturb) continue;
            }
            let nota = c[i];
            if (ranb < disturb) nota = c[c.length - i - 1];

            play(nota, (time + bias) * (30 - speed), 5 * step[1] / 100, 0);
        }
        prev = c[0];
    }
    if (!silence) play(level + 12, time * (30 - speed), 0.25 + 3 * step[1] / 100, 36);

    time += dot * Math.pow(2, step[1]);

    setTimeout(function () {
        compose(time, prev);
    }, (30 - speed) * 20);
}
function pattern() {
    beat = beats * 32;
    quart = new Array(beats * 3);

    for (let q = 0; q < 3 * beats; q++) {
        if (Math.random() < 0.5) quart[q] = -1;
        else {
            quart[q] = Math.floor(Math.random() * beats) * 32;
            while (q >= 3 && quart[q] === quart[q - 3]) quart[q] = Math.floor(Math.random() * beats) * 32;
        }
        if (quart[q] == -1) continue;
    }
}
document.getElementById('score').addEventListener('click', function () {
    if (this.innerHTML.indexOf("STOP") >= 0) {
        let id = window.setTimeout(function () { }, 0);
        while (id--) window.clearTimeout(id);

        this.style.color = "darkolivegreen";
        this.innerHTML = "PLAY";
        audioCtx.close();
    }
    else {
        base = Math.floor(Math.random() * 12);
        speed = Math.ceil(Math.random() * 15) + 10;
        disturb = Math.random() / 10;
        sindex = Math.floor(Math.random() * 9);
        beats = Math.ceil(Math.random() * 12) + 4;
        freq = 2 * Math.PI / beat;

        pattern();

        if (sindex === 1 || sindex === 5) offset = 0;
        else offset = Math.floor(Math.random() * 3);

        A = Math.ceil(Math.random() * 1000);
        B = Math.random();
        C = Math.random();
        D = Math.ceil(Math.random() * 1000);

        if (this.innerHTML.indexOf("Click") >= 0) {
            this.style.color = "darkolivegreen";
            this.innerHTML = "PLAY";
        }
        else {
            document.getElementById('info').innerHTML = notes[base].replace('-', '#').toUpperCase();
            document.getElementById('info').innerHTML += "&nbsp;" + modes[sindex];
            document.getElementById('info').innerHTML += "&nbsp;𝅘𝅥" + Math.round(60000 / ((30 - speed) * 64));
            this.style.color = "firebrick";
            this.innerHTML = "STOP";
        }
        compose(0, -1);
    }
});
function play(n, t, v, o) {
    var sound = audioCtx.createBufferSource();
    var instr = iowa[n + o];

    fetch(instr, { cache: "force-cache" })
        .then(response => response.arrayBuffer())
        .then(buffer => audioCtx.decodeAudioData(buffer))
        .then(decodedData => sound.buffer = decodedData);

    gainNode.gain.value = 0.5 + v;
    sound.connect(gainNode);
    sound.start(curTime + t / 1000 + 1);
}
function loadSounds() {
    document.getElementById('score').innerHTML = "Loading sounds... (" + Math.floor(test * 100 / 72) + "%)";

    if (test < 72) {
        let sound = new Audio(iowa[test]);
        sound.addEventListener('loadeddata', function () { test++; loadSounds(); });
        sound.addEventListener('error', function () {
            document.getElementById('notation').innerHTML = "ERROR! CANNOT LOAD SOUNDS.";
        });
    }
    else {
        document.getElementById('score').disabled = false;
        document.getElementById('score').innerHTML = "Click here when ready!";
    }
    return;
}
loadSounds();