const expect = require("chai").expect;
const recordingModule = require("../helpers/recording");
const retrievingModule = require("../helpers/retrieving");
const getEmoteFromMessage = recordingModule.getEmoteFromMessage;
const readDbJSON = recordingModule.readDbJSON;
const writeToDb = recordingModule.writeToDb;
const backupAsJson = recordingModule.backupAsJson;
const sliceByTime = retrievingModule.sliceByTime;
const arrayToBow = retrievingModule.arrayToBow;
const top5Bow = retrievingModule.top5Bow;
const getEmoteId = retrievingModule.getEmoteId;
const makeEmoteUrl = retrievingModule.makeEmoteUrl;
const getSeenCount = retrievingModule.getSeenCount;
const getCondition = retrievingModule.getCondition;

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

  xit("Proves how stickerData looks", () => {
    expect(stickerData[1559363923054]).to.equal("376849f2c000955_274351");
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

  it("Makes the emote URL", () => {
    const emote = "15615616548eaeu84";
    expect(makeEmoteUrl(emote)).to.equal(
      "https://images.prd.dlivecdn.com/emote/15615616548eaeu84"
    );
  });

  it("Gets the number of times the emote has been seen in chat and add 1 or return 1:", () => {
    emoteDb = {};
    emote = "3652e8a6f0057fa_300242";
    expect(getSeenCount(emote)).to.equal(1);
    emoteDb[emote] = {
      emoteCode: emote,
      emoteUrl: makeEmoteUrl(this.emoteCode),
      emoteId: 0,
      seenCount: 2,
      firstSeen: 1556156165,
      lastSeen: 1561566546
    };
    expect(getSeenCount(emote)).to.equal(3);
  });

  it("Update the Db entry if the emote already exists, otherwise add the emote to Db", () => {
    emoteDb = {};
    emote = "3652e8a6f0057fa_300242";
    let emoteTemp = {
      emoteCode: ":emote/mine/blah/3652e8a6f0057fa_300242:",
      emoteUrl: makeEmoteUrl(emote),
      emoteId: getEmoteId(emote, emoteDb),
      seenCount: getSeenCount(emote),
      lastSeen: 561651561
    };
    expect(emoteTemp).to.eql({
      emoteCode: ":emote/mine/blah/3652e8a6f0057fa_300242:",
      emoteUrl: "https://images.prd.dlivecdn.com/emote/3652e8a6f0057fa_300242",
      emoteId: 0,
      seenCount: 1,
      lastSeen: 561651561
    });
    writeToDb(emote, emoteTemp);
    expect(Object.keys(emoteDb).length).to.equal(1);
    writeToDb(emote, emoteTemp);
    expect(emoteDb[emote].seenCount).to.equal(2);
    expect(emoteDb[emote]).to.eql({
      emoteCode: ":emote/mine/blah/3652e8a6f0057fa_300242:",
      emoteUrl: "https://images.prd.dlivecdn.com/emote/3652e8a6f0057fa_300242",
      emoteId: 0,
      seenCount: 2,
      firstSeen: 561651561,
      lastSeen: 561651561
    });

    writeToDb(emote, emoteTemp);
  });

  it("Lets me know if I can pass an argument into a function without a parameter", () => {
    function unnamed() {
      return;
    }
    unnamed("hi");
  });

  it("Creates/updates the json database backups", done => {
    // How do I remove the file.
    const fs = require("fs");
    const jsonPath = require("../config").jsonPath;
    // Welcome to callback hell... (Because how do I get FS
    // To work like a Promise? Sorry if you're new to async.
    // This will likely feel very uncomfortable to you).

    // Make sure there's no JSON "db" (table).

    fs.unlink(jsonPath, err => {
      // Should I check that fs.unlink works?
      fs.stat(jsonPath, (err, stats) => {
        expect(err).to.not.be.undefined;
        expect(stats).to.be.undefined;
        // Create the JSON db
        backupAsJson(emoteDb, jsonPath, (message, newEmoteDb) => {
          expect(message).to.equal(
            "Database file didn't exist. New JSON database file created"
          );
          // It shouldn't return a db from the json if it doesn't exist.
          expect(newEmoteDb).to.be.undefined;
          // Check that the file exists.
          fs.stat(jsonPath, (err, stat) => {
            expect(err).to.be.null;
            expect(stat).to.not.be.undefined;
            // Try it again with the json file there, exact same data.
            backupAsJson(emoteDb, jsonPath, (message, newEmoteDb) => {
              expect(message).to.equal("emoteDb.json overwritten.");
              expect(newEmoteDb).to.be.undefined;
              // Test if the file is there again?
              // Try it again with the json file > the current
              backupAsJson({}, jsonPath, (message, newEmoteDb) => {
                expect(newEmoteDb).to.exist;
                expect(message).to.equal(
                  "Existing JSON database is newer than the current. Replacing current with backup JSON."
                );
                done();
              });
            });
          });
        });
      });
    });
  });

  it("Gets a random emote when !rand is called", () => {
    const randomEmote = require("../helpers/retrieving").randomEmote;
    emoteDb = {};
    emotes = ["3652e8a6f0057fa_300242", "pizza1141,", "3251351aue315_315151"];

    emotes.forEach(emote => {
      let emoteTemp = {
        emoteCode: `:emote/mine/blah/${emote}:`,
        emoteUrl: makeEmoteUrl(emote),
        emoteId: getEmoteId(emote, emoteDb),
        seenCount: getSeenCount(emote),
        lastSeen: 561651561
      };
      writeToDb(emote, emoteTemp);
    });

    expect(Object.keys(emoteDb).length).to.equal(3);
    expect(emotes).to.contain(randomEmote(emotes));
  });

  it("Makes sure top5Bow works like I think it does", () => {
    // Works with 6 emotes
    var bow = {
      "155414npc1515": 33,
      "155414tasty1515": 13,
      "155414fear1515": 54,
      "155414remy1515": 5,
      "155414pistol1515": 7,
      "155414guden1515": 14
    };
    var expectedBow = {};
    expect(top5Bow(bow)).to.eql([
      { key: "155414fear1515", value: 54 },
      { key: "155414npc1515", value: 33 },
      { key: "155414guden1515", value: 14 },
      { key: "155414tasty1515", value: 13 },
      { key: "155414pistol1515", value: 7 }
    ]);
    // Works with 4 emotes
    var bow = {
      "155414npc1515": 33,
      "155414tasty1515": 13,
      "155414fear1515": 54,
      "155414guden1515": 14
    };
    expect(top5Bow(bow)).to.eql([
      { key: "155414fear1515", value: 54 },
      { key: "155414npc1515", value: 33 },
      { key: "155414guden1515", value: 14 },
      { key: "155414tasty1515", value: 13 }
    ]);
    // Works with no emotes
    var bow = {};
    expect(top5Bow(bow)).to.eql([]);
  });

  it("Gets the right condition, based on the change to top5Bow", () => {
    //

    var prevTop5Bow = [
      { key: "155414fear1515", value: 54 },
      { key: "155414npc1515", value: 33 },
      { key: "155414guden1515", value: 14 },
      { key: "155414tasty1515", value: 13 },
      { key: "155414pistol1515", value: 7 }
    ];
    var curTop5Bow = [];
    expect(getCondition(prevTop5Bow, curTop5Bow)).to.eql([-1, "BoWs is empty"]);

    curTop5Bow = [
      { key: "155414fear1515", value: 56 },
      { key: "155414npc1515", value: 30 },
      { key: "155414guden1515", value: 20 },
      { key: "155414tasty1515", value: 17 },
      { key: "155414pistol1515", value: 10 }
    ];
    expect(getCondition(prevTop5Bow, curTop5Bow)).to.eql([
      1,
      "BoWs values changed, but array length, keys, and order has not"
    ]);

    curTop5Bow = [
      { key: "155414fear1515", value: 54 },
      { key: "155414npc1515", value: 33 },
      { key: "155414guden1515", value: 14 },
      { key: "155414tasty1515", value: 13 },
      { key: "155414pistol1515", value: 7 }
    ];
    expect(getCondition(prevTop5Bow, curTop5Bow)).to.eql([0, "BoWs the same"]);

    curTop5Bow = [
      { key: "155414npc1515", value: 33 },
      { key: "155414fear1515", value: 54 },
      { key: "155414tasty1515", value: 13 },
      { key: "155414guden1515", value: 14 },
      { key: "155414pistol1515", value: 7 }
    ];
    expect(getCondition(prevTop5Bow, curTop5Bow)).to.eql([
      2,
      "BoWs emote keys changed order, but they're all the same. Values not considered"
    ]);

    curTop5Bow = [
      { key: "155414npc1515", value: 33 },
      { key: "155414fear1515", value: 545 },
      { key: "155414tasty1515", value: 13 },
      { key: "155414guden1515", value: 14 },
      { key: "155414pistol1515", value: 7 }
    ];
    expect(getCondition(prevTop5Bow, curTop5Bow)).to.eql([
      2,
      "BoWs emote keys changed order, but they're all the same. Values not considered"
    ]);

    curTop5Bow = [
      { key: "155414npc1515", value: 33 },
      { key: "155414fear1515", value: 545 },
      { key: "gutenberg", value: 13 },
      { key: "155414guden1515", value: 14 },
      { key: "155414pistol1515", value: 7 }
    ];
    expect(getCondition(prevTop5Bow, curTop5Bow)).to.eql([
      3,
      "BoWs emotes have changed. Values not considered"
    ]);
  });
});

describe("JS Fundamentals", () => {
  it("Makes sure two arrays have the same members, O(NlogN) method (JS fundamentals)", () => {
    curTop5Bow = [
      { key: "155414fear1515", value: 54 },
      { key: "155414npc1515", value: 33 },
      { key: "155414guden1515", value: 14 },
      { key: "155414tasty1515", value: 13 },
      { key: "155414pistol1515", value: 7 }
    ];
    expect(curTop5Bow.concat()).to.eql(curTop5Bow);

    expectedSortedTop5Bow = [
      { key: "155414fear1515", value: 54 },
      { key: "155414guden1515", value: 14 },
      { key: "155414npc1515", value: 33 },
      { key: "155414pistol1515", value: 7 },
      { key: "155414tasty1515", value: 13 }
    ];

    expect("a" < "b").to.be.true;
    function sortByKey(firstEl, secondEl) {
      if (firstEl.key < secondEl.key) {
        return -1;
      } else if (firstEl.key === secondEl.key) {
        return 0;
      } else {
        return 1;
      }
    }

    // console.log("expectedSortedTop5Bow:\n\n", expectedSortedTop5Bow);
    // console.log("curTop5Bow:\n\n", curTop5Bow);
    // console.log(
    //   "curTop5Bow.concat().sort(sortByKey):\n\n",
    //   curTop5Bow.concat().sort(sortByKey)
    // );
    expect(curTop5Bow.concat().sort(sortByKey)).to.eql(expectedSortedTop5Bow);
  });

  it("Shows me how unshift works (JS fundamentals)", () => {
    // Figuring out how unshift works.
    var arr = ["apple"];
    arr.unshift("banana");
    expect(arr).to.eql(["banana", "apple"]);
  });

  xit("makes sure two arrays have the same members O(N) method.", () => {
    const areArraysEqualSets = retrievingModule.areArraysEqualSets;
    var a1 = [0, 1, 2];
    var a2 = [0, 1, 2];

    expect(areArraysEqualSets(a1, a2)).to.be.true;

    a2 = [2, 1, 0];
    expect(areArraysEqualSets(a1, a2)).to.be.true;
    a1 = [[0, 1], [1, 2], [2, 3]];
    a2 = [[0, 1], [1, 2], [2, 3]];
    expect(areArraysEqualSets(a1, a2)).to.be.true;

    a1 = [[1, 2], [0, 1], [2, 3]];
    a2 = [[0, 1], [1, 2], [2, 3]];
    expect(areArraysEqualSets(a1, a2)).to.be.true;

    a1 = [[3, 2], [0, 1], [2, 3]];
    a2 = [[0, 1], [1, 2], [2, 3]];
    expect(areArraysEqualSets(a1, a2)).to.be.false;

    a1 = [
      { key: "boop", value: 153 },
      { key: "apple", value: 50 },
      { key: "banana", value: 30 }
    ];
    a2 = [
      { key: "boop", value: 153 },
      { key: "apple", value: 50 },
      { key: "banana", value: 30 }
    ];
    expect(areArraysEqualSets(a1, a2)).to.be.true;

    a1 = [
      { key: "boop", value: 153 },
      { key: "apple", value: 50 },
      { key: "banana", value: 30 }
    ];
    a2 = [
      { key: "boop", value: 153 },
      { key: "banana", value: 30 },
      { key: "apple", value: 50 }
    ];
    expect(areArraysEqualSets(a1, a2)).to.be.true;

    // It does not check arrays of objects.
    // a1 = [
    //   { key: "boop", value: 153 },
    //   { key: "apple", value: 50 },
    //   { key: "banana", value: 30 }
    // ];
    // a2 = [
    //   { key: "bop", value: 153 },
    //   { key: "baana", value: 30 },
    //   { key: "aple", value: 50 }
    // ];
    // expect(areArraysEqualSets(a1, a2)).to.be.false;
  });

  it("Lets me know how null and undefined values behave in conditonals", () => {
    var bucket; // undefined
    if (bucket) {
      bucket = true;
    }
    expect(bucket).to.be.undefined;

    bucket = null;
    if (bucket) {
      bucket = true;
    }
    expect(bucket).to.be.null;
  });
});
