import { Howl } from "howler";

// dont create Howl objects immediately - wait til needed
let bonk = null;
let cry = null;

// lazy loads the audio creation
// Initialize sounds when first needed
const soundsInit = () => {
  // console.log("soundsInit called");
  if (!bonk) {
    // console.log("Creating bonk sound...");
    bonk = new Howl({
      src: ["./assets/bonksound.mp3"],
      onload: () => console.log("Bonk loaded successfully!"),
      onloaderror: (id, err) => console.log("Bonk load error:", err),
    });
  }
  if (!cry) {
    // console.log("Creating cry sound...");
    cry = new Howl({
      src: ["./assets/babycry.mp3"],
      onload: () => console.log("Cry loaded successfully!"),
      onloaderror: (id, err) => console.log("Cry load error:", err),
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

  // SOUND DEBGGING
  // console.log("bonk exists:", bonk ? "yes" : "no");
  // console.log("bonk state:", bonk ? bonk.state() : "no bonk");

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
