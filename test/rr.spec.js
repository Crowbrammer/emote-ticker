const expect = require("chai").expect;
const rrStartVerifier = require("../helpers/games/rr").rrStartVerifier;

describe("Russian Roulette", () => {
  it("Makes sure Mocha is working", () => {
    expect(true).to.be.true;
  });

  it("Verifies the !rr string", () => {
    const strings = [
      "", // 0
      "aousnthaoe", // 1
      "!rr", // 2
      "!rr @", // 3
      "!rr @euaeuu", // 4
      "!rr aeuao", // 5
      "!rr aeuao aeuue", // 6
      "!rr @aoeueau auoe", // 7
      "!rr  @aoeueau auoe", // 8
      "!rr      @aoeueau auoe", // 9
      " !rr", // 10
      "    !rr", // 11
      "!rr  aeouoe@ueobah" // 12
    ];

    expect(/^test/.test("test stuff")).to.be.true;
    // It shouldn't even receive an empty string
    expect(rrStartVerifier(strings[0])).to.equal(
      "ERROR: Empty strings shouldn't reach this function"
    );
    expect(rrStartVerifier(strings[1])).to.equal(
      "ERROR: Strings that don't start with '!rr' shouldn't reach this function"
    );
    expect(rrStartVerifier(strings[2])).to.equal(
      'Please specify a user you\'d like to kill "!rr @username"'
    );
    expect(rrStartVerifier(strings[3])).to.equal(
      "You've started the \"@\" but didn't specify the user. Specify who you'd like to kill!"
    );
    expect(rrStartVerifier(strings[4])).to.equal(
      "Starting Russian Roulette..."
    );
    expect(rrStartVerifier(strings[5])).to.equal(
      "So the other person's name is highlighted, we require that you put an @ before their name!"
    );
    expect(rrStartVerifier(strings[6])).to.equal(
      "So the other person's name is highlighted, we require that you put an @ before their name!"
    );
    expect(rrStartVerifier(strings[7])).to.equal(
      "Starting Russian Roulette..."
    );
    // Should ignore everything after "!rr @username"
    expect(rrStartVerifier(strings[8])).to.equal(
      "Starting Russian Roulette..."
    );
    expect(rrStartVerifier(strings[9])).to.equal(
      "Starting Russian Roulette..."
    );
    expect(rrStartVerifier(strings[10])).to.equal(
      'Please specify a user you\'d like to kill "!rr @username"'
    );
    expect(rrStartVerifier(strings[11])).to.equal(
      'Please specify a user you\'d like to kill "!rr @username"'
    );
    expect(rrStartVerifier(strings[12])).to.equal(
      "Starting Russian Roulette..."
    );
  });

  xit("Tests adding to undefined", () => {
    expect(undefined + 1).to.be.undefined;
  });

  it("checks for starting cookies before playing", () => {
    const sender = {};
    const getCookieCount = sender => {
      if (cookieDb.hasOwnProperty(sender)) {
        let usrcookie = cookieDb[sender].cookies + 1;
        return usrcookie;
      } else {
        return 0;
      }
    };
  });

  it("tests my RegExp for selecting the player", () => {
    let msgcontent = "!rr @npcanon88";
    expect(RegExp("@.+").exec(msgcontent)[0]).to.equal("@npcanon88");
    msgcontent = "!rr @npcanon88 eauau";
    expect(RegExp("@[\\w|\\d]+").exec(msgcontent)[0]).to.equal("@npcanon88");
    let player2 = RegExp("@[\\w|\\d]+")
      .exec(msgcontent)[0]
      .slice(1);
    expect(player2).to.equal("npcanon88");
  });

  it("Creates an rrGame on start", () => {
    expect(createAnRRGame()).to.be.an("rrGame");
  });

  it("responds rightly if the other play user hasn't responded on time", done => {
    rrWaitFunc().catch(err => {
      expect(err);
    });
  });
});
