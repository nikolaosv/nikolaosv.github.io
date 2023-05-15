var dragXoffset = 0;
var dragYoffset = 0;
var selObj = null;

function moveHandler(e) {
    if (e == null) { e = window.event } var posX = 0;
    var posY = 0;

    if (e.button <= 1 && dragOK) {
        posX = e.clientX - dragXoffset;
        posY = e.clientY - dragYoffset;
        selObj.style.left = posX + "px";
        selObj.style.top = posY + "px";
        return false;
    }
}

function cleanup(e) {
    var posX = 35 + Math.round((e.clientX - dragXoffset - 35) / 35) * 35;
    var posY = 35 + Math.round((e.clientY - dragYoffset - 35) / 35) * 35;

    selObj.style.left = posX + "px";
    selObj.style.top = posY + "px";
    document.onmousemove = null;
    document.onmouseup = null;
    savedTarget.style.cursor = orgCursor;
    dragOK = false;

    if (count > 0 && document.getElementById("i" + (count + 1)).offsetTop < 250) document.getElementById("i" + count--).style.opacity = 1;
}

function dragHandler(e) {
    var htype = "-moz-grabbing";

    if (e == null) {
        e = window.event;
        htype = "move";
    }
    var target = e.target != null ? e.target : e.srcElement;
    orgCursor = target.style.cursor;
    selObj = target;

    if (target.className === "moveable") {
        savedTarget = target;
        target.style.cursor = htype;
        dragOK = true;

        dragXoffset = e.clientX - parseInt(selObj.style.left);
        dragYoffset = e.clientY - parseInt(selObj.style.top);

        document.onpointermove = moveHandler;
        document.onpointerup = cleanup;
        return false;
    }
}
var index, count = 12;
var tiles = new Array(19);
var combs = new Array(50);

tiles[0] = "images/Square.png";
tiles[1] = "images/Ih.png";
tiles[2] = "images/Iv.png";
tiles[3] = "images/G90-.png";
tiles[4] = "images/G180.png";
tiles[5] = "images/G90.png";
tiles[6] = "images/G.png";
tiles[7] = "images/L90-.png";
tiles[8] = "images/L180.png";
tiles[9] = "images/L90.png";
tiles[10] = "images/L.png";
tiles[11] = "images/Zh.png";
tiles[12] = "images/Zv.png";
tiles[13] = "images/Sh.png";
tiles[14] = "images/Sv.png";
tiles[15] = "images/T180.png";
tiles[16] = "images/T90.png";
tiles[17] = "images/T.png";
tiles[18] = "images/T90-.png";

combs[0] = "110011110011910101";
combs[1] = "110110011011910101";
combs[2] = "110002101011910101";
combs[3] = "110011001111911010";
combs[4] = "110020010111911010";
combs[5] = "110101101020910101";
combs[6] = "111001101011910002";
combs[7] = "111010011011910020";
combs[8] = "111010101002910101";
combs[9] = "111010110011910002";
combs[10] = "111100100102910101";
combs[11] = "110011010102910200";
combs[12] = "110011101011100002";
combs[13] = "111010001120910020";
combs[14] = "110101011002910200";
combs[15] = "110101110020910020";
combs[16] = "110110010120912000";
combs[17] = "110110110020910101";
combs[18] = "110200110011912000";
combs[19] = "111001101020910020";
combs[20] = "111001101020912000";
combs[21] = "111001200011910020";
combs[22] = "111010001102910020";
combs[23] = "111010001120910020";
combs[24] = "111010001102910020";
combs[25] = "111010011020910002";
combs[26] = "111010100102910002";
combs[27] = "111100200011910002";
combs[28] = "111100010102910002";
combs[29] = "111100000211910002";
combs[30] = "110011001111190101";
combs[31] = "110011010111192000";
combs[32] = "110011101011190020";
combs[33] = "111001001102190101";
combs[34] = "111001001120190101";
combs[35] = "110002100111190002";
combs[36] = "110002110011190020";
combs[37] = "110011101011010200";
combs[38] = "110011101020190002";
combs[39] = "110020001111190020";
combs[40] = "110020100111190200";
combs[41] = "110101001111010020";
combs[42] = "110101001111012000";
combs[43] = "110110020011190020";
combs[44] = "111001010120192000";
combs[45] = "111010001102192000";
combs[46] = "111010011011010200";
combs[47] = "111100002011190200";
combs[48] = "112000001111192000";
combs[49] = "112000011011190002";

function resize() {
    var zoom = window.innerWidth / 330;
    if (window.innerHeight < 1.25 * window.innerWidth) zoom = window.innerHeight / 480;

    document.getElementById("panel").style.zoom = zoom;
}

function run() {
    resize();

    index = Math.floor(Math.random() * 50);
    document.im0.src = tiles[0];
    document.im12.src = tiles[0];

    var x = new Array(11);
    var i = 0;

    for (j = 0; j < 18; j++) {
        if (combs[index].charAt(j) == "2") {
            x[i] = j + 1;
            i++;
            x[i] = j + 1;
            i++;
        } if (combs[index].charAt(j) == "1") {
            x[i] = j + 1;
            i++;
        }
    }
    document.im1.src = tiles[x[0]];
    document.im2.src = tiles[x[1]];
    document.im3.src = tiles[x[2]];
    document.im4.src = tiles[x[3]];
    document.im5.src = tiles[x[4]];
    document.im6.src = tiles[x[5]];
    document.im7.src = tiles[x[6]];
    document.im8.src = tiles[x[7]];
    document.im9.src = tiles[x[8]];
    document.im10.src = tiles[x[9]];
    document.im11.src = tiles[x[10]];

    for (var i = 0; i <= 12; i++) {
        document.getElementById("i" + i).style.left = "35px";
        document.getElementById("i" + i).style.top = "300px";
        document.getElementById("i" + i).style.opacity = 0;
    }
    if (index > 29) document.getElementById("back").src = "images/set2.png";
    else document.getElementById("back").src = "images/set1.png";

    document.getElementById("i" + count--).style.opacity = 1;
}
run();

document.onpointerdown = dragHandler;
window.onresize = resize;