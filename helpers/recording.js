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

module.exports = { recordData: recordData };
