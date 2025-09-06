import "./style.css";
import { playBonk, playCry } from "./modules/sounds";

// DOM CONTENT LOADS
document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------------------------------------------------------- //
  // 1. DOM ELEMENTS
  // ----------------------------------------------------------------------------- //
  const allScreens = document.querySelectorAll(
    "#welcome-screen, #mechanics-screen, #game-screen, #game-over-screen"
  );
  const welcomeRulesBtn = document.getElementById("welcome-rules");
  const welcomeEnterLawnBtn = document.getElementById("welcome-enter-lawn");
  const mechanicsEnterLawnBtn = document.getElementById("mechanics-enter-lawn");
  const backBtn = document.getElementById("back-btn");
  const gameRulesBtn = document.getElementById("game-rules");
  const timeDisplay = document.getElementById("time-display");
  const startButton = document.getElementById("start-btn");
  const endButton = document.getElementById("end-btn");
  const imageContainers = document.querySelectorAll(".image-container");
  const statusDisplay = document.getElementById("status");
  const scoreDisplay = document.getElementById("score");

  // ----------------------------------------------------------------------------- //
  // 2. VARIABLES
  // ----------------------------------------------------------------------------- //
  let timeLeft = 60;
  let gameTimer;
  let lastContainer = null;
  let isMole = Boolean;
  let score = 0;
  let currentScreenId = "welcome-screen";
  let previousScreenId = null;
  let isGameRunning = false;

  // ----------------------------------------------------------------------------- //
  // 3. UTILITY FUNCTIONS (declare before use)
  // ----------------------------------------------------------------------------- //
  // updates the time displayed function
  const updateTimeDisplay = () => {
    const minutes = Math.floor(timeLeft / 60); //60 seconds
    const seconds = timeLeft % 60;

    // formats to two digits (5 becomes 05)
    // existingString.padStart(targetLength, padString)
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    timeDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
  };
  // randomizer function
  const randomizer = (array) => {
    return Math.floor(Math.random() * array.length);
  };
  // screen tracker function
  const showScreen = (screenId) => {
    allScreens.forEach((screen) => (screen.style.display = "none"));
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
      targetScreen.style.display = "flex";
      previousScreenId = currentScreenId;
      currentScreenId = screenId;
    }
    console.log(`Previous page: ${previousScreenId}`);
    console.log(`Current page: ${currentScreenId}`);
  };
  // displays updated score
  const updateScoreDisplay = () => {
    const formattedScore = String(score).padStart(2, "0");
    scoreDisplay.textContent = formattedScore;
    scoreDisplay.style.fontWeight = 600;
  };
  // displays game status: ready, playing, paused, finished
  const updateStatusDisplay = (statusText) => {
    statusDisplay.textContent = statusText;
    statusDisplay.style.fontWeight = 600;
  };

  // ----------------------------------------------------------------------------- //
  // 4. GAME FUNCTIONS (declare before use)
  // ----------------------------------------------------------------------------- //
  // ends game function
  const gameOver = () => {
    clearInterval(gameTimer);
    updateStatusDisplay("Game over");
  };

  // user initiated end of game
  const userQuits = () => {
    const confirmQuit = window.confirm(
      "Are you sure you want to quit? Your progress won't be saved."
    );

    if (confirmQuit) {
      clearInterval(gameTimer);
      updateStatusDisplay("Game Over");
      // dont save score since user quits
    } else {
      console.log("Game continues...");
    }
  };

  // starts game function
  const startGame = () => {
    if (timeLeft === 60) {
      gameTimer = // creates mole or baby
        setInterval(() => {
          timeLeft--;
          updateTimeDisplay();
          updateScoreDisplay();
          updateStatusDisplay("Playing");
          let randomNum, targetContainer;
          // isMole = Math.random() < 0.5;
          isMole = Math.random() > 0.2;
          // console.log(isMole);

          // dont use same container consecutively do-while loop
          do {
            // gets random container
            randomNum = randomizer(imageContainers);
            targetContainer = imageContainers[randomNum];
            // console.log(targetContainer);
          } while (
            // keeps getting random container
            // if it's the same as last and more than 1 container in the container array
            targetContainer === lastContainer &&
            imageContainers.length > 1
          );

          // saves current container for next time
          lastContainer = targetContainer;

          if (isMole) {
            const mole = document.createElement("img");
            mole.src = "src/assets/mole.png";
            mole.classList.add("mole");
            targetContainer.appendChild(mole);

            // mole click - YAY!
            mole.addEventListener("click", (event) => {
              event.preventDefault();
              event.stopPropagation();

              // DEBUG SOUND
              console.log("MOLE CLICKED - playing bonk");

              mole.src = "src/assets/squishedmole.png";
              mole.classList.add("squished");
              console.log(
                "HIT! You hit the mole and earn a point -- keep HITTING!"
              );
              score++;
              playBonk();
            });
          } else {
            const baby = document.createElement("img");
            baby.src = "src/assets/happybaby.png";
            baby.classList.add("baby");
            targetContainer.appendChild(baby);

            // baby click - OUCH!
            baby.addEventListener("click", (event) => {
              event.preventDefault();
              event.stopPropagation();

              playCry();

              baby.src = "src/assets/cryingbaby.png";
              console.log("OUCH! You hit the baby! Score goes back to ZERO. ");
              score = 0;
            });
          }

          console.log(`Your score is: `, score);

          // removes mole and baby
          setTimeout(() => {
            // removes DOM element
            if (targetContainer.children.length > 0) {
              targetContainer.removeChild(targetContainer.children[0]);
            }
          }, 650);

          if (timeLeft <= 0) {
            gameOver();
          }
        }, 1000);
    }
  };
  // ----------------------------------------------------------------------------- //
  // 5. EVENT LISTENERS (after all functions are declared)
  // ----------------------------------------------------------------------------- //
  // Welcome screen buttons
  welcomeEnterLawnBtn.addEventListener("click", () => {
    showScreen("game-screen");
  });

  welcomeRulesBtn.addEventListener("click", () => {
    showScreen("mechanics-screen");
  });

  // Mechanics screen buttons
  mechanicsEnterLawnBtn.addEventListener("click", () => {
    showScreen("game-screen");
  });
  backBtn.addEventListener("click", () => {
    if (previousScreenId) {
      showScreen(previousScreenId);
    }
  });

  // Game screen buttons
  gameRulesBtn.addEventListener("click", () => {
    showScreen("mechanics-screen");
  });

  // startgame click event
  startButton.addEventListener("click", startGame);

  // gameOver click event: user initiated
  endButton.addEventListener("click", userQuits);

  // image container click event
  imageContainers.forEach((container) => {
    container.addEventListener("click", (event) => {
      event.preventDefault();
      // console.log(container.children.length);

      if (container.children.length === 0) {
        console.log("NOTHING IN HERE. Try another hole.");
        // score--;
      }
    });
  });

  // Initialize
  updateTimeDisplay();
  showScreen("welcome-screen");
  updateScoreDisplay();
  updateStatusDisplay("Ready");
});

// -------------------------__CODE HELPER ------------------------------------------
// string.prototype.padStart()
// existingString.padStart(targetLength)
// existingString.padStart(targetLength, padString)
