const config = require("./config");
const express = require("express");
const app = express();

// There's a more succinct way to write this.
const recordingModule = require("./helpers/recording");
const retrievingModule = require("./helpers/retrieving");
const getEmoteFromMessage = recordingModule.getEmoteFromMessage;
const sliceByTime = retrievingModule.sliceByTime;
const arrayToBow = retrievingModule.arrayToBow;
const makeEmoteUrl = retrievingModule.makeEmoteUrl;
const getCondition = retrievingModule.getCondition;
const top5Bow = retrievingModule.top5Bow;
const rr = require("./helpers/games/rr");
const shouldWeStartRR = rr.shouldWeStartRR;
const russianRoulette = rr.russianRoulette;
const rrWaitFunc = rr.rrWaitFunc;

const LISTEN_PORT = 8080;

app.use("/", express.static(__dirname + "/public"));
app.get("/chartdata", function(req, res) {
  let curTime = Date.now();
  let dataSlice = sliceByTime(curTime - 60000 * 3, curTime, eventData);
  let curBow = top5Bow(arrayToBow(dataSlice));
  let keys = curBow.map(a => a.key);
  let vals = curBow.map(a => a.value);

  /**
   * CONDITIONS:
   * Bows changed, but order has not
   * Bows the same
   * Bows changed, order has changed
   * Bows changed, image(s) removed
   *
   * ASSIGNMENTS:
   * emotes (keys)
   * data
   * emoteSrcs
   *
   * LOOPS:
   * None.
   */

  // make some calls to database, fetch some data, information, check state, etc...
  if (keys.length >= 1) {
    // Have code that tells if there's a change or not.
    var imageSrcs = [];
    keys.forEach(emote => {
      imageSrcs.push(makeEmoteUrl(emote));
    });
    // CONDITION LOGIC SHOULD GO HERE.
    var dataToSendToClient = {
      condition: getCondition(lastBow, curBow),
      labels: keys,
      data: vals,
      imageSrcs: imageSrcs
    };
    // convert whatever we want to send (preferably should be an object) to JSON
  } else {
    var dataToSendToClient = { condition: -1, labels: [], data: [] };
  }
  var JSONdata = JSON.stringify(dataToSendToClient);
  res.send(JSONdata);
});

app.listen(LISTEN_PORT, function() {
  console.log("Example app listening on port ", LISTEN_PORT, "!");
});

//collecting data
var lastBow;
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

var rrGameInProgress = false;
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

    if (shouldWeStartRR(msg.content)) russianRoulette(msg.content);
  });
});
