import { Board, Player } from "./BoardPlayer.js";
import { Game } from "./Game.js";

const startButton = document.querySelector(".start-button");
const selectModePanel = document.querySelector(".game_selectmode_interface");
const selectModeForm = document.querySelector(".select-mode-form");
const diceRollBtn1 = document.querySelector(".dice-roll-btn");
const playerDetailsPanel = document.querySelector(".game_username_interface");
const playerDetailsForm = document.querySelector(".player-details-form");
const selectLevelPanel = document.querySelector(
  ".game_userlevel_select_interface"
);
const selectLevelForm = document.querySelector(".select-level-form");
const image = document.querySelector(".attachment_image_ani");
const thrree_circle = document.querySelector(".circle_for_select_options");
const restartBtn = document.querySelector(".restart-btn");
const colseBtn = document.querySelector(".home-btn");
const ciclefooter = document.querySelectorAll(".circle_footer");

let game;
let board;

const playerColors = [
  "rgb(40, 255, 2)",
  "rgb(1, 247, 255)",
  "rgb(255, 86, 1)",
  "rgb(0, 103, 229)",
];

startButton.addEventListener("click", () => startTheGame());

function startTheGame() {
  board = new Board();
  ciclefooter[0].classList.add("active");

  for (let i = 1; i <= 100; i++) {
    board.handleInsertSquare(i);
  }
  game = new Game(board);
  selectMode();
}

selectModeForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(selectModeForm);
  const mode = formData.get("mode");
  game.mode = Number(mode);
  getPlayerDetails(game.mode);
});

function selectMode() {
  const home = document.querySelector(".game_fisrt_interface");
  home.style.display = "none";
  selectModePanel.style.display = "block";

  thrree_circle.style.display = "flex";
  image.style.display = "block";

  const resetCloseBtns = document.querySelector(".close-restart-btns");
  resetCloseBtns.style.display = "none";
}

function getPlayerDetails(mode) {
  ciclefooter[1].classList.add("active");
  selectModePanel.style.display = "none";
  playerDetailsPanel.style.display = "block";

  const inputFields = document.querySelectorAll(".player-details-form .user1");
  inputFields.forEach((inputEl) => {
    inputEl.classList.remove("active");
  });

  for (let i = 1; i <= mode; i++) {
    if (mode != 1) {
      inputFields[i - 1].classList.add("active");
    } else {
      inputFields[0].classList.add("active");
    }
  }
}

playerDetailsForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(playerDetailsForm);
  let players = [];

  const playerImages = [
    "https://www.angrybirds.com/wp-content/uploads/2022/05/optimized-ABCOM_202203_CharacterDimensio_Bomb_Movie-300x300.png",
    "https://www.angrybirds.com/wp-content/uploads/2022/05/ABCOM_202203_350x350_CharacterDimensio_Courtney_Movie-300x300.png",
    "https://www.angrybirds.com/wp-content/uploads/2022/05/optimized-ABCOM_202203_1000x1000_CharacterDimensio_Red_Movie-300x300.png",
    "https://www.angrybirds.com/wp-content/uploads/2022/05/ABCOM_202203_1000x1000_CharacterDimensio_Stella_Movie-1-300x300.png",
  ];

  if (game.mode != 1) {
    for (let i = 1; i <= game.mode; i++) {
      const name = formData.get(`player${i}`);
      if (name) {
        players.push(
          new Player(name, playerColors[i - 1], playerImages[i - 1], i)
        );
      } else {
        return;
      }
    }
  } else {
    const name = formData.get("player1");
    if (name) {
      players.push(new Player(name, playerColors[0], playerImages[0], 1));
      players.push(new Player("computer", playerColors[1], playerImages[1], 2));
    } else {
      return;
    }
  }

  game.createPlayers(players);
  selectLevel();
});

function selectLevel() {
  ciclefooter[2].classList.add("active");
  playerDetailsPanel.style.display = "none";
  selectLevelPanel.style.display = "block";
}

selectLevelForm.addEventListener("submit", function (event) {
  event.preventDefault();
  ciclefooter.forEach((footer) => {
    footer.classList.remove("active");
  });

  const formData = new FormData(selectLevelForm);
  const level = formData.get("level");
  game.level = level;

  for (let i = 0; i < 4; i++) {
    const discs = document.querySelectorAll(`.square .playerDisc${i}`);
    discs.forEach((disc) => {
      disc.style.background = playerColors[i];
    });
  }

  selectLevelPanel.style.display = "none";
  thrree_circle.style.display = "none";
  const inGameContainer = document.querySelector(".in-game-container");
  inGameContainer.style.display = "flex";
  const image = document.querySelector(".attachment_image_ani");
  image.style.display = "none";
  const resetCloseBtns = document.querySelector(".close-restart-btns");
  resetCloseBtns.style.display = "flex";
  game.createGameBoard();

  const playersDiv = document.querySelector(
    ".player-container .players-in-game"
  );

  while (playersDiv.firstChild) {
    playersDiv.removeChild(playersDiv.firstChild);
  }

  for (let i = 0; i < game.players.length; i++) {
    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player-in-game");

    const playerImage = document.createElement("img");
    playerImage.src = game.players[i].image;
    playerImage.classList.add("playerImage");
    playerDiv.appendChild(playerImage);

    const playerNameEl = document.createElement("p");
    playerNameEl.textContent = game.players[i].name;
    playerDiv.appendChild(playerNameEl);

    playersDiv.appendChild(playerDiv);

    const playersInGame = document.querySelectorAll(".player-in-game");
    playersInGame[0].classList.add("current");
  }

  game.players.forEach((player) => {
    const playerInLobyEl = document.getElementById(`dice-player${player.id}`);
    playerInLobyEl.classList.remove("remove");
    playerInLobyEl.style.background = player.color;
  });
});

diceRollBtn1.addEventListener("click", () => {
  game.handlePlayerMove();
});

restartBtn.addEventListener("click", () => {
  game.restartGame();
});

colseBtn.addEventListener("click", () => {
  game.existGame();
});
