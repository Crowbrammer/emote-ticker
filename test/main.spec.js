const expect = require("chai").expect;
const getEmoteFromMessage = require("../helpers/recording").getEmoteFromMessage;

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

  xit("Stores sticker info into a db", () => {
    // // Ex: :emote/mine/npcanon88/37a499809000955_300240:
    // expect(My first test).to.equal(My comparison)
  });
});
