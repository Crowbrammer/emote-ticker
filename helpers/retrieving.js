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

module.exports = {
  makeEmoteUrl: makeEmoteUrl,
  getEmoteId: getEmoteId,
  getSeenCount: getSeenCount,
  randomEmote: randomEmote
};
