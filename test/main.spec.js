const expect = require("chai").expect;
const getEmoteFromMessage = require("../helpers/recording").getEmoteFromMessage;
const sliceByTime = require("../helpers/recording").sliceByTime;
const arrayToBow = require("../helpers/recording").arrayToBow;
const readDbJSON = require("../helpers/recording").readDbJSON;
const getEmoteId = require("../helpers/recording").getEmoteId;
const makeEmoteUrl = require("../helpers/retrieving").makeEmoteUrl;

describe("Emote Ticker", () => {
  var stickerData = new Map();
  beforeEach(() => {
    // Set up a mock sticker map. This may make no sense to you
    // if you're new dev. Learn what ES2016 Maps are:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
    stickerData.set(1559363923054, "376849f2c000955_274351");
    stickerData.set(1559363923799, "376849f2c000955_274351");
    stickerData.set(1559363928385, "36095b58a009292_250342");
    stickerData.set(1559363928957, "36095b58a009292_250342");
  });

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
    expect(
      getEmoteFromMessage(":emote/mine/npcanon88/37a499809000955_300240:")
    ).to.equal("37a499809000955_300240");
  });

  it("Lists the emotes used within a certain timeframe", () => {
    // Call sliceByTime with a start time less than the earliest emote
    // and an end time later than the latest emote. Then add the
    // emote (sticker) usage and their time stamps.
    expect(sliceByTime(1559363923053, 1559363928958, stickerData)).to.be.eql([
      "376849f2c000955_274351",
      "376849f2c000955_274351",
      "36095b58a009292_250342",
      "36095b58a009292_250342"
    ]);
  });

  it("Tallies the number of times an emote is used for a list of emotes", () => {
    const slicedStickers = sliceByTime(
      1559363923053,
      1559363928958,
      stickerData
    );
    expect(arrayToBow(slicedStickers)).to.eql({
      "376849f2c000955_274351": 2,
      "36095b58a009292_250342": 2
    });
  });

  it("Read Db JSON and parse into Db objects", done => {
    readDbJSON("./test/mocks/mockDb.json", dbs => {
      const DB = {
        name: "Tasty",
        age: 800,
        friends: ["NPCAnon88", "FearandLoading"]
      };
      expect(dbs.tempDb).to.eql(DB);
      done();
    });
  });

  it("Finds the unique ID of the emote within the Db or add 1 to the total keys", () => {
    emoteDb = {};
    emote = "3652e8a6f0057fa_300242";
    expect(getEmoteId(emote, emoteDb)).to.equal(0);
    emoteDb[emote] = {
      emoteCode: emote,
      emoteUrl: makeEmoteUrl(this.emoteCode),
      emoteId: 0,
      seenCount: 2,
      firstSeen: 1556156165,
      lastSeen: 1561566546
    };
    expect(getEmoteId(emote, emoteDb)).to.equal(0);
    expect(getEmoteId("blah", emoteDb)).to.equal(1);
  });

  xit("Stores sticker info into a db", () => {
    // // Ex: :emote/mine/npcanon88/37a499809000955_300240:
    // expect(My first test).to.equal(My comparison)
  });
});
