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


module.exports = { 
  getEmoteFromMessage: getEmoteFromMessage,
  sliceByTime: sliceByTime 
};
