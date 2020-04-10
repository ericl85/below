import "phaser";
import * as signalR from "@microsoft/signalr";
import { Player, PlayerStateMessage } from "./player";

export default class BelowGame extends Phaser.Scene {
  private _keysToPoll: Phaser.Input.Keyboard.Key[];
  private _players: Player[];

  constructor() {
    super("demo");

    this._keysToPoll = [];
    this._players = [];
  }

  preload() {
    this.load.image("ship", "assets/ship1.png");
    this.load.image("engine", "assets/blue.png");
  }

  create() {
    this.input.on("pointerdown", (pointer) => {
      this.input.mouse.requestPointerLock();
    });

    this.cameras.main.setBounds(0, 0, 16384, 16384);
    // this.cameras.main.startFollow(this._player);
    this.cameras.main.setZoom(0.5);

    // Build our connection to the game server
    const connection = new signalR.HubConnectionBuilder().withUrl("/game").build();

    // Start the connection and when connected, join the game
    connection
      .start()
      .then(() => connection.send("join"))
      .catch((err) => {
        console.log(`lol fuck: ${err}`);
      });

    // Once we get the join success message, add our player sprite to the scene.
    // Then subscribe to game state updates.
    connection.on("joinSuccess", (playerState: PlayerStateMessage) => {
      this._players.push(new Player(this, 400, 300, playerState.id, true));

      connection.stream("gameStateUpdates").subscribe({
        next: (message: PlayerStateMessage) => {
          let currentPlayer = this._players.find((p) => p.getId() === message.id);
          if (!currentPlayer) {
            currentPlayer = new Player(this, 400, 300, message.id, false);
            this._players.push(currentPlayer);
          }
        },
        complete: () => {
          // Lol wut, how we get here?
          console.log("Lol wut?");
        },
        error: (err) => {
          console.error(`Fuck: ${err}`);
        },
      });
    });

    connection.send("join");
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
