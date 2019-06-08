const d3 = require("d3");

// Make emote URL given it's raw code:
/**
 * Find the unique ID of the emote within the Db or get the length
 * of the # of keys. (It's zero-indexed, so this will be the ID of
 * the next emote).
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

const makeEmoteUrl = emote => {
  return "".concat("https://images.prd.dlivecdn.com/emote/", emote);
};

/**
 * Get the number of times the emote has been seen in chat and add 1 or return 1
 * @param  {String} emote The emote ID
 * @return {Number}       The # of times that it's been sent in the chat.
 */
const getSeenCount = emote => {
  if (emoteDb.hasOwnProperty(emote)) {
    return ++emoteDb[emote].seenCount;
  } else {
    return 1;
  }
};

function randomEmote(emoteDb) {
  var keys = Object.keys(emoteDb);
  return emoteDb[keys[(keys.length * Math.random()) << 0]];
}

/**
 * TESTED. Doesn't currenty work with objects.
 * See if two arrays have the same members in O(N) time.
 * @param {Array} a1 First array
 * @param {Array} a2 Second array
 */
function areArraysEqualSets(a1, a2) {
  let superSet = {};
  for (let i = 0; i < a1.length; i++) {
    const e = a1[i] + typeof a1[i];
    superSet[e] = 1;
  }

  for (let i = 0; i < a2.length; i++) {
    const e = a2[i] + typeof a2[i];
    if (!superSet[e]) {
      return false;
    }
    superSet[e] = 2;
  }

  for (let e in superSet) {
    if (superSet[e] === 1) {
      return false;
    }
  }

  return true;
}

/**
 * A sort function used to order BoWs by their emoteId.
 * @param {Object} firstEl emote observed object #1
 * @param {Object} secondEl emote observed object #2
 */
function sortByEOKey(firstEl, secondEl) {
  if (firstEl.key < secondEl.key) {
    return -1;
  } else if (firstEl.key === secondEl.key) {
    return 0;
  } else {
    return 1;
  }
}

/**
 * Show how the current top5Bow differs from the last
 * top5Bow. This helps determine whether to add, remove,
 * or move an image.
 *
 * @param {Object} prevTop5Bow The curBow from the last update. Used to see if there are any changes.
 * @param {Object} curTop5Bow An array of the top five emote observed objects. Each has an emoteId set to the "key" property. Each has the number of times it's been seen in the past X minutes set to the "value" property.
 * @return {Object}
 */
function getCondition(prevTop5Bow, curTop5Bow) {
  const CONDITIONS = new Map([
    [-1, [-1, "BoWs is empty"]],
    [0, [0, "BoWs the same"]],
    [1, [1, "BoWs values changed, but array length, keys, and order has not"]],
    [
      2,
      [
        2,
        "BoWs emote keys changed order, but they're all the same. Values not considered"
      ]
    ],
    [3, [3, "BoWs emotes have changed. Values not considered"]],
    [4, "BoWs changed and smaller in length, emote(s) removed"],
    [5, "BoWs changed and longer in length, emote(s) added"]
  ]);

  // -1, "BoWs is empty"
  if (!Array.isArray(curTop5Bow) || !curTop5Bow.length)
    return CONDITIONS.get(-1); //[-1, "BoW's empty"];

  // This conditional checks for conditions 0, 1
  //   0, "BoWs the same"
  //   1, "BoWs values changed, but array length, keys, and order has not"
  if (prevTop5Bow.length === curTop5Bow.length) {
    var emotesAtLeastChangedOrder; // will null or undefined skip the loop?
    // COULD PROBABLY COMBINE THESE TWO LOOPS. I SEPARATED THEM FOR CLARITY
    // Check if the keys are the same.
    for (let i = 0; i < prevTop5Bow.length; i++) {
      if (prevTop5Bow[i].key !== curTop5Bow[i].key) {
        // What information would be useful to pass on here?
        emotesAtLeastChangedOrder = true;
      }
    }

    if (emotesAtLeastChangedOrder) {
      // concat() without an argument creates a copy of the array.
      // These are two copies of the Top4Bows.
      var prevTop5BowCopy = prevTop5Bow.concat().sort(sortByEOKey);
      var curTop5BowCopy = curTop5Bow.concat().sort(sortByEOKey);
      // Should probably return what emoteIds are different
      // What emoteIds have been removed
      var emotesAreActuallyDifferent;
      for (let i = 0; i < prevTop5BowCopy.length; i++) {
        if (prevTop5BowCopy[i].key !== curTop5BowCopy[i].key) {
          // Maybe start collecting data on what's changed.
          emotesAreActuallyDifferent = true;
        }
      }
      if (emotesAreActuallyDifferent) {
        // 3, "BoWs emotes have changed. Values and order not considered"
        return CONDITIONS.get(3);
      } else {
        // 2, "BoWs emote keys changed order, but they're all the same. Values not considered"
        return CONDITIONS.get(2);
      }
    }

    // All the keys are the same and in the same order at this point.
    // Check if the values are the same.
    for (let i = 0; i < prevTop5Bow.length; i++) {
      if (prevTop5Bow[i].value !== curTop5Bow[i].value) {
        // 1, "BoWs values changed, but array length, keys, and order has not"
        return CONDITIONS.get(1);
      }
    }
    // 0, "BoWs the same"
    return CONDITIONS.get(0);
  }

  // 4, "BoWs changed and smaller in length, emote(s) removed"
  // 5, "BoWs changed and longer in length, emote(s) removed"
}

/**
 * List values (us. emotes) that have a timestamp within the start and end time.
 * The emote strings and the time they were used were collected from chat and put into an eventData Map.
 * In that MapThe timestamps are the keys. The emotes are the values to the keys.
 * @param {Date} startTime Now minus three minutes
 * @param {Date} endTime   Now
 * @param {Map} xdata      A map of timestamps as keys with emotesIds as values ?
 * @return {Array} chunk   A list of the emotes used between startTime and endTime.
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
 * Start with an array of emoteIds (generated by the sliceByTime function).

 * @param {Array} array An array of emote strings
 * @return {Object} An object with the emote as the key and the # of times it was called as the value.
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
 * Get the top five emotes from the "bag of words" (should be "bag of emotes");
 * Each entry in the bag of words is an "emote observed" object, shaped like this:
 *  {key: "15theemoteid21616",
 *   value: 166} // value == # of times seen in chat (in the last X minutes, depending on prior code)
 *
 * @param {Map} bow A Map with the emoteId as the key, and the # of times it's used as the value
 * @return {Array} An array of the top five emote observed objects, sorted from most viewed (at index 0) to least viewed (index 4, or -1);
 */
function top5Bow(bow) {
  return d3
    .entries(bow)
    .sort(function(a, b) {
      return a.value < b.value;
    })
    .slice(0, 5);
}

module.exports = {
  makeEmoteUrl: makeEmoteUrl,
  getEmoteId: getEmoteId,
  getSeenCount: getSeenCount,
  randomEmote: randomEmote,
  getCondition: getCondition,
  sliceByTime: sliceByTime,
  arrayToBow: arrayToBow,
  top5Bow: top5Bow,
  areArraysEqualSets: areArraysEqualSets
};
