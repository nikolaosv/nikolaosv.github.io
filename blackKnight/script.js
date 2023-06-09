var blanks;
var index;
var row;
var col;
var rsol;
var csol;

var step = new Array(8);

step[0] = [1, 2];
step[1] = [-1, 2];
step[2] = [1, -2];
step[3] = [-1, -2];
step[4] = [2, 1];
step[5] = [-2, 1];
step[6] = [2, -1];
step[7] = [-2, -1];

function resize() {
    var zoom = window.innerWidth / 330;
    if (window.innerHeight < 1.25 * window.innerWidth) zoom = window.innerHeight / 480;

    document.getElementById("panel").style.zoom = zoom;
}
function run(level) {
    blanks = level;
    index = 0;

    row = Math.ceil(Math.random() * 8);
    col = Math.ceil(Math.random() * 8);

    rsol = "";
    csol = "";

    clear();

    for (var count = 0; count < 100; count++) {
        var s = Math.round(Math.random() * 7);
        var nextr = row + step[s][0];
        var nextc = col + step[s][1];

        if (index < blanks && nextr > 0 && nextr < 9 && nextc > 0 && nextc < 9) {
            if (document.getElementById(nextr + "" + nextc).innerHTML != "♙") {
                document.getElementById(row + "" + col).innerHTML = "♙";
                rsol += row;
                csol += col;
                row = nextr;
                col = nextc;
                index++;
            }
        }
    }
    if (index >= blanks && row > 0 && row < 9 && col > 0 && col < 9) {
        rsol += row;
        csol += col;
        document.getElementById(row + "" + col).innerHTML = "♞";
    }
    else run(level);
}

document.getElementById("logo").addEventListener("click", function () {
    run(document.getElementById('level').value * 1 + 2);
});

document.getElementById("level").addEventListener("change", function () {
    run(this.value * 1 + 2);
});

document.getElementById("t").addEventListener("click", function (e) {
    var m = e.target.id.charAt(0);
    var n = e.target.id.charAt(1);
    var q = false;

    if (e.target.innerHTML == '♙') {
        for (i = 0; i < 8; i++) if (m - row == step[i][0] & n - col == step[i][1]) q = true;

        if (q) {
            document.getElementById(row + "" + col).innerHTML = "&nbsp;";

            index--;
            row = m;
            col = n;

            document.getElementById(row + "" + col).innerHTML = "♞";

            if (index == 0) setTimeout(function () {
                document.getElementById("win").style.display = "block";
            }, 500);
        }
    }
});

function clear() {
    document.getElementById("win").style.display = "none";
    resize();

    var html = "";

    for (i = 1; i < 9; i++) {
        html += "<tr>";

        for (j = 1; j < 9; j++) {
            if ((i + j) % 2 == 0) html += "<td id='" + i + "" + j + "' style='background-color:peru'>&nbsp;</td>";
            else html += "<td id='" + i + "" + j + "' style='background-color:sienna'>&nbsp;</td>";
        }
        html += "</tr>";
    }
    document.getElementById("t").innerHTML = html;
}
run(12);

window.onresize = resize;