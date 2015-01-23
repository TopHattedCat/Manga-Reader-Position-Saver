// ==UserScript==
// @name         Manga Reader Position Saver
// @namespace    http://github.com/tophattedcat
// @version      1
// @description  Saves chapters and pages on Manga Reader
// @author       Top Hatted Cat
// @match        http://*.mangareader.net/*
// @grant        none
// ==/UserScript==

function GetInfo() {
    var url = location.href;
    url = url.split("/");
    console.log(url.length);
    if ((url.length === 4) && (url[3] !== "")) {
        console.log(url[3]);
        return {"Name": url[3], IsIndex: true};
    } else if (url.length < 5) {
        return;
    }
    return {"Name": url[3], "Chapter": Number(url[4]), "Page": Number(url[5] || 1)};
}

function LatestPosition(name) {
    var pos = localStorage.getItem("manga_" + name);
    if (!pos) {
        return {"Chapter": 1, "Page": 1};
    }
    var pos = JSON.parse(pos);
    return pos;
}

function RecordPosition(name, chapter, page) {
    var posInfo = JSON.stringify({"Chapter": chapter, "Page": page});
    localStorage.setItem("manga_" + name, posInfo);
}

document.addEventListener("load", function() {
	var info = GetInfo();
    if (!info) { return; }
    var latest = LatestPosition(info.Name);
    if (info.IsIndex) {
        var redirect = confirm("Go to latest position, chapter " + latest.Chapter + " page " + latest.Page + "?");
        if (redirect) {
            location.href = "http://mangareader.net/" + info.Name + "/" + latest.Chapter + "/" + latest.Page;
        }
    } else {
        if ((latest.Chapter < info.Chapter) && (latest.Page < info.Page)) {
            return;
        }
        RecordPosition(info.Name, info.Chapter, info.Page);
        console.log("Recorded new position.");
    }
});
