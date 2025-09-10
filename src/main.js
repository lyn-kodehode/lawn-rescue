import "./style.css";
import {
  playBonk,
  playCry,
  initializeSounds,
  playClock,
} from "./modules/sounds.js";

// import images
import moleImg from "/assets/mole.png";
import squishedMoleImg from "/assets/squishedmole.png";
import happyBabyImg from "/assets/happybaby.png";
import cryingBabyImg from "/assets/cryingbaby.png";

// DOM CONTENT LOADS
document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------------------------------------------------------- //
  // 1. DOM ELEMENTS
  // ----------------------------------------------------------------------------- //
  const allScreens = document.querySelectorAll(
    "#welcome-screen, #mechanics-screen, #game-screen, #game-over-screen"
  );
  const imageContainers = document.querySelectorAll(".image-container");
  const dialogBox = document.getElementById("name-dialog");
  const gameTimeDisplay = document.getElementById("time-display");
  const gameStatusDisplay = document.getElementById("status");
  const gameScoreDisplay = document.getElementById("score");
  const dialogScoreDisplay = document.getElementById("dialog-score");
  const finalScoreDisplay = document.getElementById("final-score-display");
  const achievementTitleDisplay = document.getElementById(
    "performance-title-display"
  );
  const molesHitDisplay = document.getElementById("moles-hit-count");
  const babiesHitDisplay = document.getElementById("babies-hit-count");
  const timePlayedDisplay = document.getElementById("time-played");
  const leaderboardList = document.getElementById("leaderboard-list");
  const welcomeEnterLawnBtn = document.getElementById("welcome-enter-lawn");
  const mechanicsEnterLawnBtn = document.getElementById("mechanics-enter-lawn");
  const welcomeRulesBtn = document.getElementById("welcome-rules");
  const goBackBtn = document.getElementById("back-btn");
  const gameRulesBtn = document.getElementById("game-rules");
  const startGameBtn = document.getElementById("start-btn");
  const exitGameBtn = document.getElementById("exit-btn");
  const endGameBtn = document.getElementById("end-btn");
  const cancelSaveBtn = document.getElementById("dialog-cancel");
  const saveScoreBtn = document.getElementById("dialog-save");
  const playAgainBtn = document.getElementById("play-again-btn");
  const backToWelcomeBtn = document.getElementById("back-to-welcome-btn");
  const nameInput = document.getElementById("dialog-name-input");

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
  let molesHit = 0;
  let babiesHit = 0;
  let timedPlayed = 60;

  // ----------------------------------------------------------------------------- //
  // 3. UTILITY FUNCTIONS (declare before use)
  // ----------------------------------------------------------------------------- //
  // updates the time displayed function
  const updateGameTimeDisplay = () => {
    const minutes = Math.floor(timeLeft / 60); //60 seconds
    const seconds = timeLeft % 60;

    // formats to two digits (5 becomes 05)
    // existingString.padStart(targetLength, padString)
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    gameTimeDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
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
    // console.log(`Previous page: ${previousScreenId}`);
    // console.log(`Current page: ${currentScreenId}`);
  };

  // get score function
  const getScoreColor = (score, container) => {
    if (score >= 21) {
      container.style.color = "gold";
    } else if (score >= 11) {
      container.style.color = "orange";
    } else if (score >= 1) {
      // gameScoreDisplay.style.color = "#8bc34a33";
      container.style.color = "#4caf50";
    } else {
      container.style.color = "red";
    }
  };

  // displays updated score
  const updateGameScoreDisplay = () => {
    const formattedScore = String(score).padStart(2, "0");
    gameScoreDisplay.textContent = formattedScore;
    gameScoreDisplay.style.fontWeight = 600;
    getScoreColor(score, gameScoreDisplay);
  };

  // displays game status: ready, playing, paused, finished
  const updateGameStatusDisplay = (statusText) => {
    gameStatusDisplay.textContent = statusText;
    gameStatusDisplay.style.fontWeight = 600;
    if (gameStatusDisplay.textContent === "Ready") {
      gameStatusDisplay.style.color = "orange";
    } else if (gameStatusDisplay.textContent === "Playing") {
      gameStatusDisplay.style.color = "blue";
    } else {
      gameStatusDisplay.style.color = "red";
    }
  };

  // Get existing leaderboard from LocalStorage or create new array if empty
  // fetches savedleaderboard
  const getLeaderboard = () => {
    return JSON.parse(localStorage.getItem("savedLeaderboard") || "[]");
  };

  // get nextplayer number from localStorage
  const getNextPlayerNumber = () => {
    // Gets null (start) → uses 0 → returns 1 → saves "1" and so on
    const lastPlayerNum = localStorage.getItem("lastPlayerNumber") || 0;
    const nextNum = parseInt(lastPlayerNum) + 1;
    localStorage.setItem("lastPlayerNumber", nextNum);
    return nextNum;
  };

  // Get player name (with default if empty)
  const getPlayerName = () => {
    const playerName = nameInput.value.trim();
    return playerName || `Player${getNextPlayerNumber()}`;
  };

  // ----------------------------------------------------------------------------- //
  // 4. GAME FUNCTIONS (declare before use)
  // ----------------------------------------------------------------------------- //

  // create leaderboard entry function
  const createLeaderboardEntry = (entry, index) => {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("leaderboard-entry");

    if (index === 0) {
      entryDiv.classList.add("current-player");
    }

    const rankSpan = document.createElement("span");
    rankSpan.classList.add("rank");
    rankSpan.textContent = `${index + 1}.`;

    const nameSpan = document.createElement("span");
    nameSpan.classList.add("player-name");
    nameSpan.textContent = entry.name;

    const scoreSpan = document.createElement("span");
    scoreSpan.classList.add("leaderboard-score");
    scoreSpan.textContent = entry.score;

    const dateSpan = document.createElement("span");
    dateSpan.classList.add("date");
    dateSpan.textContent = entry.date;

    entryDiv.appendChild(rankSpan);
    entryDiv.appendChild(nameSpan);
    entryDiv.appendChild(scoreSpan);
    entryDiv.appendChild(dateSpan);

    return entryDiv;
  };

  // updates game over screen but doesnt save to LocalStorage
  const updateGameOverDisplayNoSave = () => {
    // Update final score
    finalScoreDisplay.textContent = score;
    getScoreColor(score, finalScoreDisplay);

    // update game stats
    timedPlayed = timedPlayed - timeLeft;
    molesHitDisplay.textContent = molesHit;
    getScoreColor(molesHit, molesHitDisplay);
    babiesHitDisplay.textContent = babiesHit;
    if (babiesHit > 0) {
      babiesHitDisplay.style.color = "red";
    }
    timePlayedDisplay.textContent = `${timedPlayed}s`;
    if (timedPlayed === 0) {
      timePlayedDisplay.style.color = "red";
    } else if (timedPlayed < 60) {
      timePlayedDisplay.style.color = "orange";
    }

    // Update performance title
    const achievementTitle = getAchievementTitle(score);
    achievementTitleDisplay.textContent = achievementTitle;

    // Show existing leaderboard (don't add new entry)
    const fetchedLeaderboard = getLeaderboard();
    leaderboardList.replaceChildren();

    // Add existing leaderboard entries (no new entry added)
    fetchedLeaderboard.forEach((entry, index) => {
      const leaderboardEntry = createLeaderboardEntry(entry, index);
      leaderboardList.appendChild(leaderboardEntry);
    });

    // If no scores yet, show placeholder
    if (fetchedLeaderboard.length === 0) {
      const placeholderDiv = document.createElement("div");
      placeholderDiv.classList.add("leaderboard-entry");
      placeholderDiv.textContent = "No scores yet - be the first!";
      leaderboardList.appendChild(placeholderDiv);
    }
  };

  // update game over screen/leaderboard display
  const updateGameOverDisplayAndSave = () => {
    // update final score
    finalScoreDisplay.textContent = score;
    getScoreColor(score, finalScoreDisplay);

    // update game stats
    timedPlayed = timedPlayed - timeLeft;
    molesHitDisplay.textContent = molesHit;
    getScoreColor(molesHit, molesHitDisplay);
    babiesHitDisplay.textContent = babiesHit;
    if (babiesHit > 0) {
      babiesHitDisplay.style.color = "red";
    }
    timePlayedDisplay.textContent = `${timedPlayed}s`;
    if (timedPlayed === 0) {
      timePlayedDisplay.style.color = "red";
    } else if (timedPlayed < 60) {
      timePlayedDisplay.style.color = "orange";
    }

    // Update performance title
    const achievementTitle = getAchievementTitle(score);
    achievementTitleDisplay.textContent = achievementTitle;

    // Update leaderboard with real data
    // fetched from LocalStorage
    const fetchedLeaderboard = getLeaderboard();
    // clear existing entries in leaderboard []
    leaderboardList.replaceChildren();

    // Add real leaderboard entries
    fetchedLeaderboard.forEach((entry, index) => {
      const leaderboardEntry = createLeaderboardEntry(entry, index);
      leaderboardList.appendChild(leaderboardEntry);
    });

    // if no scores yet, show a placeholder
    if (fetchedLeaderboard.length === 0) {
      const placeholderDiv = document.createElement("div");
      placeholderDiv.classList.add("leaderboard-entry");
      placeholderDiv.textContent = "No scores yet - be the first!";
      leaderboardList.appendChild(placeholderDiv);
    }
  };

  // Save score to leaderboard in localStorage
  const saveToLeaderboard = (name, score) => {
    const achievementTitle = getAchievementTitle(score);
    // Create score object
    const scoreData = {
      name: `${name} - ${achievementTitle}`,
      score: score,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
    };

    const leaderboard = getLeaderboard();
    // Add new score
    leaderboard.push(scoreData);
    // Sort by score (highest first) and keep top 5
    leaderboard.sort((a, b) => b.score - a.score);
    const topScores = leaderboard.slice(0, 5);
    // Save back to localStorage
    // saves topScores
    localStorage.setItem("savedLeaderboard", JSON.stringify(topScores));
  };

  // Get achievement title based on score
  const getAchievementTitle = (score) => {
    if (score >= 27) return "Mole-itary Commander";
    if (score >= 26) return "Baby Spotter";
    if (score >= 21) return "Mole-cular Expert";
    if (score >= 16) return "Mole Crusher";
    if (score >= 11) return "Lawn Defender";
    if (score >= 6) return "Mole Spotter";
    return "Lawn Helper";
  };

  // save score function
  const saveScore = () => {
    const playerName = getPlayerName();
    saveToLeaderboard(playerName, score);
    console.log(`Saved: ${playerName} - ${score} points`);
    closeNameDialog();
    showScreen("game-over-screen");
    updateGameOverDisplayAndSave();
  };

  // game reset
  const resetGame = () => {
    clearInterval(gameTimer);
    showScreen("game-screen");
    timeLeft = 60;
    updateGameTimeDisplay();
    score = 0;
    updateGameScoreDisplay();
    updateGameStatusDisplay("Ready");
  };

  // nameinput dialog show function
  const showNameDialog = () => {
    // display score
    dialogScoreDisplay.textContent = score;
    // clear input field
    nameInput.value = "";
    // show dialogbox with flex centering
    dialogBox.classList.add("show");
    // focus on inout field
    nameInput.focus();
  };

  // close dialog box function
  const closeNameDialog = () => {
    // const dialogBox = document.getElementById("name-dialog");
    dialogBox.classList.remove("show");
  };

  // ends game function (not user initiated)
  const gameOver = () => {
    clearInterval(gameTimer);
    showNameDialog();
    updateGameStatusDisplay("Game over");
  };

  // user initiated end of game
  const userQuits = () => {
    const confirmQuit = window.confirm(
      "Are you sure you want to quit? Your progress won't be saved."
    );

    if (confirmQuit) {
      clearInterval(gameTimer);
      showScreen("game-over-screen");
      updateGameOverDisplayNoSave();
      // dont save score since user quits

      // showScreen("game-over-screen");
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
          updateGameTimeDisplay();
          updateGameScoreDisplay();
          updateGameStatusDisplay("Playing");
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
            mole.src = moleImg;
            mole.classList.add("mole");
            targetContainer.appendChild(mole);

            // mole click - YAY!
            mole.addEventListener("click", (event) => {
              event.preventDefault();
              event.stopPropagation();

              // DEBUG SOUND
              console.log("MOLE CLICKED - playing bonk");

              mole.src = squishedMoleImg;
              mole.classList.add("squished");
              console.log(
                "HIT! You hit the mole and earn a point -- keep HITTING!"
              );
              score++;
              molesHit++;
              playBonk();
            });
          } else {
            const baby = document.createElement("img");
            baby.src = happyBabyImg;
            baby.classList.add("baby");
            targetContainer.appendChild(baby);

            // baby click - OUCH!
            baby.addEventListener("click", (event) => {
              event.preventDefault();
              event.stopPropagation();

              playCry();

              baby.src = cryingBabyImg;
              console.log("OUCH! You hit the baby! Score goes back to ZERO. ");
              score = 0;
              babiesHit++;
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
          if (timeLeft <= 40) {
            gameTimeDisplay.style.color = "gold";
          }
          if (timeLeft <= 25) {
            gameTimeDisplay.style.color = "orange";
          }

          if (timeLeft === 10) {
            playClock();
          }

          if (timeLeft <= 10) {
            gameTimeDisplay.style.color = "red";
          }

          if (timeLeft === 0) {
            gameOver();
            // gameTimeDisplay.style.color = "red";
          }
        }, 1000);
    }
  };
  // ----------------------------------------------------------------------------- //
  // 5. EVENT LISTENERS (after all functions are declared)
  // ----------------------------------------------------------------------------- //
  // cursor on mousedown
  document.addEventListener("mousedown", () => {
    document.body.classList.add("mousedown");
  });

  // cursor on mouseup
  document.addEventListener("mouseup", () => {
    document.body.classList.remove("mousedown");
  });

  // Handle when mouse leaves the window
  // document.addEventListener("mouseleave", () => {
  //   document.body.classList.remove("mousedown");
  // });

  // Welcome screen buttons
  welcomeEnterLawnBtn.addEventListener("click", () => {
    showScreen("game-screen");
    resetGame();
  });

  welcomeRulesBtn.addEventListener("click", () => {
    initializeSounds();
    showScreen("mechanics-screen");
  });

  // Mechanics screen buttons
  mechanicsEnterLawnBtn.addEventListener("click", () => {
    initializeSounds();
    showScreen("game-screen");
    resetGame();
  });
  goBackBtn.addEventListener("click", () => {
    if (previousScreenId) {
      showScreen(previousScreenId);
    }
  });

  // Game screen buttons
  gameRulesBtn.addEventListener("click", () => {
    showScreen("mechanics-screen");
  });

  // startgame click event
  startGameBtn.addEventListener("click", startGame);

  // user quit game event
  endGameBtn.addEventListener("click", userQuits);

  // DialogBox buttons
  // cancels save score
  cancelSaveBtn.addEventListener("click", () => {
    closeNameDialog();
    showScreen("game-over-screen");
    updateGameOverDisplayNoSave();
  });

  // saves score
  saveScoreBtn.addEventListener("click", () => {
    saveScore();
  });

  // Gameover screen
  // playagain
  playAgainBtn.addEventListener("click", () => {
    initializeSounds();
    showScreen("game-screen");
    resetGame();
  });

  // back to welcome screen btn
  backToWelcomeBtn.addEventListener("click", () => {
    const confirmExit = window.confirm("Are you sure you want to exit?");
    if (confirmExit) {
      showScreen("welcome-screen");
    }
  });

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

  // exit button
  // temporary just to style Game over screen
  exitGameBtn.addEventListener("click", () => {
    const confirmExit = window.confirm("Are you sure you want to exit?");
    if (confirmExit) {
      showScreen("welcome-screen");
    }
  });

  // Initialize
  updateGameTimeDisplay();
  showScreen("welcome-screen");
  updateGameScoreDisplay();
  updateGameStatusDisplay("Ready");
});

// -------------------------__CODE HELPER ------------------------------------------
// string.prototype.padStart()
// existingString.padStart(targetLength)
// existingString.padStart(targetLength, padString)
