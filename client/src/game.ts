import "phaser";
import { Player } from "./player";

export default class BelowGame extends Phaser.Scene {
  private _keysToPoll: Phaser.Input.Keyboard.Key[];
  private _player: Player;

  constructor() {
    super("demo");

    this._keysToPoll = [];
  }

  preload() {
    this.load.image("ship", "assets/ship1.png");
    this.load.image("engine", "assets/blue.png");
  }

  create() {
    this._player = new Player(this, 400, 300);

    this.input.on("pointerdown", (pointer) => {
      this.input.mouse.requestPointerLock();
    });

    this.cameras.main.setBounds(0, 0, 16384, 16384);
    this.cameras.main.startFollow(this._player);
    this.cameras.main.setZoom(0.5);
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
