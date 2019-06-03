const fs = require("fs");

function getEmoteFromMessage(messageContent) {
  if (messageContent.charAt(0) !== ":") return false;
  let splitStr = messageContent
    .substr(1)
    .slice(0, -1)
    .split("/");
  let emote = splitStr[3];
  return emote;
}

/**
 * List values (us. emotes) that have a timestamp within the start and end time..
 * @param {Date} startTime Now minus three minutes
 * @param {Date} endTime   Now
 * @param {Map} xdata      A map of... ?
 * @return {Array} chunk   A list of the emotes used within the timeframe.
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

/**
 *
 * @param {Array} array An array of emote strings
 */
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

/**
 * Read Db JSON and parse into Db objects.
 *
 * @param {String} jsonFile  Location of the JSON file that stores the emotes.
 * @return {Promise} dbs      The tempDb and the emoteDb stored into an object literal
 *
 * NOTE: ALL FILES ARE REFERENCED FROM HERE, WHERE
 * THIS FUNCTION IS DEFINED.
 */
function readDbJSON(jsonFile, callback) {
  const dbs = {};
  fs.readFile(jsonFile, "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("Db File read.");
      dbs.emoteDb = JSON.parse(data);
      dbs.tempDb = JSON.parse(data); //now it an object
      console.log("Db Objects initialized.");
      callback(dbs); // I don't know how to pass in an error to the CB.
      // A promise should be used...
    }
  });
}

/**
 * Find the unique ID of the emote within the Db or add 1 to the total keys
 * @param  {String} emote
 * @return {String} emoteId OR
 * @return {Number}
 */
function getEmoteId(emote, emoteDb) {
  if (emoteDb.hasOwnProperty(emote)) {
    return emoteDb[emote].emoteId;
  } else {
    return Object.keys(emoteDb).length;
  }
}

module.exports = {
  getEmoteFromMessage: getEmoteFromMessage,
  sliceByTime: sliceByTime,
  arrayToBow: arrayToBow,
  readDbJSON: readDbJSON,
  getEmoteId: getEmoteId
};
