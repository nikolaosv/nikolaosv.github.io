let original = document.getElementById('oPhoto');
let _i;
let W = 25, H = 25;

function ready() {
    document.getElementById('info').remove();
    document.getElementById('content').style.opacity = 1;
}
function binarize(i, w, h) {
    let channels = new cv.MatVector();
    cv.split(i, channels);

    for (var r = 0; r < i.rows; r += h) {
        let H = h;
        if (r + h > i.rows) H = i.rows - r;

        for (var c = 0; c < i.cols; c += w) {
            let W = w;
            if (c + w > i.cols) W = i.cols - c;

            let rect = new cv.Rect(c, r, W, H);

            for (var C = 0; C < 3; C++) {
                let roi = channels.get(C).roi(rect);
                let color = cv.mean(roi)[0];

                cv.threshold(roi, roi, 0, color, cv.THRESH_OTSU);
                roi.delete();
            }
        }
    }
    cv.merge(channels, i);
    channels.delete();
}
function run() {
    let i = new cv.Mat();
    cv.cvtColor(_i, i, cv.COLOR_RGBA2RGB, 0);
    binarize(i, W, H);

    cv.imshow('final', i);
    i.delete();
}
document.getElementById('oFile').addEventListener('change', (e) => {
    original.src = URL.createObjectURL(e.target.files[0]);
}, false);
document.getElementById('final').addEventListener('click', function (event) {
    var rect = this.getBoundingClientRect();
    W = event.clientX - rect.left;
    H = event.clientY - rect.top;
    run();
});
original.onload = function () {
    if (_i !== undefined) _i.delete();

    let src = cv.imread(original);
    _i = new cv.Mat();

    let offset = 0.9;

    if (src.cols < offset * window.innerWidth && src.rows < offset * window.innerHeight) src.copyTo(i);
    else if (src.rows / src.cols < window.innerHeight / window.innerWidth) {
        cv.resize(src, _i, new cv.Size(offset * window.innerWidth, offset * src.rows * window.innerWidth / src.cols), 0, 0, cv.INTER_CUBIC);
    }
    else {
        cv.resize(src, _i, new cv.Size(offset * src.cols * window.innerHeight / src.rows, offset * window.innerHeight), 0, 0, cv.INTER_CUBIC);
    }
    src.delete();
    run();
};