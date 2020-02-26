var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");

router.get("/", function(req, res, next) {
  console.log("server restarting");
  res.send("API is working properly");
});

var data = fs.readFileSync("dataLog.json");
var events = JSON.parse(data);

router.get("/events", function(req, res, next) {
  res.send(events);
});

router.get("/events/add/:id/:title/:start/:end", function(req, res, next) {
  var newId = req.params.id;
  var newTitle = req.params.title;
  var newStart = req.params.start;
  var newEnd = req.params.end;

  var newEvent = {
    id: newId,
    title: newTitle,
    start: newStart,
    end: newEnd
  };

  var data = fs.readFileSync("dataLog.json");
  var jsonData = JSON.parse(data);
  jsonData.events.push(newEvent);

  var jsonDataString = JSON.stringify(jsonData);

  fs.writeFile("dataLog.json", jsonDataString, err => {
    if (err) throw err;
    res.send('The "data to append" was appended to file!');
  });
});

router.get("/events/delete/:id", function(req, res, next) {
  var newId = req.params.id;

  var data = fs.readFileSync("dataLog.json");
  var jsonData = JSON.parse(data);
  var filteredData = jsonData.events.filter(event => event.id !== newId);

  var jsonDataString = JSON.stringify({ events: filteredData });
  fs.writeFile("dataLog.json", jsonDataString, err => {
    if (err) throw err;
    res.send("Event deleted!");
  });
});

router.get("/help", function(req, res, next) {
  try {
    //const data = fs.readFileSync("help.html", "text/html");
    // var arrayOfStrings = data.split("\n");
    // var paragraph = document.createElement("P");
    // var list = arrayOfStrings.map(string => (paragraph.innerText = string))
    res.sendFile(path.join(__dirname + "/help.html"));
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
