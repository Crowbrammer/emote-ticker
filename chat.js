const WebSocket = require("ws");
const fs = require("fs");
const config = require("./config");
const axios = require("axios");
const https = require("https");
const querystring = require("querystring");
const timeseries = require("timeseries-analysis");
const express = require("express");
const d3 = require("d3");
var path = require("path");
const app = express();

const listenPort = 8080;

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

app.listen(listenPort, function() {
  console.log("Example app listening on port ", listenPort, "!");
});

const ws = new WebSocket("wss://graphigostream.prd.dlive.tv", "graphql-ws");

//collecting data
var eventData = new Map();

/**
 * It takes an emote message from Dlive and records it into the eventData map.
 *
 * (Interesting way to store data! Possibly take past DB totals with Map totals.
 * Combine them so that you don't have to do a DB query each time somebody emotes.)
 * @param {string} message
 */
const recordData = message => {
  let splitStr = message.content
    .substr(1)
    .slice(0, -1)
    .split("/");
  let emote = splitStr[3];
  let time = Date.now();
  let dataEntry = emote;
  eventData.set(time, dataEntry);
  console.log("eventData:", eventData);
};

/**
 * Not sure what this is supposed to look like.
 *
 * @param {Date} startTime Now minus three minutes
 * @param {Date} endTime   Now
 * @param {Map} xdata      A map of... ?
 * @return {Array} chunk
 */
function sliceByTime(startTime, endTime, xdata) {
  let chunk = [];
  for (const [key, value] of xdata) {
    if (key < endTime && key > startTime) {
      chunk.push(value);
    }
  }
  return chunk;
}

function arrayToBow(array) {
  let bow = {};
  for (const word of array) {
    if (!bow[word]) {
      bow[word] = 1;
    } else {
      bow[word] += 1;
    }
  }
  return bow;
}

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

const makeEmoteUrl = emote => {
  return "".concat("https://images.prd.dlivecdn.com/emote/", emote);
};

const onNewMsg = data => {
  if (data.type === "ka") return;
  if (data.type === "data") {
    let payload = data.payload;
    let payData = payload.data;
    for (let i = 0; i < payData.streamMessageReceived.length; i++) {
      let message = payData.streamMessageReceived[i];
      if (message.type === "Message") {
        let splitStr = message.content
          .substr(1)
          .slice(0, -1)
          .split("/");
        if (splitStr[0] === "emote") {
          recordData(message);
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
            message.sender.displayname,
            "MESSAGE: ",
            message.content
          );
        }
      }
    }
  }
};

ws.on("message", function(data) {
  if (!data || data == null) return;
  onNewMsg(JSON.parse(data));
});

ws.on("open", function() {
  ws.send(
    JSON.stringify({
      type: "connection_init",
      payload: {}
    })
  );
  ws.send(
    JSON.stringify({
      id: "1",
      type: "start",
      payload: {
        variables: {
          streamer: config.streamer
        },
        extensions: {},
        operationName: "StreamMessageSubscription",
        query:
          "subscription StreamMessageSubscription($streamer: String!) {\n  streamMessageReceived(streamer: $streamer) {\n    type\n    ... on ChatGift {\n      id\n      gift\n      amount\n      recentCount\n      expireDuration\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatHost {\n      id\n      viewer\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatSubscription {\n      id\n      month\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatChangeMode {\n      mode\n    }\n    ... on ChatText {\n      id\n      content\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatFollow {\n      id\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatDelete {\n      ids\n    }\n    ... on ChatBan {\n      id\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatModerator {\n      id\n      ...VStreamChatSenderInfoFrag\n      add\n    }\n    ... on ChatEmoteAdd {\n      id\n      ...VStreamChatSenderInfoFrag\n      emote\n    }\n  }\n}\n\nfragment VStreamChatSenderInfoFrag on SenderInfo {\n  subscribing\n  role\n  roomRole\n  sender {\n    id\n    username\n    displayname\n    avatar\n    partnerStatus\n  }\n}\n"
      }
    })
  );
  console.log("after chat should have been connected to...");
});
