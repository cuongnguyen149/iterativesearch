'use strict'

var http = require('http');
var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var path = require('path');
var serverPort = 8000;
var fs = require('fs');
app.use(express.static(__dirname));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

function appendJSON(obj, path) {
    var configFile = fs.readFileSync(path);
    var config = JSON.parse(configFile);
    console.log(config)
    config.push(obj);
    var configJSON = JSON.stringify(config);
    fs.writeFileSync(path, configJSON);
}

function writeSearchObj(data) {
    var path = './app/model/prevsearches.json';
    var file = fs.readFileSync(path);
    var content = JSON.parse(file);
    var searches = content.Searches;
    searches.push(data);

    var stringContent = JSON.stringify(content);
    fs.writeFileSync(path, stringContent);
}

function writeViewedVerdict(data) {
    var path = './app/model/verdicts.json';
    var file = fs.readFileSync(path);
    var content = JSON.parse(file);
    for (var i = 0; i < content.Verdicts.length; i++) {
        var verdict = content.Verdicts[i];
        if (verdict.id == data.id) {
            var nowDate = new Date();
            var curr_date = nowDate.getDate();
            var curr_month = nowDate.getMonth() + 1;
            var curr_year = nowDate.getFullYear();

            var nowDateStr = curr_month + "/" + curr_date + "/" + curr_year;

            verdict.LastOpened = nowDateStr;
            break;
        }
    }
    var stringContent = JSON.stringify(content);
    fs.writeFileSync(path, stringContent);
}

function writeFlaggedVerdict(data) {
    var path = './app/model/verdicts.json';
    var file = fs.readFileSync(path);
    var content = JSON.parse(file);
    for (var i = 0; i < content.Verdicts.length; i++) {
        var verdict = content.Verdicts[i];
        if (verdict.id == data.id) {
            verdict.Flagged = data.Flagged;
            verdict.SearchTerms = data.SearchTerms;
            break;
        }
    }
    var stringContent = JSON.stringify(content);
    fs.writeFileSync(path, stringContent);
}

function writeNoteVerdict(data) {
    var path = './app/model/verdicts.json';
    var file = fs.readFileSync(path);
    var content = JSON.parse(file);
    for (var i = 0; i < content.Verdicts.length; i++) {
        if (content.Verdicts[i].id == data.id) {
            content.Verdicts[i].Content = data.Content;
            content.Verdicts[i].Notes = data.Notes;
            break;
        }
    }
    var stringContent = JSON.stringify(content);
    fs.writeFileSync(path, stringContent);
}

function writeNewProject(data) {
    var path = './app/model/myprojects.json';
    var file = fs.readFileSync(path);
    var content = JSON.parse(file);
    content.MyProjects.push(data);
    var stringContent = JSON.stringify(content);
    fs.writeFileSync(path, stringContent);
}

function writeProjectNote(data) {
    var path = './app/model/myprojects.json';
    var file = fs.readFileSync(path);
    var content = JSON.parse(file);
    content.Notes.push(data);
    var stringContent = JSON.stringify(content);
    fs.writeFileSync(path, stringContent);
}
//careful before running this function
function repairData(){
    var path = './app/model/verdicts.json';
    var file = fs.readFileSync(path);
    var content = JSON.parse(file);
    for (var i = 0; i < content.Verdicts.length; i++) {
        content.Verdicts[i].Notes = [];
        content.Verdicts[i].Date = "";
        content.Verdicts[i].Flagged = false;
    }
    var stringContent = JSON.stringify(content);
    fs.writeFileSync(path, stringContent);
}

app.post('/writeSearchObj', function (req, res) {
    writeSearchObj(req.body);
    res.send("Success");
});
app.post('/writeViewedVerdict', function (req, res) {
    writeViewedVerdict(req.body);
    res.send("Success");
});
app.post('/writeFlaggedVerdict', function (req, res) {
    writeFlaggedVerdict(req.body);
    res.send("Success");
});
app.post('/writenoteverdict', function (req, res) {
    writeNoteVerdict(req.body);
    res.send("Success");
});
app.post('/writeprojectnote', function (req, res) {
    writeProjectNote(req.body);
    res.send("Success");
});
app.post('/writenewproject', function (req, res) {
    writeNewProject(req.body);
    res.send("writeNewProject Success");
});
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'index.html'));
});
app.listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
});