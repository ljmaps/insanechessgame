import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, push as fPush, set, onValue, remove as fRemove } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

window.addEventListener('load', function() {
  // const boardBackdrop = document.getElementById("middle-section");
  const player1Info = document.getElementById("player1-info");
  const player2Info = document.getElementById("player2-info");
  const player1Status = document.getElementById("game-status1");
  const player2Status = document.getElementById("game-status2");
  const p1Name = document.getElementById("player1-username");
  const p2Name = document.getElementById("player2-username");
  const timeOuts = document.getElementsByClassName("time-out");

  const quitButton = document.getElementById("quit-button");
  const restartButton = document.getElementById("restart-button");
  const exitButton = document.getElementById("exit-button");
  const timeSetButton = document.getElementById("time-set-button");
  
  //modal
  const overlay = document.getElementById("overlay");
  const backArrow = document.getElementById("back-arrow");

  const createButton = document.getElementById("create-button");
  const createModal = document.getElementById("create-modal");
  const modalCreateButton = document.getElementById("modal-create-button");

  const gameCodeContainer = document.getElementById("game-code-display");
  
  const joinButton = document.getElementById("join-button");
  const joinModal = document.getElementById("join-modal");
  const joinInputBox = document.getElementById("join-input-box");
  const invalidCodeMessage = document.getElementById("invalid-code-message-container");

  const creatorNameInput = document.getElementById("creator-name");
  const joinerNameInput = document.getElementById("joiner-name");

  const timeInput = document.getElementById("time-select");
  const inputtedHours = document.getElementById("hour-select");
  const inputtedMinutes = document.getElementById("minute-select");
  const inputtedSeconds = document.getElementById("second-select");
  const invalidTimeMessage = document.getElementById("invalid-time-message-container");
    
  //clocks
  const sideClock = document.getElementById("clock");

  const p1Hours = document.getElementById("p1Hours");
  const p1Minutes = document.getElementById("p1Minutes");
  const p1Seconds = document.getElementById("p1Seconds");

  const p2Hours = document.getElementById("p2Hours");
  const p2Minutes = document.getElementById("p2Minutes");
  const p2Seconds = document.getElementById("p2Seconds");

  const timeSecure = document.getElementById("time-secure");
  const timeCancel = document.getElementById("time-cancel");

  const board = document.getElementById("board");
  const lightSquareColour = "#f2ebd5";
  const darkSquareColour = "#9c5225";

  const squareSize = 48;
  board.width = squareSize * 8;
  board.height = squareSize * 8;

  const ctx = board.getContext("2d");

  //white piece images
  const whitePawn = document.getElementById("white_pawn");
  const whiteRook = document.getElementById("white_rook");
  const whiteBishop = document.getElementById("white_bishop");
  const whiteKnite = document.getElementById("white_knite");
  const whiteKing = document.getElementById("white_king");
  const whiteQueen = document.getElementById("white_queen");

  //black piece images
  const blackPawn = document.getElementById("black_pawn");
  const blackBishop = document.getElementById("black_bishop");
  const blackKnite = document.getElementById("black_knite");
  const blackRook = document.getElementById("black_rook");
  const blackKing = document.getElementById("black_king");
  const blackQueen = document.getElementById("black_queen");

  //promotion panel elements
  const whitePromotePanel = document.getElementById("white-promotion-container");
  const blackPromotePanel = document.getElementById("black-promotion-container");

  const whiteQueenifyButton = document.getElementById("whiteQueenPromote");
  const whiteKniteifyButton = document.getElementById("whiteNitePromote");
  const whiteRookifyButton = document.getElementById("whiteRookPromote");
  const whiteBishopifyButton = document.getElementById("whiteBishopPromote");

  const blackQueenifyButton = document.getElementById("blackQueenPromote");
  const blackKniteifyButton = document.getElementById("blackNitePromote");
  const blackRookifyButton = document.getElementById("blackRookPromote");
  const blackBishopifyButton = document.getElementById("blackBishopPromote");

  //banners
  const checkmateBanner1 = document.getElementById("checkmate-banner1");
  const checkmateBanner2 = document.getElementById("checkmate-banner2");
  const stalemateBanner1 = document.getElementById("stalemate-banner1");
  const stalemateBanner2 = document.getElementById("stalemate-banner2");

  // captured pieces displayed in these divs
  const player1CapturesDisplay = document.getElementById("player1-captures");
  const player2CapturesDisplay = document.getElementById("player2-captures");
  
  //sets board in start position
  //#region 

  //if playerColour===1 the bottom pieces are white and vice-versa
  var playerColour = Math.floor(Math.random() * 2);
  if (playerColour===1) {
    var piecePositions = [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
    ];
  } else {
    var piecePositions = [
      ['r', 'n', 'b', 'k', 'q', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['r', 'n', 'b', 'k', 'q', 'b', 'n', 'r']
    ];
  }

  if (playerColour === 1) {
    for (let r=0; r<2; r++) {
      for (let pieceCode=0; pieceCode<piecePositions[r].length;
        pieceCode++) {
          piecePositions[r][pieceCode] = 'b' + piecePositions[r][pieceCode];
        }
    }
    for (let r=3; r>1; --r) {
      for (let pieceCode=0; pieceCode<piecePositions[r].length;
        pieceCode++) {
          piecePositions[r][pieceCode] = 'w' + piecePositions[r][pieceCode];
        }
    }
  } else {
    for (let r=0; r<2; r++) {
      for (let pieceCode=0; pieceCode<piecePositions[r].length;
        pieceCode++) {
          piecePositions[r][pieceCode] = 'w' + piecePositions[r][pieceCode];
        }
    }
    for (let r=3; r>1; --r) {
      for (let pieceCode=0; pieceCode<piecePositions[r].length;
        pieceCode++) {
          piecePositions[r][pieceCode] = 'b' + piecePositions[r][pieceCode];
        }
    }
  }

  //4 rows of nothing
  for (let r=0; r<4; r++) {
    let empty = [];
    //8 squares of nothing
    for (let s=0; s<8; s++) {
      empty.push(false);
    }
    //between first 2 and last 2 rows (white and black)
    piecePositions.splice(2, 0, empty);
  }

  function setBackdrop() {
    //set a gradient in the appropriate direction for the backdrop
    if (playerColour === 1) {
      document.body.style.backgroundImage = (
        "linear-gradient(to top, white, rgb(24, 52, 99))");
      player1Info.style.color = "black";
    } else {
      document.body.style.backgroundImage = (
        "linear-gradient(to bottom, white, rgb(24, 52, 99))");
      player2Info.style.color = "black";
    }
  }

  setBackdrop();

  var go = 'w';

  var player1Captures = [];
  var player2Captures = [];

  var wKMoved = false;
  var bKMoved = false;
  var wLRMoved = false;
  var bLRMoved = false;
  var wRRMoved = false;
  var bRRMoved = false;

  var movingX = false;
  var movingY = false;
  var burning = [];

  var promoting = false;
  var passant = [];

  var clocks = true;

  var timeOut = false;

  var timeLimit = 600000;
  var whiteTime = timeLimit;
  var blackTime = timeLimit;
  var lastWhiteTime = false;
  var lastBlackTime = false;
  var whitePause = 0;
  var blackPause = 0;
  var gameStart = false;
  var whiteStarted = false;
  var blackStarted = false;

  setTime();
  const clocksInterval = setInterval(updateTime, 500);

  var modalling = false;

  var online = false;
  var player1 = false;
  var personsGo = false;
  var gameCode;

  var oldPlayer1Captures = player1Captures;
  var oldPlayer2Captures = player2Captures;

  var oldPromoting = promoting;
  var oldPassant = passant;

  var oldWKMoved = wKMoved;
  var oldBKMoved = bKMoved;
  var oldWLRMoved = wLRMoved;
  var oldBLRMoved = bLRMoved;
  var oldWRRMoved = wRRMoved;
  var oldBRRMoved = bRRMoved;

  var oldClocks = clocks;

  var defaultTime = timeLimit;
  var onlineDeafultPos = JSON.parse(JSON.stringify(piecePositions));

//#region 
  update();
  
  //sets pieces in correct position each go
  //#region 

  function setBoard() {
    ctx.fillStyle = lightSquareColour;
    for (let col=0; col < 8; col++) {
      for (let row=0; row < 8; row++) {
        if (col % 2 === 0) {
          if (row % 2 === 0) {
            ctx.fillRect(col*squareSize, row*squareSize,
                squareSize, squareSize);
          }
        } else if (row % 2 === 1){
          ctx.fillRect(col*squareSize, row*squareSize,
            squareSize, squareSize);
        }
      }
    }

    ctx.fillStyle = darkSquareColour;
    for (let col=0; col < 8; col++) {
      for (let row=0; row < 8; row++) {
        if (col % 2 === 1) {
          if (row % 2 === 0) {
            ctx.fillRect(col*squareSize, row*squareSize,
                squareSize, squareSize);
          }
        } else if (row % 2 === 1){
          ctx.fillRect(col*squareSize, row*squareSize,
            squareSize, squareSize);
        }
      }
    }
  }

  function setPieces(boardLayout) {
    for (let r=0; r<8; r++) {
      for (let s=0; s<8; s++) {
        let piece;
        switch (boardLayout[r][s]) {
          case 'bp':
            piece = blackPawn;
            break;
          case 'br':
            piece = blackRook;
            break;
          case 'bn':
            piece = blackKnite;
            break;
          case 'bb':
            piece = blackBishop;
            break;
          case 'bq':
            piece = blackQueen;
            break;
          case 'bk':
            piece = blackKing;
            break;
          case 'wp':
            piece = whitePawn;
            break;
          case 'wr':
            piece = whiteRook;
            break;
          case 'wr':
            piece = whiteRook;
            break;
          case 'wn':
            piece = whiteKnite
            break;
          case 'wb':
            piece = whiteBishop;
            break;
          case 'wq':
            piece = whiteQueen;
            break;
          case 'wk':
            piece = whiteKing;
            break;
          case false:
            continue;
        }
        ctx.drawImage(piece, s*squareSize, r*squareSize);
      }
    }
  }

  function setBurns() {
    for (let b=0; b < burning.length; b++) {
      ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
      ctx.fillStyle = 
      ctx.fillRect(burning[b][0]*squareSize, burning[b][1]*squareSize, squareSize, squareSize);
    }
  }

  //#endregion

  //clicks
  board.addEventListener('click', handleClick);

  function handleClick(e) {
    if ((online && (
      (playerColour === 1 && go === 'w') ||
      (playerColour === 0 && go === 'b'))) ||
      !online) {
      if (!timeOut) {
        let mouse = locateClick(board, e);
        let y = mouse.squareY;
        let x = mouse.squareX;
        let moved = false;

        for (let s=0; s<burning.length; s++) {
          if (x === burning[s][0] &
            y === burning[s][1]) {
              if (piecePositions[y][x]) {
                if ((playerColour === 0 && go === 'w') ||
                (playerColour === 1 && go === 'b')) {
                  player2Captures.unshift(piecePositions[y][x]);
                  updateCaptures(2);
                } else {
                  player1Captures.unshift(piecePositions[y][x]);
                  updateCaptures(1);
                }
                if (online) {
                  uploadCaptures();
                }
              }

              movePiece(x, y, true);

              if (online) {
                uploadPassant();
              }

              let promoteDecision = checkPromote(x, y);
              if (promoteDecision) {
                promoteDecision.style.display = 'flex';
                promoting = true;
                moved = waitToPromote(promoteDecision);
                
                burning = [];
                movingX = false;
                movingY = false;

                update();

                break;
              } else {
                burning = [];
                movingX = false;
                movingY = false;

                update();
                moved = true;

                handleMoving();
                break;
              }
          }
        }

        if (!moved && !promoting) {
          burning = [];
          if (piecePositions[y][x]) {
            if (piecePositions[y][x][0]=== go) {
              movingX = x;
              movingY = y;
              burnSpaces();

              checkBurns();
              checkcheck();
            } else {
              movingX = false;
              movingY = false;
            }
          } else {
            movingX = false;
            movingY = false;
          }
          
          update();
        }
      }
    }
  }

  function handleMoving() {
    let d = new Date();
    if (go === 'w') {
      go = 'b';
      if (!whiteStarted) {
        whiteStarted = true;
      } else {
        lastWhiteTime = d.getTime();
        blackPause += d.getTime() - lastBlackTime;

        updateTime();
      }
    } else {
      go = 'w';
      if (!blackStarted) {
        gameStart = d.getTime();
        lastBlackTime = d.getTime();
        updateTime();
        blackStarted = true;
      } else {
        lastBlackTime = d.getTime();
        whitePause += d.getTime() - lastWhiteTime;

        updateTime();
      }
    }

    if (personsGo === 1) {
      personsGo = 2;
    } else {
      personsGo = 1;
    }

    let checkmateResponse = checkMateCheck();
    if (checkmateResponse === 'checkmate') {
      clocks = false;
      checkmateBanner1.style.display = 'flex';
      checkmateBanner2.style.display = 'flex';
      if (online) {
        set(ref(database, gameCode+'/checkmate'), true);
      }
    } else if (checkmateResponse === 'stalemate') {
      clocks = false;
      stalemateBanner1.style.display = 'flex';
      stalemateBanner2.style.display = 'flex';
      if (online) {
        set(ref(database, gameCode+'/stalemate'), true);
      }
    }

    statusUpdate();

    if (online) {
      uploadSettings();
      uploadBoard();
    }
  }

//Thanks to user1693593 and BarryCap from a certain website
//for part of this function which solves my problem of a different
//sized bitmap and element. I am **overflowing** with gratitude ;)
  function locateClick(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

      let x = (evt.clientX - rect.left) * scaleX;   // scale mouse coordinates after they have
      let y = (evt.clientY - rect.top) * scaleY;     // been adjusted to be relative to element
  
    return {
      posX: x,
      posY: y,
      squareX: Math.floor(x/squareSize),
      squareY: Math.floor(y/squareSize)
    }
  }

  function movePiece(x, y) {
    let pieceCode = piecePositions[movingY][movingX];
    piecePositions[movingY][movingX] = false;
    piecePositions[y][x] = pieceCode;

    if ((movingY-y === 2 || y-movingY === 2) &&
    piecePositions[y][x][1] === 'p') {
      passant = [x, y];
    }

    //en passant
    if (passant.length>0 && piecePositions[passant[0]][passant[1]][0]!==go &&
      passant[0] === x) {
        if (((go === 'w' && playerColour === 1) ||
        (go === 'b' && playerColour === 0)) && passant[1] === y+1) {
          player1Captures.push(piecePositions[passant[1]][passant[0]]);
          updateCaptures(1);
          if (online) {
            uploadCaptures();
          }
          piecePositions[passant[1]][passant[0]] = false;
        } else if (((go === 'w' && playerColour === 0) ||
        (go === 'b' && playerColour === 1)) && passant[1] === y-1) {
          player2Captures.push(piecePositions[passant[1]][passant[0]]);
          updateCaptures(2);
          if (online) {
            uploadCaptures();
          }
          piecePositions[passant[1]][passant[0]] = false;
        }
    }

    //passant only lasts for 1 move
    if (passant.length > 0 && 
      piecePositions[passant[1]][passant[0]][0] !== go) {
        passant = [];
    }

    //castling criteria
    if (pieceCode === 'wk') {
      wKMoved = true;
    } else if (pieceCode === 'bk') {
      bKMoved = true;
    }

    if (pieceCode === 'wr') {
      if (!wLRMoved && movingX === 0) {
        wLRMoved = true;
      } else if (!wRRMoved && movingX === 7) {
        wRRMoved = true;
      }
    } else if (pieceCode === 'br') {
      if (!bLRMoved && movingX === 0) {
        bLRMoved = true;
      } else if (!bRRMoved && movingX === 7) {
        bRRMoved = true;
      }
    }

    //move rook when castling
    if (pieceCode[1] === 'k') {
      if (movingX === 4) {
        if (x === 6) {
          piecePositions[y][5] = piecePositions[y][7];
          piecePositions[y][7] = false;
        } else if (x === 2) {
          piecePositions[y][3] = piecePositions[y][0];
          piecePositions[y][0] = false;
        }
      } else if (movingX === 3) {
        if (x === 5) {
          piecePositions[y][4] = piecePositions[y][7];
          piecePositions[y][7] = false;
        } else if (x === 1) {
          piecePositions[y][2] = piecePositions[y][0];
          piecePositions[y][0] = false;
        }
      }
    }
  }

  //burning spaces
  //#region 

  function burnSpaces() {
    let pieceType = piecePositions[movingY][movingX][1];

    switch (pieceType) {
      case 'p':
        if (piecePositions[movingY][movingX][0]==='w') {
          if (playerColour === 1) {
            burnPawn(0);
          } else {
            burnPawn(1);
          }
        } else {
          if (playerColour === 1) {
            burnPawn(1);
          } else {
            burnPawn(0);
          }
        }
        break;
      case 'r':
        burnRook();
        break;
      case 'n':
        burnKnite();
        break;
      case 'b':
        burnBishop();
        break;
      case 'q':
        burnRook();
        burnBishop();
        break;
      case 'k':
        burnKing();
        break;
    }
  }

  function burnPawn(player) {
    //player===0 is the bottom pieces
    if (player === 1) {
      if (movingY !== 7) {
        //forwards move
        if (!piecePositions[movingY+1][movingX]) {
          burning.push([movingX, movingY+1]);
        }

        //taking diagonally
        if (piecePositions[movingY+1][movingX-1]) {
          if (piecePositions[movingY+1][movingX-1][0]!==go) {
            burning.push([movingX-1, movingY+1]);
          }
        }
        if (piecePositions[movingY+1][movingX+1]) {
          if (piecePositions[movingY+1][movingX+1][0]!==go) {
            burning.push([movingX+1, movingY+1]);
          }
        }
      }
    } else if (movingY !== 0) {
      //forwards move
      if (!piecePositions[movingY-1][movingX]) {
        burning.push([movingX, movingY-1]);
      }

      //taking diagonally
      if (piecePositions[movingY-1][movingX-1]) {
        if (piecePositions[movingY-1][movingX-1][0]!==go) {
          burning.push([movingX-1, movingY-1]);
        }
      }
      if (piecePositions[movingY-1][movingX+1]) {
        if (piecePositions[movingY-1][movingX+1][0]!==go) {
          burning.push([movingX+1, movingY-1]);
        }
      }
    }

    //double first moves (which preceed en passant)
    if (player === 1 & movingY === 1) {
      if (!piecePositions[movingY+2][movingX] &&
        !piecePositions[movingY+1][movingX]) {
        burning.push([movingX, movingY+2]);
      }
    } else if (player === 0 & movingY === 6) {
      if (!piecePositions[movingY-2][movingX] && 
        !piecePositions[movingY-1][movingX]) {
        burning.push([movingX, movingY-2]);
      }
    }

    //burn en passant move
    if (passant.length>0 && passant[1] === movingY) {
      let passantX = false;
      if (passant[0] === movingX - 1) {
        passantX = movingX - 1;
      } else if (passant[0] === movingX + 1) {
        passantX = movingX + 1;
      }

      if (passantX && player === 0) {
        burning.push([passantX, movingY - 1]);
      } else if (passantX) {
        burning.push([passantX, movingY + 1]);
      }
    }
  }

  function burnRook() {
    for (let up=movingY-1; up>=0; --up) {
      if (!piecePositions[up][movingX]) {
        burning.push([movingX, up]);
      } else {
        if (piecePositions[up][movingX][0]!==go) {
          burning.push([movingX, up]);
        }
        break;
      }
    }
    for (let down=movingY+1; down<8; down++) {
      if (!piecePositions[down][movingX]) {
        burning.push([movingX, down]);
      } else {
        if (piecePositions[down][movingX][0]!==go) {
          burning.push([movingX, down]);
        }
        break;
      }
    }
    for (let left=movingX-1; left>=0; --left) {
      if (!piecePositions[movingY][left]) {
        burning.push([left, movingY]);
      } else {
        if (piecePositions[movingY][left][0]!==go) {
          burning.push([left, movingY]);
        }
        break;
      }
    }
    for (let right=movingX+1; right<8; right++) {
      if (!piecePositions[movingY][right]) {
        burning.push([right, movingY]);
      } else {
        if (piecePositions[movingY][right][0]!==go) {
          burning.push([right, movingY]);
        }
        break;
      }
    }
  }

  function burnBishop() {
    //bellow
    let toBurn1 = movingX;
    let toBurn2 = movingX;
    for (let r=movingY+1; r<8; r++) {
      --toBurn1;
      toBurn2++;

      if (toBurn1>=0 && !piecePositions[r][toBurn1]) {
        burning.push([toBurn1, r]);
      } else {
        if (toBurn1>=0 && piecePositions[r][toBurn1][0]!==go) {
          burning.push([toBurn1, r]);
        }
        toBurn1 = -1;
      }

      if (toBurn2<8 && !piecePositions[r][toBurn2]) {
        burning.push([toBurn2, r]);
      } else {
        if (toBurn2<8 && piecePositions[r][toBurn2][0]!==go) {
          burning.push([toBurn2, r]);
        }
        toBurn2 = 8;
      }
    }

    //above
    toBurn1 = movingX;
    toBurn2 = movingX;
    for (let r=movingY-1; r>=0; --r) {
      --toBurn1;
      toBurn2++;

      if (toBurn1>=0 && !piecePositions[r][toBurn1]) {
        burning.push([toBurn1, r]);
      } else {
        if (toBurn1>=0 && piecePositions[r][toBurn1][0]!==go) {
          burning.push([toBurn1, r]);
        }
        toBurn1 = -1;
      
      }
      if (toBurn2<8 && !piecePositions[r][toBurn2]) {
        burning.push([toBurn2, r]);
      } else {
        if (toBurn2<8 && piecePositions[r][toBurn2][0]!==go) {
          burning.push([toBurn2, r]);
        }
        toBurn2 = 8;
      }
    }
  }

  function burnKing() {
    if (movingX!==0) {
      burning.push([movingX-1, movingY]);
    }
    if (movingX!==7) {
      burning.push([movingX+1, movingY]);
    }

    if (movingY !== 0) {
      if (movingX!==0) {
        burning.push([movingX-1, movingY-1]);
      }
      burning.push([movingX, movingY-1]);
      if (movingX!==7) {
        burning.push([movingX+1, movingY-1]);
      }
    }

    if (movingY !== 7) {
      if (movingX!==0) {
        burning.push([movingX-1, movingY+1]);
      }
      burning.push([movingX, movingY+1]);
      if (movingX!==7) {
        burning.push([movingX+1, movingY+1]);
      }
    }

    //castling
    if ((go==='w' && !wKMoved && !wRRMoved) ||
      (go==='b' && !bKMoved && !bRRMoved)) {
        if (movingX === 4 &&
          !checkSightLines(4, movingY) &&
          !checkSightLines(6, movingY) &&
          !checkSightLines(5, movingY)) {
            burning.push([6, movingY]);
        } else if (movingX === 3 &&
          !checkSightLines(3, movingY) &&
          !checkSightLines(4, movingY) &&
          !checkSightLines(5, movingY)) {
            burning.push([5, movingY]);
        }
    }
    if ((go==='w' && !wKMoved && !wLRMoved) ||
      (go==='b' && !bKMoved && !bLRMoved)) {
        if (movingX === 4 &&
          !checkSightLines(4, movingY) &&
          !piecePositions[movingY][1] &&
          !checkSightLines(2, movingY) &&
          !checkSightLines(3, movingY)) {
            burning.push([2, movingY]);
        } else if (movingX === 3 &&
          !checkSightLines(3, movingY) &&
          !checkSightLines(2, movingY) &&
          !checkSightLines(1, movingY)) {
            burning.push([1, movingY]);
        }
    }
  }

  function burnKnite() {
    if (movingY > 0) {
      if (movingY > 1) {
        burning.push([movingX-1, movingY-2]);
        burning.push([movingX+1, movingY-2]);
      }
      burning.push([movingX-2, movingY-1]);
      burning.push([movingX+2, movingY-1]);
    }

    if (movingY < 7) {
      if (movingY < 6) {
        burning.push([movingX-1, movingY+2]);
        burning.push([movingX+1, movingY+2]);
      }
      burning.push([movingX-2, movingY+1]);
      burning.push([movingX+2, movingY+1]);
    }
  }

  function checkBurns() {
    //checks if burned spaces are blocked by own pieces
    let b = 0;
    while (b < burning.length) {
      let pieceCode = piecePositions[burning[b][1]][burning[b][0]];
      if (pieceCode) {
        if (pieceCode[0] === go) {
          burning.splice(b, 1);
        } else {
          b++;
        }
      } else {
        b++;
      }
    }
  }

  //#endregion

  //checks and mates
  //#region 

  function checkcheck() {
    //cannot move into check so inspect each possible
    //future state to see if it will result in check
    
    let currentPositions = [];
    for (let r=0; r<8; r++) {
      let empty = []
      for (let c=0; c<8; c++) {
        empty.push(piecePositions[r][c]);
      }
      currentPositions.push(empty);
    }

    const currentWKMoved = wKMoved;
    const currentBKMoved = bKMoved;
    const currentWLRMoved = wLRMoved;
    const currentBLRMoved = bLRMoved;
    const currentWRRMoved = wRRMoved;
    const currentBRRMoved = bRRMoved;

    const inspectingKingCode = go + 'k';

    const currentPromoting = promoting;
    const currentPassant = passant.slice();

    const currentPlayer1Captures = player1Captures.slice();
    const currentPlayer2Captures = player2Captures.slice();

    let spaceIndex = 0;
    let inspection = false;
    while (spaceIndex<burning.length) {
      movePiece(burning[spaceIndex][0], 
        burning[spaceIndex][1]);

      let inspectingKingPos;
      for (let r=0; r<8; r++) {
        for (let c=0; c<8; c++) {
          if (piecePositions[r][c] == inspectingKingCode) {
            inspectingKingPos = [c, r];
            break;
          }
        }
        if (inspectingKingPos) {
          break;
        }
      }

      inspection = checkSightLines(inspectingKingPos[0], 
        inspectingKingPos[1]);
      if (inspection && inspection!=='blocked') {
          burning.splice(spaceIndex, 1);
      } else {
        spaceIndex++;
      }

      piecePositions = JSON.parse(JSON.stringify(currentPositions));
      wKMoved = currentWKMoved;
      bKMoved = currentBKMoved;
      wLRMoved = currentWLRMoved;
      bLRMoved = currentBLRMoved;
      wRRMoved = currentWRRMoved;
      bRRMoved = currentBRRMoved;

      promoting = currentPromoting;
      passant = currentPassant.slice();

      player1Captures = currentPlayer1Captures.slice();
      player2Captures = currentPlayer2Captures.slice();

      updateCaptures(1);
      updateCaptures(2);
    }
  }

  function checkMateCheck() {
    let kingpos;
    for (let r=0; r<8; r++) {
      for (let c=0; c<8; c++) {
        if(piecePositions[r][c] &&
          piecePositions[r][c] == go+'k') {
            kingpos = [c, r];
        }
        if (piecePositions[r][c] &&
        piecePositions[r][c][0] === go) {
          movingX = c;
          movingY = r;
          burnSpaces();
          checkBurns();
          checkcheck();

          let i=0;
          while (i < burning.length) {
            if ((burning[i][0]>7 || burning[i][0]<0) ||
            (burning[i][1]>7 || burning[i][1]<0)) {
              burning.splice(i, 1);
            } else {
              i++;
            }
          }

          if (burning.length > 0) {
            burning = [];
            return false;
          }
        }
      }
    }
    if (checkSightLines(kingpos[0], kingpos[1])) {
      return 'checkmate';
    } else {
      return 'stalemate';
    }
  }

  //#endregion

  function checkSightLines(x, y) {
    //returning true means the space is threatened
    //returning 'blocked' means it is blocked by
    //a piece of your own
    if (piecePositions[y][x]) {
      if (piecePositions[y][x][0] === go &&
        piecePositions[y][x] !== go+'k') {
          return 'blocked';
      }
    } 

    //rook movements
    for (let up=y-1; up>=0; --up) {
      if (piecePositions[up][x][0] !== go &&
        (piecePositions[up][x][1] === 'r' || 
        piecePositions[up][x][1] === 'q')) {
          return true;
      } else if (piecePositions[up][x] && 
        !(up === movingY && x===movingX)) {
        break;
      }
    }
    for (let down=y+1; down<8; down++) {
      if (piecePositions[down][x][0] !== go &&
        (piecePositions[down][x][1] === 'r' || 
        piecePositions[down][x][1] === 'q')) {
          return true;
      } else if (piecePositions[down][x] && 
        !(down === movingY && x===movingX)) {
        break;
      }
    }
    for (let left=x-1; left>=0; --left) {
      if (piecePositions[y][left][0] !== go &&
        (piecePositions[y][left][1] === 'r' || 
        piecePositions[y][left][1] === 'q')) {
          return true;
      } else if (piecePositions[y][left] && 
        !(y === movingY && left===movingX)) {
        break;
      }
    }
    for (let right=x+1; right<8; right++) {
      if (piecePositions[y][right][0] !== go &&
        (piecePositions[y][right][1] === 'r' || 
        piecePositions[y][right][1] === 'q')) {
          return true;
      } else if (piecePositions[y][right] && 
        !(y === movingY && right===movingX)) {
        break;
      }
    }

    //bishop movements
    //above

    //right
    let rx = x+1;
    for (let ay=y-1; ay>=0; --ay) {
      if (rx > 7) {
        break;
      }
      if (piecePositions[ay][rx]) {
        if (piecePositions[ay][rx][0]!==go &&
          (piecePositions[ay][rx][1] === 'b' ||
          piecePositions[ay][rx][1] === 'q')) {
            return true;
        } else if (piecePositions[ay][rx] && 
          !(ay===movingY && rx===movingX)) {
            break;
        }
      }
      rx++;
    }

    // left
    let lx = x-1;
    for (let ay=y-1; ay>=0; --ay) {
      if (lx < 0) {
        break;
      }
      if (piecePositions[ay][lx]) {
        if (piecePositions[ay][lx][0]!==go &&
          (piecePositions[ay][lx][1] === 'b' ||
          piecePositions[ay][lx][1] === 'q')) {
            return true;
        } else if (piecePositions[ay][lx] && 
          !(ay===movingY && lx===movingX)) {
            break;
        }
      }
      --lx;
    }
    //below

    //right
    rx = x+1;
    for (let by=y+1; by<8; by++) {
      if (rx > 7) {
        break;
      }
      if (piecePositions[by][rx]) {
        if (piecePositions[by][rx][0]!==go &&
          (piecePositions[by][rx][1] === 'b' ||
          piecePositions[by][rx][1] === 'q')) {
            return true;
        } else if (piecePositions[by][rx] &&
          !(by===movingY && rx===movingX)) {
            break;
        }
      }
      rx++;
    }

    //left
    lx = x-1;
    for (let by=y+1; by<8; by++) {
      if (lx < 0) {
        break;
      }
      if (piecePositions[by][lx]) {
        if (piecePositions[by][lx][0]!==go &&
          (piecePositions[by][lx][1] === 'b' ||
          piecePositions[by][lx][1] === 'q')) {
            return true;
        } else if (piecePositions[by][lx] &&
          !(by===movingY && lx===movingX)) {
            break;
        }
      }
      --lx;
    }

    //pawns
    if ((playerColour === 0 && go==='w') ||
      (playerColour === 1 && go==='b')) {
        if (piecePositions[y+1][x-1] &&
          (piecePositions[y+1][x-1][0]!==go && 
          piecePositions[y+1][x-1][1]==='p')) {
            return true;
        }
        if (piecePositions[y+1][x+1] &&
          (piecePositions[y+1][x+1][0]!==go && 
          piecePositions[y+1][x+1][1]==='p')) {
            return true;
        }
    } else {
      if (piecePositions[y-1][x-1] &&
        (piecePositions[y-1][x-1][0]!==go && 
        piecePositions[y-1][x-1][1]==='p')) {
          return true;
      }
      if (piecePositions[y-1][x+1] &&
        (piecePositions[y-1][x+1][0]!==go && 
        piecePositions[y-1][x+1][1]==='p')) {
          return true;
      }
    }

    //kings
    if (go==='w') {
      var enemyKingCode = 'bk';
    } else {
      var enemyKingCode = 'wk';
    }

    if (x>0 && piecePositions[y][x-1] === enemyKingCode) {
      return true;
    }
    if (x<7 && piecePositions[y][x+1] === enemyKingCode) {
      return true;
    }
    if (y>0) {
      if (x > 0 && piecePositions[y-1][x-1] === enemyKingCode) {
        return true;
      }
      if (piecePositions[y-1][x] === enemyKingCode) {
        return true;
      }
      if (x<7 && piecePositions[y-1][x+1] === enemyKingCode) {
        return true;
      }
    }
    if (y<7) {
      if (x > 0 && piecePositions[y+1][x-1] === enemyKingCode) {
        return true;
      }
      if (piecePositions[y+1][x] === enemyKingCode) {
        return true;
      }
      if (x<7 && piecePositions[y+1][x+1] === enemyKingCode) {
        return true;
      }
    }

    if (go==='w') {
      var enemyKniteCode = 'bn';
    } else {
      var enemyKniteCode = 'wn';
    }

    //knites
    if (y > 0) {
      if (y > 1) {
        if (x>0 && piecePositions[y-2][x-1] &&
          piecePositions[y-2][x-1]==enemyKniteCode) {
            return true;
        }
        if (x<7&& piecePositions[y-2][x+1] &&
          piecePositions[y-2][x+1]==enemyKniteCode) {
            return true;
        }
      }
      if (x>1) {
        if (piecePositions[y-1][x-2] && 
          piecePositions[y-1][x-2]==enemyKniteCode) {
            return true;
        }
      }
      if (x<6) {
        if (piecePositions[y-1][x+2] && 
          piecePositions[y-1][x+2]==enemyKniteCode) {
            return true;
        }
      }
    }
    if (y < 7) {
      if (y<6) {
        if (x>0 && piecePositions[y+2][x-1] &&
          piecePositions[y+2][x-1]==enemyKniteCode) {
            return true;
        }
        if (x<7 && piecePositions[y+2][x+1] &&
          piecePositions[y+2][x+1]==enemyKniteCode) {
            return true;
        }
      }
      if (x>1 && piecePositions[y+1][x-2] &&
        piecePositions[y+1][x-2]==enemyKniteCode) {
          return true;
      }
      if (x<6 && piecePositions[y+1][x+2] &&
        piecePositions[y+1][x+2]==enemyKniteCode) {
          return true;
      }
    }
  }

  //promoting functions:
  //#region 

  function checkPromote(x, y) {
    if (piecePositions[y][x][1]=='p' &&
    (y===0 || y===7)) {
      if (go === 'w') {
        return whitePromotePanel;
      }
      return blackPromotePanel;
    }
    return false;
  }
  
  async function waitToPromote(promotePanel) {
    await buttonPromise(promotePanel);
    promotePanel.style.display = 'none';

    handleMoving();
    return true;
  }

  function buttonPromise(panel) {
    return new Promise((resolvePromise) => {
        function handlePromo() {
          promote(this.id);

          if (panel == whitePromotePanel) {
            whiteQueenifyButton.removeEventListener('click', handlePromo);
            whiteKniteifyButton.removeEventListener('click', handlePromo);
            whiteRookifyButton.removeEventListener('click', handlePromo);
            whiteBishopifyButton.removeEventListener('click', handlePromo);
          } else {
            blackQueenifyButton.removeEventListener('click', handlePromo);
            blackKniteifyButton.removeEventListener('click', handlePromo);
            blackRookifyButton.removeEventListener('click', handlePromo);
            blackBishopifyButton.removeEventListener('click', handlePromo);
          }

          resolvePromise();
        }
        if (panel == whitePromotePanel) {
          whiteQueenifyButton.addEventListener('click', handlePromo);
          whiteKniteifyButton.addEventListener('click', handlePromo);
          whiteRookifyButton.addEventListener('click', handlePromo);
          whiteBishopifyButton.addEventListener('click', handlePromo);
        } else {
          blackQueenifyButton.addEventListener('click', handlePromo);
          blackKniteifyButton.addEventListener('click', handlePromo);
          blackRookifyButton.addEventListener('click', handlePromo);
          blackBishopifyButton.addEventListener('click', handlePromo);
        }
      }
    )
  }

  function promote(buttonId) {
    promoting = false;
    for (let r=0; r<8; r+=7) {
      for (let s=0; s<8; s++) {
        if (piecePositions[r][s] &&
          piecePositions[r][s][1] === 'p') {            
            piecePositions[r][s] = go + buttonId[5].toLowerCase();
        }
      }
      statusUpdate();
      update();
    }
  }
  
  //#endregion

  function update() {
    setBoard();
    setPieces(piecePositions);
    setBurns();
  }

  function updateCaptures(player) {
    let displayCase;
    let displayCabinet;
    if (player === 2) {
      displayCase = player2CapturesDisplay;
      displayCabinet = player2Captures;
    }
    else {
      displayCase = player1CapturesDisplay;
      displayCabinet = player1Captures;
    }

    displayCase.innerHTML = '';
    for (let p=0; p<displayCabinet.length; p++) {
      switch (displayCabinet[p]) {
        case 'wp':
          displayCase.appendChild(whitePawn.cloneNode());
          break;
        case 'wb':
          displayCase.appendChild(whiteBishop.cloneNode());
          break;
        case 'wr':
          displayCase.appendChild(whiteRook.cloneNode());
          break;
        case 'wq':
          displayCase.appendChild(whiteQueen.cloneNode());
          break;
        case 'wk':
          displayCase.appendChild(whiteKing.cloneNode());
          break;
        case 'wn':
          displayCase.appendChild(whiteKnite.cloneNode());
          break;

        case 'bp':
          displayCase.appendChild(blackPawn.cloneNode());
          break;
        case 'br':
          displayCase.appendChild(blackRook.cloneNode());
          break;
        case 'bb':
          displayCase.appendChild(blackBishop.cloneNode());
          break;
        case 'bq':
          displayCase.appendChild(blackQueen.cloneNode());
          break;
        case 'bk':
          displayCase.appendChild(blackKing.cloneNode());
          break;
        case 'bn':
          displayCase.appendChild(blackKnite.cloneNode());
          break;
      }
    }
  }

  function statusUpdate() {
    let whiteCount = [0];
    let blackCount = [0];
    let count;
    for (let r=0; r<8; r++) {
      for (let c=0; c<8; c++) {
        if (piecePositions[r][c] ) {
          if (piecePositions[r][c][0] === 'w') {
            count = whiteCount;
          } else {
            count = blackCount;
          }
          switch (piecePositions[r][c][1]) {
            case 'p':
              count[0] += 1;
              break;
            case 'n':
              count[0] += 3;
              break;
            case 'b':
              count[0] += 3;
            case 'r':
              count[0] += 5;
              break;
            case 'q':
              count[0] += 9;
              break;
          }
        }
      }
    }

    let whiteScore = whiteCount[0] - blackCount[0];
    let blackScore = blackCount[0] - whiteCount[0];

    if (whiteScore > 0 && whiteScore != 0) {
      whiteScore = '+' + String(whiteScore);
      blackScore = String(blackScore);
    } else if (blackScore != 0) {
      whiteScore = String(whiteScore);
      blackScore = '+' + String(blackScore);
    }
    if (playerColour === 1) {
      player1Status.childNodes[0].innerHTML = whiteScore;
      player2Status.childNodes[0].innerHTML = blackScore;
    } else {
      player1Status.childNodes[0].innerHTML = blackScore;
      player2Status.childNodes[0].innerHTML = whiteScore;
    }
  }
  //#endregion

  //clocks
  //#region 
  function setTime() {
    let hours = String(Math.floor(timeLimit / 3600000));
    if (hours.length < 2) {
      hours = '0' + hours;
    }
    p1Hours.innerHTML = hours;
    p2Hours.innerHTML = hours;

    let minutes = String(Math.floor(timeLimit / 60000) % 60);
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }
    p1Minutes.innerHTML = minutes;
    p2Minutes.innerHTML = minutes;

    let seconds = String(Math.floor(timeLimit / 1000) % 60);
    if (seconds.length < 2) {
      seconds = '0' + seconds;
    }
    p1Seconds.innerHTML = seconds;
    p2Seconds.innerHTML = seconds;
  }

  function updateTime() {
    if (blackStarted && clocks) {
      let time;
      let pause;
      let usingColour;
      if (go === 'w') {
        usingColour = 'WHITE';
        time = whiteTime;
        pause = whitePause;
      } else {
        usingColour = 'BLACK';
        time = blackTime;
        pause = blackPause;
      }

      let hoursDisplay;
      let minutesDisplay;
      let secondsDisplay;
      if ((go === 'w' && playerColour === 0) ||
      (go === 'b' && playerColour === 1)) {
        hoursDisplay = p2Hours;
        minutesDisplay = p2Minutes;
        secondsDisplay = p2Seconds;
      } else {
        hoursDisplay = p1Hours;
        minutesDisplay = p1Minutes;
        secondsDisplay = p1Seconds;
      }

      let d = new Date();
      time = timeLimit - ((d.getTime() - pause) - gameStart);

      let seconds = String(Math.ceil(time / 1000) % 60);
      if (seconds.length < 2) {
        seconds = '0' + seconds;
      }
      secondsDisplay.innerHTML = seconds;

      let minutes;
      if (seconds === '00') {
        minutes = String(Math.ceil(time / 60000) % 60);
      } else {
        minutes = String(Math.floor(time / 60000) % 60);
      }
      if (minutes.length < 2) {
        minutes = '0' + minutes;
      }
      minutesDisplay.innerHTML = minutes;

      let hours;
      if (seconds === '00' && minutes === '00') {
        hours = String(Math.ceil(time / 3600000));
      } else {
        hours = String(Math.floor(time / 3600000));
      }
      if (hours.length < 2) {
        hours = '0' + hours;
      }
      hoursDisplay.innerHTML = hours;

      if (time <= 0) {
        timeUp(usingColour);
      }
    }
  }

  function timeUp(colour) {
    clocks = false;

    timeOuts[0].innerHTML = colour + " TIME'S OUT";
    timeOuts[1].innerHTML = colour + " TIME'S OUT";

    timeOuts[0].style.display = 'flex';
    timeOuts[1].style.display = 'flex';

    timeOut = true;

    if (online) {
      set(ref(database, gameCode+'/colourTimedOut'), colour);
    }
  }
  //#endregion

  const webAppSettings = {
    databaseURL: 'https://chess-7e74b-default-rtdb.europe-west1.firebasedatabase.app'
  }

  const webApp = initializeApp(webAppSettings);
  const database = getDatabase(webApp);

  var gameCodeNos;
  var gameCodes = ref(database, 'gameCodes');
  onValue(gameCodes, (snapshot) => {
    gameCodeNos = [];
    snapshot.forEach((childSnapshot) => {gameCodeNos.push(childSnapshot.val())});
  });

  backArrow.addEventListener("click", disappearModal);

  function disappearModal() {
    modalling = false;
    overlay.style.display = 'none';
    createModal.style.display = 'none';
    joinModal.style.display = 'none';
    timeInput.style.display = 'none';
    invalidTimeMessage.style.display = 'none';
    invalidCodeMessage.style.display = 'none';
    joinerNameInput.value = '';
    creatorNameInput.value = '';
    joinInputBox.value = '';
    timeSecure.classList.add("unselected");
    timeSecure.classList.remove("selected");
    timeCancel.classList.add("unselected");
    timeCancel.classList.remove("selected");
  }

  createButton.addEventListener("click", () => {
    overlay.style.display = 'flex';
    createModal.style.display = 'flex';
    timeInput.style.display = 'grid';
    modalling = true;
  });

  modalCreateButton.addEventListener("click", () => {
    let hrs = Number(inputtedHours.value);
    let mins = Number(inputtedMinutes.value);
    let secs = Number(inputtedSeconds.value);
    if (timeCancel.classList.contains("selected")) {
      invalidTimeMessage.style.display = 'none';
      clocks = false;
      sideClock.style.display = 'none';
      settingGame();
    } else if (typeof hrs==='number' && typeof mins==='number' &&
    typeof secs==='number' && hrs >= 0 && mins >= 0 && mins < 60 && 
    secs >= 0 && secs < 60) {
      newTime(hrs, mins, secs);
      invalidTimeMessage.style.display = 'none';
      settingGame();
    } else {
      invalidTimeMessage.style.display = 'flex';
    }
  });

  function settingGame() {
    modalling = false;
    if (creatorNameInput.value === '') {
      p1Name.innerHTML = 'Player who forgot to enter a name';
    } else {
      p1Name.innerHTML = creatorNameInput.value;
    }
    disappearModal();
    joinButton.style.display = 'none';
    createButton.style.display = 'none';
    quitButton.style.display = 'flex';
    timeSetButton.style.display = 'none';
    restartButton.style.display = 'false';
    createGame();
  }

  function createGame() {
    online = true;
    player1 = true;
    if ((go === 'w' && playerColour === 1) ||
    (go === 'b' && playerColour === 0)) {
      personsGo = 2;
    } else {
      personsGo = 1;
    }
    gameCode = createNewCode();
    createBranch();
  }

  function createNewCode() {
    let looping = true;
    while (looping) {
      looping = false;
      var gameNo = String(Math.floor(Math.random() * 10000));
      while (gameNo.length < 4) {
        gameNo = '0' + gameNo;
      }
      var code = 'ch' + gameNo;
      for (let i=0; i<gameCodeNos.length; i++) {
        if (gameCodeNos[i] === code) {
          looping = true;
        }
      }
    }

    fPush(gameCodes, code);
    gameCodeContainer.style.display = 'block';
    gameCodeContainer.childNodes[0].innerHTML = (
      "Code: " + code);
    
      return code;
  }

  function createBranch() {
    setSettings();

    uploadBoard();
    syncBoard();

    matchSettings();
    saveSettings();
  }

  joinButton.addEventListener("click", () => {
    modalling = true;
    overlay.style.display = 'flex';
    joinModal.style.display = 'flex';
    joinerNameInput.focus();
  });

  document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && modalling) {
      let existQueery = checkGameExists(joinInputBox.value);
      if (!existQueery) {
        invalidCodeMessage.style.display = 'flex';
      } else {
        joinButton.style.display = 'none';
        createButton.style.display = 'none';
        exitButton.style.display = 'flex';
        restartButton.style.display = 'none';
        timeSetButton.style.display = 'none';

        gameCode = joinInputBox.value;
        gameCodeContainer.style.display = 'block';
        gameCodeContainer.childNodes[0].innerHTML = (
          "Code: " + gameCode);

        if (joinerNameInput.value === '') {
          p1Name.innerHTML = 'Player who forgot to enter a name';
        } else {
          p1Name.innerHTML = joinerNameInput.value;
        }
        set(ref(database, gameCode+'/p2Name'), p1Name.innerHTML);

        clearInterval(clocksInterval);
        matchNSync();
      }
    }
  });

  function checkGameExists(code) {
    let queeryResponse = false;
    onValue(ref(database, 'gameCodes'), (snapshot) => {
      snapshot.forEach((snap) => {
        if (snap.val() == code) {
          queeryResponse = true;
        }
      });
    });
    return queeryResponse;
  }

  quitButton.addEventListener("click", () => {
    setOffline();
    fRemove(ref(database, gameCode));

    onValue(ref(database, '/gameCodes'), (snapshot) => {
      snapshot.forEach((snap) => {
        if (snap.val() === gameCode) {
          fRemove(ref(database, '/gameCodes/'+snap.key));
        }
      });
    });
  });

  exitButton.addEventListener("click", setOffline);

  restartButton.addEventListener("click", () => {
    if (!online) {
      setOffline();
    } else {
      resetOnline();
    }
  });

  timeSetButton.addEventListener("click", () => {
    timeInput.style.display = 'grid';
    overlay.style.display = 'flex';
  });

  timeSecure.addEventListener("click", () => {
    if (modalling) {
      timeSecure.classList.remove("unselected");
      timeSecure.classList.add("selected");

      timeCancel.classList.remove("selected");
      timeCancel.classList.add("unselected");
    } else {
      let hrs = Number(inputtedHours.value);
      let mins = Number(inputtedMinutes.value);
      let secs = Number(inputtedSeconds.value);
      if (typeof hrs==='number' && typeof mins==='number' &&
      typeof secs==='number' && hrs >= 0 && mins >= 0 && mins < 60 && 
      secs >= 0 && secs < 60) {
        newTime(hrs, mins, secs);
        clocks = true;
        sideClock.style.display = 'inline-block';
        disappearModal();
      } else {
        invalidTimeMessage.style.display = 'flex';
      }
    }
  });

  timeCancel.addEventListener("click", () => {
    if (modalling) {
      timeCancel.classList.remove("unselected");
      timeCancel.classList.add("selected");

      timeSecure.classList.remove("selected");
      timeSecure.classList.add("unselected");
    } else {
      clocks = false;
      sideClock.style.display = 'none';
      
      disappearModal();
    }
  });

  function matchNSync() {
    online = true;
    
    matchSettings();
    saveSettings();
    syncBoard();
    disappearModal();
  }

  function setSettings() {
    set (ref(database, gameCode), {
      p1Name: p1Name.innerHTML,
      p2Name: 'AWAITING PLAYER...',

      playerColour: playerColour,
      personsGo: personsGo,
      go: go,
    
      wKMoved: wKMoved,
      bKMoved: bKMoved,
      wLRMoved: wLRMoved,
      bLRMoved: bLRMoved,
      wRRMoved: wRRMoved,
      bRRMoved: bRRMoved,
    
      promoting: promoting,
      passant: false,

      clocks: clocks,
    
      timeOut: timeOut,
    
      timeLimit: timeLimit,
      whiteTime: whiteTime,
      blackTime: blackTime,
      lastWhiteTime: lastWhiteTime,
      lastBlackTime: lastBlackTime,
      whitePause: whitePause,
      blackPause: blackPause,
      gameStart: gameStart,
      whiteStarted: whiteStarted,
      blackStarted: blackStarted,

      checkmate: false,
      stalemate: false,
      colourTimedOut: false
    });

    // array variables
    arraySetFlying(player1Captures, gameCode+'/player1Captures');
    arraySetFlying(player2Captures, gameCode+'/player2Captures');
  }

  function arraySetFlying(arraySetting, branchCode) {
    let arrayBranch =  ref(database, branchCode);
    let empty = true;
    for (let p=0; p<arraySetting.length; p++) {
      empty = false;
      fPush(arrayBranch, arraySetting[p]);
    }
    if (empty) {
      fPush(arrayBranch, false);
    }
  }

  function matchSettings() {        
    onValue(ref(database, gameCode), () => {
      saveSettings();
    });

    if (!player1) {
      onValue(ref(database, gameCode+'/p1Name'), (snapshot) => {
        p2Name.innerHTML = snapshot.val();
      });

      onValue(ref(database, gameCode+'/playerColour'), (snapshot) => {
        if (snapshot.val()=== 1) {
          playerColour = 0;
        } else {
          playerColour = 1;
        }
        setBackdrop();
      });
    }

    if (player1) {
      onValue(ref(database, gameCode+'/p2Name'), (snapshot) => {
        p2Name.innerHTML = snapshot.val();
      });
    }

    onValue(ref(database, gameCode+'/personsGo'), (snapshot) => {
      personsGo = snapshot.val();
    });
    
    onValue(ref(database, gameCode+'/go'), (snapshot) => {
      go = snapshot.val();
    });

    onValue(ref(database, gameCode+'/wKMoved'), (snapshot) => {
      wKMoved = snapshot.val();
    });
    onValue(ref(database, gameCode+'/bKMoved'), (snapshot) => {
      bKMoved = snapshot.val();
    });
    onValue(ref(database, gameCode+'/wLRMoved'), (snapshot) => {
      wLRMoved = snapshot.val();
    });
    onValue(ref(database, gameCode+'/bLRMoved'), (snapshot) => {
      bLRMoved = snapshot.val();
    });
    onValue(ref(database, gameCode+'/wRRMoved'), (snapshot) => {
      wRRMoved = snapshot.val();
    });
    onValue(ref(database, gameCode+'/bRRMoved'), (snapshot) => {
      bRRMoved = snapshot.val();
    });

    onValue(ref(database, gameCode+'/promoting'), (snapshot) => {
      promoting = snapshot.val();
    });

    onValue(ref(database, gameCode+'/clocks'), (snapshot) => {
      clocks = snapshot.val()
      if (clocks === false) {
        sideClock.style.display = 'none';
      }
    });
    
    let timeLimitCheck = false;
    let timeOutCheck = false;
    let whiteTimeCheck = false;
    let blackTimeCheck = false;
    let lastWhiteTimeCheck = false;
    let lastBlackTimeCheck = false;
    let whitePauseCheck = false;
    let blackPauseCheck = false;
    let gameStartCheck = false;
    let whiteStartedCheck = false;
    let blackStartedCheck = false;

    onValue(ref(database, gameCode+'/timeLimit'), (snapshot) => {
      timeLimit = snapshot.val();
      timeLimitCheck = true;
      checkTimeRestart(timeLimitCheck, timeOutCheck, whiteTimeCheck, blackTimeCheck,
        lastWhiteTimeCheck, lastBlackTimeCheck, whitePauseCheck, blackPauseCheck,
        gameStartCheck, whiteStartedCheck, blackStartedCheck);
      setTime();
    });
    onValue(ref(database, gameCode+'/timeOut'), (snapshot) => {
      timeOut = snapshot.val();
      timeOutCheck = true;
      checkTimeRestart(timeLimitCheck, timeOutCheck, whiteTimeCheck, blackTimeCheck,
        lastWhiteTimeCheck, lastBlackTimeCheck, whitePauseCheck, blackPauseCheck,
        gameStartCheck, whiteStartedCheck, blackStartedCheck);
    });
    onValue(ref(database, gameCode+'/whiteTime'), (snapshot) => {
      whiteTime = snapshot.val();
      whiteTimeCheck = true;
      checkTimeRestart(timeLimitCheck, timeOutCheck, whiteTimeCheck, blackTimeCheck,
        lastWhiteTimeCheck, lastBlackTimeCheck, whitePauseCheck, blackPauseCheck,
        gameStartCheck, whiteStartedCheck, blackStartedCheck);
    });
    onValue(ref(database, gameCode+'/blackTime'), (snapshot) => {
      blackTime = snapshot.val();
      blackTimeCheck = true;
      checkTimeRestart(timeLimitCheck, timeOutCheck, whiteTimeCheck, blackTimeCheck,
        lastWhiteTimeCheck, lastBlackTimeCheck, whitePauseCheck, blackPauseCheck,
        gameStartCheck, whiteStartedCheck, blackStartedCheck);
    });
    onValue(ref(database, gameCode+'/lastWhiteTime'), (snapshot) => {
      lastWhiteTime = snapshot.val();
      lastWhiteTimeCheck = true;
      checkTimeRestart(timeLimitCheck, timeOutCheck, whiteTimeCheck, blackTimeCheck,
        lastWhiteTimeCheck, lastBlackTimeCheck, whitePauseCheck, blackPauseCheck,
        gameStartCheck, whiteStartedCheck, blackStartedCheck);
    });
    onValue(ref(database, gameCode+'/lastBlackTime'), (snapshot) => {
      lastBlackTime = snapshot.val();
      lastBlackTimeCheck = true;
      checkTimeRestart(timeLimitCheck, timeOutCheck, whiteTimeCheck, blackTimeCheck,
        lastWhiteTimeCheck, lastBlackTimeCheck, whitePauseCheck, blackPauseCheck,
        gameStartCheck, whiteStartedCheck, blackStartedCheck);
    });
    onValue(ref(database, gameCode+'/whitePause'), (snapshot) => {
      whitePause = snapshot.val();
      whitePauseCheck = true;
      checkTimeRestart(timeLimitCheck, timeOutCheck, whiteTimeCheck, blackTimeCheck,
        lastWhiteTimeCheck, lastBlackTimeCheck, whitePauseCheck, blackPauseCheck,
        gameStartCheck, whiteStartedCheck, blackStartedCheck);
    });
    onValue(ref(database, gameCode+'/blackPause'), (snapshot) => {
      blackPause = snapshot.val();
      blackPauseCheck = true;
      checkTimeRestart(timeLimitCheck, timeOutCheck, whiteTimeCheck, blackTimeCheck,
        lastWhiteTimeCheck, lastBlackTimeCheck, whitePauseCheck, blackPauseCheck,
        gameStartCheck, whiteStartedCheck, blackStartedCheck);
    });
    onValue(ref(database, gameCode+'/gameStart'), (snapshot) => {
      gameStart = snapshot.val();
      gameStartCheck = true;
      checkTimeRestart(timeLimitCheck, timeOutCheck, whiteTimeCheck, blackTimeCheck,
        lastWhiteTimeCheck, lastBlackTimeCheck, whitePauseCheck, blackPauseCheck,
        gameStartCheck, whiteStartedCheck, blackStartedCheck);
    });
    onValue(ref(database, gameCode+'/whiteStarted'), (snapshot) => {
      whiteStarted = snapshot.val();
      whiteStartedCheck = true;
      checkTimeRestart(timeLimitCheck, timeOutCheck, whiteTimeCheck, blackTimeCheck,
        lastWhiteTimeCheck, lastBlackTimeCheck, whitePauseCheck, blackPauseCheck,
        gameStartCheck, whiteStartedCheck, blackStartedCheck);
    });
    onValue(ref(database, gameCode+'/blackStarted'), (snapshot) => {
      blackStarted = snapshot.val();
      blackStartedCheck = true;
      checkTimeRestart(timeLimitCheck, timeOutCheck, whiteTimeCheck, blackTimeCheck,
        lastWhiteTimeCheck, lastBlackTimeCheck, whitePauseCheck, blackPauseCheck,
        gameStartCheck, whiteStartedCheck, blackStartedCheck);
    });

    onValue(ref(database, gameCode+'/player1Captures'), (snapshot) => {
      if (!player1 && personsGo === 2) {
        download2Captures(snapshot);
      } else if (player1 && personsGo === 1) {
        download1Captures(snapshot);
      }
    });
    onValue(ref(database, gameCode+'/player2Captures'), (snapshot) => {
      if (!player1 && personsGo === 2) {
        download1Captures(snapshot);
      } else if (player1 && personsGo === 1) {
        download2Captures(snapshot);
      }
    });

    onValue(ref(database, gameCode+'/passant'), (snapshot) => {
      passant = [];
      if (snapshot.val() !== false) {
        snapshot.forEach((snap) => {
          if (!player1) {
            passant.push(7 - snap.val());
          } else {
            passant.push(snap.val());
          }
        });
      }
    });

    onValue(ref(database, gameCode+'/checkmate'), (snapshot) => {
      if (snapshot.val() === true) {
        clocks = false;
        checkmateBanner1.style.display = 'flex';
        checkmateBanner2.style.display = 'flex';
      }
    });

    onValue(ref(database, gameCode+'/stalemate'), (snapshot) => {
      if (snapshot.val() === true) {
        clocks = false;
        stalemateBanner1.style.display = 'flex';
        stalemateBanner2.style.display = 'flex';
      }
    });

    onValue(ref(database, gameCode+'/colourTimedOut'), (snapshot) => {
      if (snapshot.val() === 'white') {
        timeOuts[0].innerHTML ="WHITE TIME'S OUT";
        timeOuts[1].innerHTML ="WHITE TIME'S OUT";

        timeOuts[0].style.display = 'flex';
        timeOuts[1].style.display = 'flex';
      } else if (snapshot.val() === 'black') {
        timeOuts[0].innerHTML ="BLACK TIME'S OUT";
        timeOuts[1].innerHTML ="BLACK TIME'S OUT";

        timeOuts[0].style.display = 'flex';
        timeOuts[1].style.display = 'flex';
      }
    });
  }

  function download1Captures(snapshot) {
    player1Captures = [];
    snapshot.forEach((childSnap) => {
      player1Captures.push(childSnap.val())
    });
    if (player1Captures[0] === false) {
      player1Captures = [];
    }
    updateCaptures(1);
    statusUpdate();
  }

  function download2Captures(snapshot) {
    player2Captures = [];
    snapshot.forEach((childSnap) => {
      player2Captures.push(childSnap.val())
    });
    if (player2Captures[0] === false) {
      player2Captures = [];
    }
    updateCaptures(2);
    statusUpdate();
  }

  function checkTimeRestart(timeLimitCheck, timeOutCheck, whiteTimeCheck, blackTimeCheck,
    lastWhiteTimeCheck, lastBlackTimeCheck, whitePauseCheck, blackPauseCheck,
    gameStartCheck, whiteStartedCheck, blackStartedCheck) {
    if (timeLimitCheck && timeOutCheck && whiteTimeCheck && blackTimeCheck &&
      lastWhiteTimeCheck && lastBlackTimeCheck && whitePauseCheck && blackPauseCheck &&
      gameStartCheck && whiteStartedCheck && blackStartedCheck) {
        const clocksInterval = setInterval(updateTime, 500);
    }
  }

  function saveSettings() {
    oldPlayer1Captures = JSON.parse(JSON.stringify(player1Captures));
    oldPlayer2Captures = JSON.parse(JSON.stringify(player2Captures));

    oldPassant = passant.slice();

    oldPromoting = promoting;

    oldWKMoved = wKMoved;
    oldBKMoved = bKMoved;
    oldWLRMoved = wLRMoved;
    oldBLRMoved = bLRMoved;
    oldWRRMoved = wRRMoved;
    oldBRRMoved = bRRMoved;

    oldClocks = clocks;
  }

  function uploadSettings() {
    if (oldPromoting !== promoting) {
      set(ref(database, gameCode+'/promoting'), promoting)
    }

    if (oldWKMoved !== wKMoved) {
      set(ref(database, gameCode+'/wKMoved'), wKMoved);
    }
    if (oldBKMoved !== bKMoved) {
      set(ref(database, gameCode+'/bKMoved'), bKMoved);
    }
    if (oldWLRMoved !== wLRMoved) {
      set(ref(database, gameCode+'/wLRMoved'), wLRMoved);
    }
    if (oldBLRMoved !== bLRMoved) {
      set(ref(database, gameCode+'/bLRMoved'), bLRMoved);
    }
    if (oldWRRMoved !== wRRMoved) {
      set(ref(database, gameCode+'/wRRMoved'), wRRMoved);
    }
    if (oldBRRMoved !== bRRMoved) {
      set(ref(database, gameCode+'/bRRMoved'), bRRMoved);
    }

    if (oldClocks !== clocks) {
      set(ref(database, gameCode+'/clocks'), clocks);
    }

    set(ref(database, gameCode+'/go'), go);
    set(ref(database, gameCode+'/personsGo'), personsGo);

    set(ref(database, gameCode+'/timeOut'), timeOut);
    set(ref(database, gameCode+'/timeLimit'), timeLimit);
    set(ref(database, gameCode+'/whiteTime'), whiteTime);
    set(ref(database, gameCode+'/blackTime'), blackTime);
    set(ref(database, gameCode+'/lastWhiteTime'), lastWhiteTime);
    set(ref(database, gameCode+'/lastBlackTime'), lastBlackTime);
    set(ref(database, gameCode+'/whitePause'), whitePause);
    set(ref(database, gameCode+'/blackPause'), blackPause);
    set(ref(database, gameCode+'/gameStart'), gameStart);
    set(ref(database, gameCode+'/whiteStarted'), whiteStarted);
    set(ref(database, gameCode+'/blackStarted'), blackStarted);
  }

  function uploadCaptures() {
    if (JSON.stringify(oldPlayer1Captures) !== JSON.stringify(player1Captures)) {
      let captures1Ref;
      if (!player1) {
        captures1Ref = ref(database, gameCode+'/player2Captures');
      } else {
        captures1Ref = ref(database, gameCode+'/player1Captures');
      }

      set(captures1Ref, null);
      for (let p=0; p<player1Captures.length; p++) {
        fPush(captures1Ref, player1Captures[p]);
      }
    }
    if (JSON.stringify(oldPlayer2Captures) !== JSON.stringify(player2Captures)) {
      let captures2Ref;
      if (!player1) {
        captures2Ref = ref(database, gameCode+'/player1Captures');
      } else {
        captures2Ref = ref(database, gameCode+'/player2Captures');
      }

      set(captures2Ref, null);
      for (let p=0; p<player2Captures.length; p++) {
        fPush(captures2Ref, player2Captures[p]);
      }
    }
  }

  function uploadPassant() {
    console.log(passant);
    console.log('hey');
    if (oldPassant !== passant) {
      console.log('hi');
      if (passant.length === 0) {
        set(ref(database, gameCode+'/passant'), false);
      } else {
        if (!player1) {
          set(ref(database, gameCode+'/passant'), {
            x: 7 - passant[0],
            y: 7 - passant[1]
          });
        } else {
          set(ref(database, gameCode+'/passant'), {
            x: passant[0],
            y: passant[1]
          });
        }
      }
    }
  }

  function syncBoard() {
    onValue(ref(database, gameCode+'/positions'), (snapshot) => {
      if ((personsGo === 1 && !player1) ||
      (personsGo === 2 && player1)) {

        let r = 0;
        let c;
        let pieceCode;

        snapshot.forEach((rowSnap) => {
          c = 0;
          rowSnap.forEach((colSnap) => {
            pieceCode = colSnap.val();
            if (player1) {
              piecePositions[r][c] = pieceCode;
            } else {
              piecePositions[7-r][7-c] = pieceCode;
            }
            c++;
          });
          r++;
        });
        update();
      }
    });
  }

  function uploadBoard() {
    set(ref(database, gameCode+'/positions'), null);
    let row;
    for (let r=0; r<8; r++) {
      row = ref(database, gameCode+'/positions/'+r);
      for (let c=0; c<8; c++) {
        if (!player1) {
          fPush(row, piecePositions[7-r][7-c]);
        } else {
          fPush(row, piecePositions[r][c]);
        }
      }
    }
  }

  function setOffline() {
    playerColour = Math.floor(Math.random() * 2);
    if (playerColour===1) {
      piecePositions = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
      ];
    } else {
      piecePositions = [
        ['r', 'n', 'b', 'k', 'q', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'k', 'q', 'b', 'n', 'r']
      ];
    }

    if (playerColour === 1) {
      for (let r=0; r<2; r++) {
        for (let pieceCode=0; pieceCode<piecePositions[r].length;
          pieceCode++) {
            piecePositions[r][pieceCode] = 'b' + piecePositions[r][pieceCode];
          }
      }
      for (let r=3; r>1; --r) {
        for (let pieceCode=0; pieceCode<piecePositions[r].length;
          pieceCode++) {
            piecePositions[r][pieceCode] = 'w' + piecePositions[r][pieceCode];
          }
      }
    } else {
      for (let r=0; r<2; r++) {
        for (let pieceCode=0; pieceCode<piecePositions[r].length;
          pieceCode++) {
            piecePositions[r][pieceCode] = 'w' + piecePositions[r][pieceCode];
          }
      }
      for (let r=3; r>1; --r) {
        for (let pieceCode=0; pieceCode<piecePositions[r].length;
          pieceCode++) {
            piecePositions[r][pieceCode] = 'b' + piecePositions[r][pieceCode];
          }
      }
    }

    //4 rows of nothing
    for (let r=0; r<4; r++) {
      let empty = [];
      //8 squares of nothing
      for (let s=0; s<8; s++) {
        empty.push(false);
      }
      //between first 2 and last 2 rows (white and black)
      piecePositions.splice(2, 0, empty);
    }

    setBackdrop();

    timeOuts[0].innerHTML = "";
    timeOuts[1].innerHTML = "";

    timeOuts[0].style.display = 'none';
    timeOuts[1].style.display = 'none';

    checkmateBanner1.style.display = 'none';
    checkmateBanner2.style.display = 'none';
    stalemateBanner1.style.display = 'none';
    stalemateBanner2.style.display = 'none';

    clocks = true;

    go = 'w';

    player1Captures = [];
    player2Captures = [];

    wKMoved = false;
    bKMoved = false;
    wLRMoved = false;
    bLRMoved = false;
    wRRMoved = false;
    bRRMoved = false;

    movingX = false;
    movingY = false;
    burning = [];

    promoting = false;
    passant = [];

    timeOut = false;

    timeLimit = defaultTime;
    whiteTime = timeLimit;
    blackTime = timeLimit;
    lastWhiteTime = false;
    lastBlackTime = false;
    whitePause = 0;
    blackPause = 0;
    gameStart = false;
    whiteStarted = false;
    blackStarted = false;

    setTime();

    modalling = false;

    online = false;
    player1 = false;
    personsGo = false;
    gameCode;

    oldPlayer1Captures = player1Captures;
    oldPlayer2Captures = player2Captures;


    oldWKMoved = wKMoved;
    oldBKMoved = bKMoved;
    oldWLRMoved = wLRMoved;
    oldBLRMoved = bLRMoved;
    oldWRRMoved = wRRMoved;
    oldBRRMoved = bRRMoved;

    quitButton.style.display = 'none';
    exitButton.style.display = 'none';
    gameCodeContainer.style.display = 'none';
    restartButton.style.display = 'flex';
    createButton.style.display = 'flex';
    joinButton.style.display = 'flex';
    timeSetButton.style.display = 'flex';
    timeSetButton.style.display = 'flex';

    update();
    updateCaptures(1);
    updateCaptures(2);
    statusUpdate();
  }

  function newTime(hrs, mins, secs) {
    let t = hrs * 3600000;
    t += mins * 60000;
    t += secs * 1000;

    defaultTime = t;
    timeLimit = t;
    setTime();

    lastWhiteTime = false;
    lastBlackTime = false;
    whitePause = 0;
    blackPause = 0;
    gameStart = false;
    whiteStarted = false;
    blackStarted = false;
  }
});