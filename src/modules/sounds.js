import { Howl } from "howler";

// dont create Howl objects immediately - wait til needed
let bonk = null;
let cry = null;

// lazy loads the audio creation
// Initialize sounds when first needed
const soundsInit = () => {
  if (!bonk) {
    bonk = new Howl({
      src: ["src/assets/bonksound.mp3"],
    });
  }
  if (!cry) {
    cry = new Howl({
      src: ["src/assets/babycry.mp3"],
    });
  }
};

// export sounds init function for manual initialization
export const initializeSounds = () => {
  soundsInit();
  console.log(`Sounds initialized`);
};

// playBonk sound func to export
export const playBonk = () => {
  // create bonk if doesnt exist
  soundsInit();
  // starts at .55s
  bonk.seek(0.55);
  bonk.play();

  setTimeout(() => {
    bonk.stop();
  }, 200);
};

// playCry sound func to export
export const playCry = () => {
  // create bonk if doesnt exist
  soundsInit();
  // starts at .55
  cry.seek(0.55);
  cry.play();

  setTimeout(() => {
    cry.stop();
  }, 750);
};
