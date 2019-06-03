// Make emote URL given it's raw code:
const makeEmoteUrl = emote => {
  return "".concat("https://images.prd.dlivecdn.com/emote/", emote);
};

module.exports = {
  makeEmoteUrl: makeEmoteUrl
};
