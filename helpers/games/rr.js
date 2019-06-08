class rrGame {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    // If player1 already has a pending  game with player2, abort
    // Look at all rrGames with an active status
    // Look for games where both their names are there.
  }
}

// Used to retrieve past games from the db.
class rrGameHistory {}

/**
 * Use RegEx to verify the starting string for a Russian Roulette game.
 * @param {String} text Text used to start a Russian Roulette game.
 */
function rrStartVerifier(text) {
  // console.log(text);
  // "" sets this off
  if (text === "") return "ERROR: Empty strings shouldn't reach this function";

  // "aousnthaoe" sets this off
  if (!RegExp("^\\s*!rr").test(text))
    // What's the RegExp that wouldn't require the !
    // If it doesn't start with !rr, ignoring spaces...
    return "ERROR: Strings that don't start with '!rr' shouldn't reach this function";

  // "!rr", " !rr", and "     !rr" set this off
  if (RegExp("^\\s*!rr\\s*").test(text) && !RegExp("^s*!rr\\s*.+").test(text))
    // this RegEx is the issue. Or my conditionals are.
    return 'Please specify a user you\'d like to kill "!rr @username"';

  // "!rr @", "    !rr @", "   !rr     @", and "!rr   @" set this off
  if (RegExp("^\\s*!rr\\s*.*@+").test(text) && !RegExp("@.+").test(text))
    return "You've started the \"@\" but didn't specify the user. Specify who you'd like to kill!";

  // "!rr aeuao" and "!rr aeuao aeuue" set this off
  if (RegExp("^s*!rr\\s+.*").test(text) && !RegExp("@+").test(text))
    // There's gotta be a way to do RegEx without the &&
    return "So the other person's name is highlighted, we require that you put an @ before their name!";

  // "!rr @euaeuu", "!rr @aoeueau auoe", "!rr  @aoeueau auoe", "!rr      @aoeueau auoe"
  // and "!rr  aeouoe@ueobah" set this off
  if (RegExp("^s*!rr\\s*.*@+\\w+").test(text)) {
    return "Starting Russian Roulette...";
  }
}

/**
 * The logic to decide whether to start !rr. May send a message to the
 * user.
 * @param {String} text The message from Dlive chat
 */
function shouldWeStartRR(text) {
  if (!RegExp("!rr").test(text)) return false; // If !rr's not in it, forget it.
  if (rrStartVerifier(text) === "Starting Russian Roulette...") return true;
}

/**
 * Handles if the player doesn't respond in time. Passes the response
 * into "then" which can be used by the bot, i.e. in msg.reply(res).
 *
 * @param {rrGame} rrGame rrGame object, which has the other player's name
 * and method to abort the game.
 */
function rrWaitFunc(rrGame) {
  player2 = rrGame.player2;
  return new Promise(function(resolve, reject) {
    setTimeout(
      (resolve, reject) => {
        let gameStatus = rrplayer2.rr.curGame.status;
        if (gameStatus === "awaiting response") {
          reject(`@${rrplayer2.name} Did not answer in time`);
        } else if (gameStatus === "responded yes") {
          resolve(`@${rrplayer2.name} responded yes`);
        } else if (gameStatus === "responded no") {
          resolve(`@${rrplayer2.name} responded no. Game aborted.`);
        } else {
          reject(`Error: Unknown curGame status code "${gameStatus}"`);
        }
      },
      resolve,
      reject,
      1500
    );
  });
}

function rrFunc1(params) {}

/**
 * Russian Roulette!
 */
function russianRoulette(msgcontent) {
  let rrplayer1 = msg.sender.dliveUsername;
  let rrplayer2 = RegExp("@[\\w|\\d]+")
    .exec(msgcontent)[0] // Get the @npcanon88
    .slice(1); // Take off the @.
  var rrplayer2block = getUserFromCookieDb(rrplayer2);
  if (tempUser.cookies >= 10) {
    if (
      rrplayer2 != null &&
      rrplayer2block != null &&
      cookieDb.hasOwnProperty(rrplayer2block) &&
      rrplayer1 != rrplayer2
    ) {
      // Request an RR game.
      if (cookieDb[rrplayer2block].cookies >= 10) {
        msg.reply(
          "@" +
            rrplayer2 +
            ", @" +
            rrplayer1 +
            " would like to play Russian Roulette, type '!rr yes' to accept."
        );
        rrAwaitingResponse = 1;
        rrAwaitingPlayer2 = rrplayer2;
        rrStoredPlayer1 = rrplayer1;
        setTimeout(rrWaitFunc, 30000, rrplayer1, rrplayer2);
      } else {
        msg.reply(
          rrplayer2 +
            " needs 1000 cookies to be able to accept your challenge, but only has " +
            cookieDb[rrplayer2block].cookies +
            ", @" +
            rrplayer1
        );
      }
    } else {
      msg.reply(
        rrplayer1 +
          ", Please enter a valid Username to challenge. Example: !rr @npc88bot"
      );
    }
  } else {
    msg.reply(
      "You don't have enough cookies, @" +
        rrplayer1 +
        ", you need 1000 to play, but currently only have " +
        tempUser.cookies +
        "."
    );
  }
  // Where's the else statement?
  if (
    rrAwaitingResponse === 1 &&
    RegExp("\\s*!rr\\s*yes$").test(msg.content) &&
    msg.sender.dliveUsername == rrAwaitingPlayer2
  ) {
    rrAwaitingResponse = 0;
    var rrBulletPosition = 1 + Math.floor(Math.random() * 6);
    var rrReponses = [
      "BANG!",
      "Click. BANG!",
      "Click. Click. BANG!",
      "Click. Click. Click. BANG!",
      "Click. Click. Click. Click. BANG!",
      "Click. Click. Click. Click. Click. BANG!",
      cookieDb[rrPlayer1Blockchain].cookies,
      cookieDb[rrPlayer2Blockchain].cookies
    ];
    if (rrBulletPosition % 2 === 1) {
      msg.reply(
        rrRespones[rrBulletPosition] +
          " @" +
          rrStoredPlayer1 +
          " Died! They had " +
          cookieDb[rrPlayer1Blockchain].cookies +
          " cookies."
      );
      tempUser.cookies =
        cookieDb[rrPlayer2Blockchain].cookies +
        cookieDb[rrPlayer1Blockchain].cookies;
      cookieDb[rrPlayer1Blockchain].cookies = 0;
    } else {
      msg.reply(
        rrRespones[rrBulletPosition] +
          " @" +
          rrStoredPlayer2 +
          " Died! They had " +
          cookieDb[rrPlayer2Blockchain].cookies +
          " cookies."
      );
      cookieDb[rrPlayer1Blockchain].cookies =
        cookieDb[rrPlayer1Blockchain].cookies +
        cookieDb[rrPlayer2Blockchain].cookies;
      tempUser.cookies = 1;
      cookieDb[rrPlayer2Blockchain].cookies = 0;
    }
  }
  if (
    rrAwaitingResponse === 1 &&
    RegExp("\\s*!rr\\s*no$") &&
    msg.sender.dliveUsername == rrAwaitingPlayer2
  ) {
    msg.reply(
      msg.sender.dliveUsername + " Declined your challenge, @" + rrStoredPlayer1
    );
    rrAwaitingResponse = 0;
  } else {
    msg.reply(
      "Russian Roulette. Usage: '!rr @username' Mention another player with an '@'.  Winner takes the ALL of the loser's cookies."
    );
  }
}

module.exports = {
  rrStartVerifier: rrStartVerifier,
  russianRoulette: russianRoulette,
  shouldWeStartRR: shouldWeStartRR,
  rrWaitFunc: rrWaitFunc
};
