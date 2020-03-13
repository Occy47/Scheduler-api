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

router.get("/events/update/:id/:title/:start/:end", function(req, res, next) {
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
  var filteredData = jsonData.events.filter(event => event.id !== newId);
  filteredData.push(newEvent);
  var newState = { events: filteredData };
  var jsonDataString = JSON.stringify(newState);

  fs.writeFile("dataLog.json", jsonDataString, err => {
    if (err) throw err;
    res.send("Event was updated!");
  });
});

router.get("/help", function(req, res, next) {
  try {
    res.sendFile(path.join(__dirname + "/help.html"));
  } catch (err) {
    console.error(err);
  }
});

router.get("/search", function(req, res, next) {
  try {
    res.sendFile(path.join(__dirname + "/search.html"));
  } catch (err) {
    console.error(err);
  }
});

router.get("/search/:date", function(req, res, next) {
  var date = new Date(req.params.date).getTime() / 1000;

  var data = fs.readFileSync("dataLog.json");
  var jsonData = JSON.parse(data);
  var filteredData = jsonData.events.filter(
    event => event.start > date && event.end < date + 86400
  );

  function timeFormat(unixDate) {
    var date = new Date(unixDate * 1000);

    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();

    var formattedTime = hours + ":" + minutes.substr(-2) + " h";
    return formattedTime;
  }

  function dateFormat(unixDate) {
    var date = new Date(unixDate);
    var months = [
      "Siječnja",
      "Veljače",
      "Ožujka",
      "Travnja",
      "Svibnja",
      "Lipnja",
      "Srpnja",
      "Kolovoza",
      "Rujna",
      "Listopada",
      "Studenog",
      "Prosinca"
    ];

    var month = months[date.getMonth()];
    var day = date.getDate();
    var year = date.getFullYear();

    var formattedTime = day + ". " + month + " " + year + ". godine";
    return formattedTime;
  }

  try {
    res.setHeader("Content-type", "text/html");
    if (filteredData.length !== 0) {
      res.send(
        "<h2>Sastanci na dan: " +
          dateFormat(req.params.date) +
          "</h2>" +
          filteredData.map(
            event =>
              "<p><strong>Naziv: </strong>" +
              event.title +
              "<strong> Početak: </strong>" +
              timeFormat(event.start) +
              "<strong> Kraj: </strong>" +
              timeFormat(event.end) +
              "</p>"
          )
      );
    } else res.send("<h2>Sastanci na dan: " + dateFormat(req.params.date) + "</h2> <p>Nema sastanaka</p>");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
