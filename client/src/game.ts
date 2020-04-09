import "phaser";
import { Player } from "./player";
import { inputState } from "./inputState";

export default class BelowGame extends Phaser.Scene {
  private _keysToPoll: Phaser.Input.Keyboard.Key[];
  private _player: Player;

  constructor() {
    super("demo");

    this._keysToPoll = [];
  }

  preload() {
    this.load.image("ship", "assets/ship1.png");
  }

  create() {
    this._player = new Player(this, 400, 300);

    this.input.on("pointerdown", (pointer) => {
      this.input.mouse.requestPointerLock();
    });

    this._keysToPoll.push(
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    );
  }

  update() {}
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#000000",
  width: 1024,
  height: 768,
  scene: BelowGame,
  physics: {
    default: "arcade",
    arcade: {
      fps: 60,
      gravity: { y: 0 },
    },
  },
};

const game = new Phaser.Game(config);
