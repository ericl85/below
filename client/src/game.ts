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
    connection.on("joinSuccess", async (playerState: PlayerStateMessage) => {
      const player = new Player(this, 400, 300, playerState.id, true);
      this._players.push(player);

      connection.stream("gameStateUpdates").subscribe({
        next: (message: PlayerStateMessage) => {
          let currentPlayer: Player = this._players.find((p) => p.getId() === message.id);
          if (!currentPlayer) {
            currentPlayer = new Player(this, 400, 300, message.id, false);
            this._players.push(currentPlayer);
          }
          currentPlayer.processUpdate(message);
        },
        complete: () => {
          // Lol wut, how we get here?
          console.log("Lol wut?");
        },
        error: (err) => {
          console.error(`Fuck: ${err}`);
        },
      });

      const subject = new signalR.Subject<PlayerStateMessage>();
      connection.send("playerUpdate", subject);
      setInterval(() => {
        subject.next({
          id: player.getId(),
          rotation: player.rotation,
          velocity: {
            x: (player.body as Phaser.Physics.Arcade.Body).velocity.x,
            y: (player.body as Phaser.Physics.Arcade.Body).velocity.y,
          },
          position: {
            x: player.x,
            y: player.y,
          },
        });
      }, 100);
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
