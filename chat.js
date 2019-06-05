const config = require("./config");
const express = require("express");
const d3 = require("d3");
const app = express();

// There's a more succinct way to write this.
const recordingModule = require("./helpers/recording");
const retrievingModule = require("./helpers/retrieving");
const getEmoteFromMessage = recordingModule.getEmoteFromMessage;
const sliceByTime = recordingModule.sliceByTime;
const arrayToBow = recordingModule.arrayToBow;
const makeEmoteUrl = retrievingModule.makeEmoteUrl;

const LISTEN_PORT = 8080;

app.use("/", express.static(__dirname + "/public"));
app.get("/chartdata", function(req, res) {
  let curTime = Date.now();
  let dataSlice = sliceByTime(curTime - 60000 * 3, curTime, eventData);
  let curBow = top5bow(arrayToBow(dataSlice));
  let keys = curBow.map(a => a.key);
  let vals = curBow.map(a => a.value);

  // make some calls to database, fetch some data, information, check state, etc...
  if (keys.length >= 1) {
    var dataToSendToClient = { labels: keys, data: vals };
    // convert whatever we want to send (preferably should be an object) to JSON
  } else {
    var dataToSendToClient = { labels: [], data: [] };
  }
  var JSONdata = JSON.stringify(dataToSendToClient);
  res.send(JSONdata);
});

app.listen(LISTEN_PORT, function() {
  console.log("Example app listening on port ", LISTEN_PORT, "!");
});

//collecting data
var eventData = new Map();

/**
 * It takes an emote message from Dlive and records it into the eventData map.
 * @param {string} message
 */
const recordData = message => {
  let emote;
  let time = Date.now();
  if ((emote = getEmoteFromMessage(message.content))) {
    eventData.set(time, emote);
    console.log("eventData:", eventData);
  }
};

const bow = {};

function top5bow(bow) {
  return d3
    .entries(bow)
    .sort(function(a, b) {
      return a.value < b.value;
    })
    .slice(0, 5);
}

const bowappend = word => {
  if (!bow[word] && word !== "") {
    bow[word] = 1;
  } else {
    bow[word] += 1;
  }
};

const DLive = require("dlive-js");
// const config = require('./config');

let dLive = new DLive({
  authKey: config.authKey
});

// listenToChat takes one variable and it's the dlive displayname of a user aka what you see in the url!
dLive.listenToChat("npc88bot").then(messages => {
  // messages is a rxjs behavioursubject that will give you the latest msgs on subscribing.
  messages.subscribe(msg => {
    let splitStr = msg.content
      .substr(1)
      .slice(0, -1)
      .split("/");
    if (splitStr[0] === "emote") {
      recordData(msg);
      let emote = splitStr[3];
      bowappend(emote);
      console.log(
        "Count: ",
        bow[emote],
        ", key: ",
        emote,
        "url: ",
        makeEmoteUrl(emote)
      );
      // console.log(
      //   'Save Data:', eventData
      // );
    } else {
      console.log(
        "NEW MSG FROM:",
        msg.sender.dliveUsername,
        "MESSAGE: ",
        msg.content
      );
    }
  });
});
