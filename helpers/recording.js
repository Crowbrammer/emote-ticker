const fs = require("fs");
const extend = require("jquery.extend");

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
      // console.log("Db File read.");
      dbs.emoteDb = JSON.parse(data);
      dbs.tempDb = JSON.parse(data); //now it an object
      // console.log("Db Objects initialized.");
      callback(dbs); // I don't know how to pass in an error to the CB.
      // A promise should be used...
    }
  });
}

// Update the Db entry if the emote already exists, otherwise add the emote to Db:
/**
 *
 * @param {String} emote     The id of the emote.
 * @param {String} emoteTemp The object representing the last emote before we update it.
 */
function writeToDb(emote, emoteTemp) {
  if (emoteDb.hasOwnProperty(emote)) {
    emoteDb[emote].seenCount = ++emoteDb[emote].seenCount;
    emoteDb[emote].lastSeen = emoteTemp.lastSeen;
    // console.log("Emote in Db Object Updated.");
  } else {
    emoteDb[emote] = {
      emoteCode: emoteTemp.emoteCode,
      emoteUrl: emoteTemp.emoteUrl,
      emoteId: emoteTemp.emoteId,
      seenCount: emoteTemp.seenCount,
      firstSeen: emoteTemp.lastSeen,
      lastSeen: emoteTemp.lastSeen
    };
    // console.log("New Emote added to Db Object.");
  }
}

/**
 *
 * @param {String} path       Location for the file to be made
 * @param {Object} emoteDb    Object containing all the emotes.
 * @param {Function} callback Optional callback, usually for testing
 */
function createBackup(path, emoteDb, callback, details) {
  // Convert emoteDb object into json string:
  var currentEmoteDbJson = JSON.stringify(emoteDb);
  fs.writeFile(path, currentEmoteDbJson, "utf8", function writeFileCallback(
    err
  ) {
    if (err) {
      console.log(err);
    }
    // console.log("Db Files updated.");
    // This callback is for testing purposes. But it can be used if
    // something should be called after this function is done.
    // PROMISE TO LEARN PROMISES, AARON.
    callback(details.message);
  });
}

/**
 * Overwrite the JSON backup if the current JSON has
 * fewer keys than the current emoteDb.
 * @param {Object}   emoteDb   An object containing all the emotes
 * as keys to other objects containing their properties
 * @param {String}   path      A path from the root directory to
 * the file you want to create.
 * @param {Function} callback  An optional callback. Used for
 * primarily for testing purposes. A status parameter and maybe
 * a new db object will be passed into it.
 *
 * NOTE: THIS ASSUMES WE WILL NEVER DELETE AN EMOTE.
 * Perhaps we should consider an additive, version-control
 * style thing where you only create new files, never
 * overwrite them?
 *
 * NOTE: PATH FROM ROOT DIRECTORY
 *
 * NOTE: Use the callback to update the emoteDb, if it's older
 * than the json file's db.
 */
function backupAsJson(emoteDb, path, callback) {
  // This should only be run if the current JSON has
  // more entries than the JSON backup.
  var message;
  var details;
  fs.stat(path, function ifFileExists(err, stats) {
    if (err) {
      // Create the backup if the file doesn't exist.
      message = "Database file didn't exist. New JSON database file created";
      details = { message: message, err: err, stats: stats };
      createBackup(path, emoteDb, callback, details);
      return;
    } else {
      // Compare entries between the current backup and
      // current emoteDb.

      // Note: This will throw an error if the file is
      // not a JSON file... This is why I should use
      // promises...

      // Wow, I was reading the path ("C:\blah...") as JSON. I need to get the file
      // and actually convert it to a string and put that into the
      // JSON.parse function.
      fs.readFile(path, (err, jsonDb) => {
        if (err) throw err;
        const currentJsonDb = JSON.parse(jsonDb);
        if (Object.keys(currentJsonDb).length > Object.keys(emoteDb).length) {
          // How do I set the global emoteDb to currentJsonDb from here?
          callback(
            "Existing JSON database is newer than the current. Replacing current with backup JSON.",
            currentJsonDb
          );
          return;
        } else {
          // Because we're doing this based on the lengths of the
          // keys, we're trusting that the current database object
          // is more trustworthy than the backup, because it pro-
          // bably has more recent, relevant info.
          message = "emoteDb.json overwritten.";
          details = { message: message, err: err, stats: stats };
          createBackup(path, emoteDb, callback, details);
        }
      });
    }
  });

  // console.log("Db Objects converted to JSON strings.");
  // Write emoteDb to a file in the data directory:
}

module.exports = {
  getEmoteFromMessage: getEmoteFromMessage,
  sliceByTime: sliceByTime,
  arrayToBow: arrayToBow,
  readDbJSON: readDbJSON,
  writeToDb: writeToDb,
  backupAsJson: backupAsJson
};
