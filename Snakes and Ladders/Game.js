import { diceData } from "./diceData.js";

export class Game {
  players = [];

  position = 0;
  mode;
  level;
  constructor(board) {
    this.board = board;
    this.currentPlayerNumber = 1;
    this.mainContainer = document.querySelector(".main-container");
  }

  createGameBoard() {
    const boardImg = document.querySelector(".board-img");
    const boardEl = document.querySelector(".board");

    const squares = boardEl.querySelectorAll(".square");
    squares.forEach((square) => {
      square.remove();
    });

    const [boardWidth, boardHeight] = [
      boardImg.clientWidth,
      boardImg.clientHeight,
    ];
    const squareArea = boardHeight / 10 + boardWidth / 10;
    const boardStyles = {
      width: `${boardWidth}px`,
      height: `${boardHeight}px`,
      background: `transparent`,
    };

    for (const [property, value] of Object.entries(boardStyles)) {
      boardEl.style[property] = value;
    }

    const squareStyles = {
      width: `${squareArea / 2}px`,
      height: `${squareArea / 2}px`,
      background: `transparent`,
    };

    const ids = this.generateBoardSquaresPattern();

    for (const id of ids) {
      const squareDiv = document.createElement("div");
      squareDiv.classList.add("square");
      squareDiv.id = `${id}`;

      for (let i = 1; i <= this.mode; i++) {
        if (this.mode == 1) {
          const playerDisc1 = document.createElement("div");
          playerDisc1.classList.add("playerDisc1");
          squareDiv.appendChild(playerDisc1);

          const playerDisc2 = document.createElement("div");
          playerDisc2.classList.add("playerDisc2");
          squareDiv.appendChild(playerDisc2);
          break;
        }

        const playerDisc = document.createElement("div");
        playerDisc.classList.add(`playerDisc${i}`);
        squareDiv.appendChild(playerDisc);
      }

      for (const [property, value] of Object.entries(squareStyles)) {
        squareDiv.style[property] = value;
      }

      boardEl.appendChild(squareDiv);
    }
  }

  hideGameBoard() {
    document.querySelector(".board").style.display = "none";
    document.querySelector(".dice").style.display = "none";
  }

  displayGameBoard() {
    document.querySelector(".board").style.display = "block";
    document.querySelector(".dice").style.display = "block";
  }

  generateBoardSquaresPattern() {
    const ids = [];
    let start = 100;
    let end = 1;

    for (let row = 0; row < 10; row++) {
      const rowIds = [];
      for (let col = 0; col < 10; col++) {
        if (row % 2 === 0) {
          rowIds.push(start--);
        } else {
          rowIds.push(start--);
        }
      }
      if (row % 2 !== 0) {
        rowIds.reverse();
      }
      ids.push(...rowIds);
    }
    return ids;
  }

  selectLevel() {}

  selectMode() {}

  createPlayers(players) {
    this.players = players;
  }

  handlePlayerMove() {
    const playerAt100 = this.players.filter(
      (player) => player.position === 100
    );

    if (playerAt100.length !== 0) {
      this.resetPlayers();
      alert("game restart");
    }

    const player = this.players[this.currentPlayerNumber - 1];

    const randNum = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    document.querySelector(".dice .dice-img").innerHTML = randNum;
    player.rolledNumber = randNum;

    const diceImg = document.querySelector(".dice-img");
    diceImg.src = diceData[randNum];

    document
      .querySelectorAll(`.playerDisc${this.currentPlayerNumber}`)
      .forEach((square) => {
        square.classList.remove("active");
      });

    let previousPosition = player.position;

    if (player.position == 0 && player.rolledNumber == 6) {
      player.position = 1;
      const playerInLobyEl = document.getElementById(
        `dice-player${this.currentPlayerNumber}`
      );
      playerInLobyEl.classList.add("remove");

      this.board.addPlayers(player, this.currentPlayerNumber);
      const square = document.getElementById("1");
      const playerDisc = square.querySelector(
        `.playerDisc${this.currentPlayerNumber}`
      );
      playerDisc.classList.add("active");
    } else if (player.position != 0) {
      if (this.checkWin(player)) {
        this.board.addPlayers(
          player,
          this.currentPlayerNumber,
          previousPosition
        );
        const square = document.getElementById(`${player.position}`);
        const playerDisc = square.querySelector(
          `.playerDisc${this.currentPlayerNumber}`
        );
        playerDisc.classList.add("active");
        return;
      }

      this.checkForLaddersOrSnakes(player);
      this.board.addPlayers(player, this.currentPlayerNumber, previousPosition);

      const square = document.getElementById(`${player.position}`);
      const playerDisc = square.querySelector(
        `.playerDisc${this.currentPlayerNumber}`
      );
      playerDisc.classList.add("active");
    }

    if (player.rolledNumber != 6) {
      if (this.mode != 1) {
        this.currentPlayerNumber =
          this.currentPlayerNumber == this.mode
            ? 1
            : this.currentPlayerNumber + 1;
      } else {
        this.currentPlayerNumber = this.currentPlayerNumber == 2 ? 1 : 2;
      }

      const playersInGame = document.querySelectorAll(".player-in-game");
      playersInGame.forEach((currentPlayer) => {
        currentPlayer.classList.remove("current");
      });
      playersInGame[this.currentPlayerNumber - 1].classList.add("current");
    }

    if (this.players[this.currentPlayerNumber - 1].name === "computer") {
      const diceRollBtn = document.querySelector(".dice-roll-btn");
      diceRollBtn.disabled = true;
      diceRollBtn.classList.add("disable");
      setTimeout(() => {
        this.handlePlayerMove();
        diceRollBtn.disabled = false;
        diceRollBtn.classList.remove("disable");
      }, 800);
    }
  }

  checkWin(player) {
    const newPosition = player.position + player.rolledNumber;
    if (this.level === "E") {
      if (newPosition === 100 || newPosition > 100) {
        player.position = 100;
        alert(`${player.name} won the game!!`);
        return true;
      } else {
        player.position = newPosition;
        return false;
      }
    } else if (this.level === "M") {
      if (newPosition === 100) {
        player.position = 100;
        alert(`${player.name} won the game!!`);
        return true;
      } else if (newPosition < 100) {
        player.position = newPosition;
      }
      return false;
    } else {
      if (newPosition === 100) {
        player.position = 100;
        alert(`${player.name} won the game!!`);
        return true;
      } else if (newPosition > 100) {
        const owerflow = newPosition - 100;
        player.position = 100 - owerflow;
        return false;
      } else {
        player.position = newPosition;
        return false;
      }
    }
  }

  checkForLaddersOrSnakes(player) {
    let currentPositionNode = this.board.findSquare(player.position);
    let current = currentPositionNode;

    if (current != null) {
      if (currentPositionNode.endSquare < currentPositionNode.square) {
        while (true) {
          if (current.square == currentPositionNode.endSquare) {
            player.position = current.square;
            return;
          }
          current = current.previous;
        }
      } else if (currentPositionNode.endSquare > currentPositionNode.square) {
        while (true) {
          if (current.square == currentPositionNode.endSquare) {
            player.position = current.square;
            return;
          }
          current = current.next;
        }
      }
    }
  }

  resetPlayers() {
    this.players.forEach((player) => {
      player.position = 0;
      player.rolledNumber = 0;
    });
    this.currentPlayerNumber = 1;
    const imgDice = document.querySelector(".dice-img");
    imgDice.src = diceData[1];

    document.querySelectorAll(".square div").forEach((disk) => {
      disk.classList.remove("active");
    });

    for (let i = 1; i <= 4; i++) {
      const playerInLobyEl = document.getElementById(`dice-player${i}`);
      playerInLobyEl.classList.add("remove");
    }

    this.players.forEach((player) => {
      const playerInLobyEl = document.getElementById(`dice-player${player.id}`);
      playerInLobyEl.classList.remove("remove");
    });

    const inGamePlayers = document.querySelectorAll(".player-in-game");
    inGamePlayers.forEach((player) => player.classList.remove("current"));
    inGamePlayers[0].classList.add("current");

    for (let i = 1; i <= 100; i++) {
      for (let j = 1; j <= 4; j++) {
        this.board.deleteNodePlayer(i, j);
      }
    }
  }

  restartGame() {
    this.resetPlayers();
  }

  existGame() {
    document.querySelector(".in-game-container").style.display = "none";
    document.querySelector(".game_fisrt_interface").style.display = "block";
    document.querySelector(".close-restart-btns").style.display = "none";
    for (let i = 1; i <= 4; i++) {
      const playerInLobyEl = document.getElementById(`dice-player${i}`);
      playerInLobyEl.classList.add("remove");
    }
  }
}
