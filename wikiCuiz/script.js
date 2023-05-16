var red, rContent = function (data) {
    red = JSON.parse(JSON.stringify(data));
};
var query, total, correct, cat0, que0, cats, ques, interval, all_titles;
var disl = new Array(), dist = new Array();
var lstub = ["ar", "azb", "az", "ba", "bh", "bn", "bs", "ce", "ckb", "cv", "cy", "el", "fa", "fr", "he", "hi", "ilo", "inh", "ja", "kk", "ko", "ky", "lb", "lv", "mk", "ml", "ms", "mt", "my", "oc", "pt", "pt", "ru", "sl", "sr", "sv", "tg", "th", "tr", "tt", "tt", "uk", "ur", "vi", "yi", "zh-yue", "zh"];

var stubs = new Array();
stubs.push("بذرة"); stubs.push("قارالاما"); stubs.push("qaralamalar‎"); stubs.push("тамамланмаған мәҡәләләр"); stubs.push("आधार"); stubs.push("অসম্পূর্ণ"); stubs.push("U začetku"); stubs.push("Бовланза яззамаш"); stubs.push("ەکانی"); stubs.push("вĕçлемен статьясем"); stubs.push("Egin"); stubs.push("επέκταση"); stubs.push("خرد"); stubs.push("ébauche"); stubs.push("קצרמר"); stubs.push("आधार"); stubs.push("pungol nga artikulo"); stubs.push("йола йистеяьннайоаца статьяш"); stubs.push("スタブ"); stubs.push("аяқталмаған мақалалар"); stubs.push("토막글"); stubs.push("бүтүрүлбөгөн макалалар"); stubs.push("Skizz"); stubs.push("Nepabeigti raksti"); stubs.push("никулци"); stubs.push("അപൂർണ്ണ"); stubs.push("Tunas"); stubs.push("Abbozzi"); stubs.push("ဆောင်းပါးတို"); stubs.push("Esbòs"); stubs.push("!Esboço"); stubs.push("!Artigos mínimos"); stubs.push("Незавершённые статьи"); stubs.push("škrbine"); stubs.push("клице"); stubs.push("stubbar"); stubs.push("Мақолаҳои нопурра"); stubs.push("ที่ยังไม่สมบูรณ์‎"); stubs.push("taslak"); stubs.push("тәмамланмаган мәкаләләр‎"); stubs.push("эшләп бетерелмәгән мәкаләләр"); stubs.push("Незавершені статті"); stubs.push("نامکمل‏"); stubs.push("sơ khai"); stubs.push("שטומף"); stubs.push("楔類"); stubs.push("小作品");

var scr = "https://el.wikipedia.org/w/api.php?format=json&action=parse&page=Κατηγορία:Αποσαφήνιση&prop=langlinks&callback=rContent";

var elem = document.createElement('script');
elem.setAttribute('src', scr);
elem.setAttribute('type', 'text/javascript');
document.getElementsByTagName('head')[0].appendChild(elem);

elem.onload = elem.onreadystatechange = function () {
    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
        var lhtml = "<option>Select your language:</option>", checkel = true;
        var lls = red.parse.langlinks;
        for (var i = 0; i < lls.length; i++) {
            if (checkel && lls[i].lang > "el") {
                lhtml += '<option value="https://el.wikipedia.org/">Ελληνικά</option>';
                checkel = false;
            }
            var lval = "https://" + lls[i].lang + ".wikipedia.org/";
            lhtml += '<option value="' + lval + '">' + lls[i].autonym + '</option>';

            disl.push(lls[i].lang);
            dist.push(lls[i]['*']);
        }
        disl.push('el');
        dist.push('Κατηγορία:Αποσαφήνιση');

        document.getElementById("lang").innerHTML = lhtml;
    }
};
document.getElementById("spellcheckinput").addEventListener("keyup", function (e) {
    if (e.keyCode === 13) randP();
});
document.getElementById("gui").addEventListener("click", function (e) {
    if (e.target.id === "right") win(true);
    else if (e.target.id === "wrong") win(false);
});
document.getElementById("lang").addEventListener("change", function (e) {
    var la = document.getElementById("lang").value.split("://")[1].split('.')[0];
    document.getElementById("spellcheckinput").placeholder = dist[disl.indexOf(la)].split(':')[0] + " ?";
    setTimeout(function () {
        document.getElementById("lang").style.display = "none";
        document.getElementById("spellcheckinput").style.display = "block";
        document.getElementById("clock").style.display = "block";
        document.getElementById("spellcheckinput").focus();
    }, 1000);
});
document.getElementById("speed").addEventListener("change", function (e) {
    document.getElementById("secs").innerHTML = document.getElementById("speed").value + 's';
});

function randP() {
    clearTimeout(interval);

    document.getElementById("result").innerHTML = "";
    document.getElementById("quests").innerHTML = "";
    document.getElementById("answer").innerHTML = "";

    query = document.getElementById("spellcheckinput").value;
    if (query !== "") {
        go();
        return;
    }
    scr = document.getElementById("lang").value + 'w/api.php?action=query&generator=random&grnlimit=500&grnnamespace=0&prop=categories&format=json&callback=rContent';

    elem = document.createElement('script');
    elem.setAttribute('src', scr);
    elem.setAttribute('type', 'text/javascript');
    document.getElementsByTagName('head')[0].appendChild(elem);
    elem.onload = elem.onreadystatechange = function () {
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
            var maxl = 0;
            for (var key in red.query.pages) {
                if (red.query.pages[key].categories === undefined) continue;

                var length = 0;
                for (var k in red.query.pages[key].categories) length++;

                if (length > maxl) {
                    query = red.query.pages[key].title;
                    maxl = length;
                }
                if (length >= 10) break;
            }
            document.getElementById("spellcheckinput").value = query;
            go();
        }
    };
}
function go() {
    clearTimeout(interval);

    total = 0;
    correct = 0;

    scr = document.getElementById("lang").value + "w/api.php?format=json&action=query&generator=search&gsrsearch=" + query.substring(query.indexOf(':') + 1) + "&gsrlimit=25&prop=categories&cllimit=500&clshow=!hidden&callback=rContent";

    elem = document.createElement('script');
    elem.setAttribute('src', scr);
    elem.setAttribute('type', 'text/javascript');
    document.getElementsByTagName('head')[0].appendChild(elem);

    elem.onload = elem.onreadystatechange = function () {
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
            que0 = new Array();
            cat0 = new Array();
            ques = new Array();
            cats = new Array();

            if (!red.query) {
                document.getElementById("spellcheckinput").value = "";
                return;
            }
            document.getElementById("intro").style.display = "none";
            document.getElementById("gui").style.display = "block";

            for (var key in red.query.pages) {
                var t = red.query.pages[key].title.split(" (")[0];

                for (var k in red.query.pages[key].categories) {
                    var c = red.query.pages[key].categories[k].title;
                    if (notDis(c) && notForb(c) && notStub(c) && cats.indexOf(c) < 0 && compare(t, c)) {
                        ques.push(t);
                        cats.push(c);
                    }
                    que0.push(t);
                    cat0.push(c);
                }
            }
            all_titles = new Array();
            next();
        }
    };
}
function notForb(a) {
    var forbs = [" stubs", " pages", " articles", "pages ", "articles ", "infobox", "geobox", "wikidata", "wikipedia", "cs1", "isbn magic", "webarchive "];
    for (var i = 0; i < forbs.length; i++) if (a.toLowerCase().indexOf(forbs[i]) >= 0) return false;
    return true;
}
function notStub(a) {
    var la = document.getElementById("lang").value.split("://")[1].split('.')[0];
    if (lstub.indexOf(la) < 0) return true;

    var l1 = lstub.indexOf(la);
    var l2 = lstub.lastIndexOf(la);

    if (a.toLowerCase().indexOf(stubs[l1].toLowerCase()) >= 0) return false;
    if (a.toLowerCase().indexOf(stubs[l2].toLowerCase()) >= 0) return false;

    return true;
}
function compare(a, b) {
    b = b.substring(b.indexOf(':') + 1);
    if (a.replace(/[0-9/\u00A0-\u00BF]/g, '') !== a && b.replace(/[0-9/\u00A0-\u00BF]/g, '') !== b) return false;

    var puncts = /[!-.:;=?@\[\]^_`{-~\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]+/g;

    a = a.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    b = b.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

    if (a.indexOf(b) >= 0 || b.indexOf(a) >= 0) return false;

    var pa = a.replace(puncts, " ").replace(/[0-9/\u00A0-\u00BF]/g, ' ').replace(/ +/g, " ").split(' ');
    var pb = b.replace(puncts, " ").replace(/[0-9/\u00A0-\u00BF]/g, ' ').replace(/ +/g, " ").split(' ');

    for (var i = 0; i < pa.length; i++) {
        if (pa[i].length === 1 || pa.length > 1 && pa[i].length < 5) continue;
        if (b.indexOf(pa[i].substring(0, pa[i].length / 2 + 1)) >= 0) return false;
    }
    for (var j = 0; j < pb.length; j++) {
        if (pb[j].length === 1 || pb.length > 1 && pb[j].length < 5) continue;
        if (a.indexOf(pb[j].substring(0, pb[j].length / 2 + 1)) >= 0) return false;
    }
    return true;
}
function notDis(a) {
    var la = document.getElementById("lang").value.split("://")[1].split('.')[0];
    if (disl.indexOf(la) < 0) return true;
    var t = dist[disl.indexOf(la)];
    return compare(a, t);
}
function win(q) {
    clearTimeout(interval);

    document.getElementById("right").style.color = "darkolivegreen";
    document.getElementById("wrong").style.color = "firebrick";
    document.getElementById("right").disabled = true;
    document.getElementById("wrong").disabled = true;

    if (q) correct++;
    total++;
    next();
}
function next() {
    clearTimeout(interval);

    if (cats.length === 0) {
        setTimeout(function () {
            document.getElementById("quests").innerHTML = "";
            document.getElementById("answer").innerHTML = "";

            var final = Math.round(correct / total * 10000) / 100;

            if (final > 75) document.getElementById("result").style.color = "darkolivegreen";
            else if (final > 50) document.getElementById("result").style.color = "cadetblue";
            else if (final > 25) document.getElementById("result").style.color = "darkgoldenrod";
            else document.getElementById("result").style.color = "firebrick";

            document.getElementById("result").innerHTML = "<br />" + final + "%";

            setTimeout(function () {
                document.getElementById("gui").style.display = "none";
                document.getElementById("intro").style.display = "block";
            }, 5000);
        }, 2500);
        return;
    }
    var ique = Math.round(Math.random() * (cats.length - 1));
    var clue = ques[ique];
    var titl = cats[ique];

    var titles = cat0.slice(que0.indexOf(clue), que0.lastIndexOf(clue) + 1);

    ques.splice(ique, 1);
    cats.splice(ique, 1);

    var gdir = "&gcmdir=older";
    if (Math.random() > 0.75) gdir = "";

    scr = document.getElementById("lang").value + "w/api.php?format=json&action=query&generator=categorymembers&gcmnamespace=0&gcmlimit=25&gcmsort=timestamp" + gdir + "&gcmtitle=" + titl + "&prop=categories&cllimit=500&clshow=!hidden&callback=rContent";

    elem = document.createElement('script');
    elem.setAttribute('src', scr);
    elem.setAttribute('type', 'text/javascript');
    document.getElementsByTagName('head')[0].appendChild(elem);

    elem.onload = elem.onreadystatechange = function () {
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
            if (red.query === undefined || red.batchcomplete === undefined) { next(); return; }

            var qext = new Array();
            var cext = new Array();

            for (var key in red.query.pages) {
                var q = red.query.pages[key].title.split(" (")[0];
                if (q === clue || !compare(q, titl)) continue;

                for (var k in red.query.pages[key].categories) {
                    var t = red.query.pages[key].categories[k].title;

                    if (notDis(t) && notForb(t) && notStub(t) && titles.indexOf(t) < 0 && titl.toLowerCase().indexOf(t.substring(t.lastIndexOf(':') + 1).toLowerCase()) < 0 && compare(clue, t)) {
                        qext.push(q);
                        cext.push(t);
                    }
                }
            }
            var c = "", quiz = new Array(), backup = new Array();

            while (cext.length > 0) {
                var index = Math.round(Math.random() * (cext.length - 1));

                c = cext[index];
                quiz = new Array();
                quiz.push(c);
                quiz.push(clue);

                while (index >= 0) {
                    if (all_titles.indexOf(c) < 0 && quiz.indexOf(qext[index]) < 0 && compare(qext[index], titl) && compare(qext[index], c)) quiz.push(qext[index]);

                    qext.splice(index, 1);
                    cext.splice(index, 1);

                    index = cext.indexOf(c);
                }
                if (!compare(c.substring(c.indexOf(':') + 1), titl) && quiz.length > 3 || quiz.length > 5) break;
                if (quiz.length > backup.length || Math.random() > 0.5 && quiz.length === backup.length) backup = quiz.slice(0);
                if (cext.length === 0) quiz = backup.slice(0);
            }
            if (quiz.length < 3) { next(); return; }

            setTimeout(function () {
                document.getElementById("quests").innerHTML = "";
                document.getElementById("answer").innerHTML = "";

                var count = 0;
                var quizzes = new Array();

                while (count <= 3 && quiz.length > 1) {
                    var qi = 1 + Math.round(Math.random() * (quiz.length - 2));
                    document.getElementById("quests").innerHTML += "<button style='width:98%;color:çadetblue' disabled>" + quiz[qi] + "</button>";
                    quizzes.push(quiz[qi]);
                    quiz.splice(qi, 1);
                    count++;
                }
                if (quizzes.indexOf(clue) < 0) {
                    var qj = Math.round(Math.random() * (quizzes.length - 1));
                    document.getElementById("quests").innerHTML = document.getElementById("quests").innerHTML.replace(quizzes[qj], clue);
                }
                document.getElementById("answer").innerHTML += "<button id='right' style='width:48%;color:darkgoldenrod'>" + titl.substring(titl.indexOf(':') + 1) + "</button>";

                var wrong = "<button id='wrong' style='width:48%;color:darkgoldenrod'>" + quiz[0].substring(quiz[0].indexOf(':') + 1) + "</button>";
                if (Math.random() < 0.5) document.getElementById("answer").innerHTML += wrong;
                else document.getElementById("answer").innerHTML = wrong + document.getElementById("answer").innerHTML;

                all_titles.push(quiz[0]);
                interval = setTimeout(function () { win(false); }, document.getElementById("speed").value * 1000);
            }, 1000);
        }
    };
}