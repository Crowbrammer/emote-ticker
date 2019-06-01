function getEmoteFromMessage(messageContent) {
  if (messageContent.charAt(0) !== ":") return false;
  let splitStr = messageContent
    .substr(1)
    .slice(0, -1)
    .split("/");
  let emote = splitStr[3];
  return emote;
}


// const recordEmote = emote => {  
//   let time = Date.now();
//   eventData.set(time, emote);
//   console.log("eventData:", eventData);
// };

module.exports = { getEmoteFromMessage: getEmoteFromMessage };
