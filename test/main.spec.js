const expect = require("chai").expect;
const getEmoteFromMessage = require("../helpers/recording").getEmoteFromMessage;
const sliceByTime = require("../helpers/recording").sliceByTime;

describe("Emote Ticker", () => {
  it("Lets me know if Mocha's working", () => {
    expect(false).to.be.false;
  });

  it("Tests if there's a : at the beginning of the message", () => {
    // message function
    /**
     * Given: message is "Hello!"
     * When:  The func is ran
     * Then:  It doesn't execute the code.
     */
    expect(getEmoteFromMessage("Hello!")).to.be.false;
    expect(getEmoteFromMessage(":emote/mine/npcanon88/37a499809000955_300240:")).to.equal(
      "37a499809000955_300240"
    )
  })

  it("Lists the emotes used within a certain timeframe", () => {
    stickerData = new Map();
    // Set up a mock sticker map. This may make no sense to you 
    // if you're new dev. Learn what ES2016 Maps are:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
    stickerData.set(1559363923054, '376849f2c000955_274351');
    stickerData.set(1559363923799, '376849f2c000955_274351');
    stickerData.set(1559363928385, '36095b58a009292_250342');
    stickerData.set(1559363928957, '36095b58a009292_250342');
    // Call sliceByTime with a start time less than the earliest emote
    // and an end time later than the latest emote. Then add the 
    // emote (sticker) usage and their time stamps. 
    expect(sliceByTime(1559363923053, 1559363928958, stickerData)).to.be.eql(
      [
        '376849f2c000955_274351', 
        '376849f2c000955_274351', 
        '36095b58a009292_250342',
        '36095b58a009292_250342'
    ]
    )



  })

  xit("Stores sticker info into a db", () => {
    // // Ex: :emote/mine/npcanon88/37a499809000955_300240:
    // expect(My first test).to.equal(My comparison)
  });
});
