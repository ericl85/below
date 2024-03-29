import "phaser";

interface Vec2 {
  x: number;
  y: number;
}

export interface PlayerStateMessage {
  id: number;
  rotation: number;
  velocity: Vec2;
  position: Vec2;
}

interface PlayerInputState {
  fireEngine: Phaser.Input.Keyboard.Key;
}

export class Player extends Phaser.Physics.Arcade.Image {
  private _playerId: number;
  private _handleInput: boolean;
  private _keys: PlayerInputState;
  private _particleManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private _particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene, x: number, y: number, id: number, handleInput: boolean) {
    super(scene, x, y, "ship");

    this._playerId = id;
    this._handleInput = handleInput;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this._particleManager = scene.add.particles("engine");
    this._particleEmitter = this._particleManager.createEmitter({
      speed: { min: 400, max: 600 },
      scale: { start: 0.4, end: 0 },
      blendMode: "ADD",
      lifespan: 1000,
      quantity: 2,
      on: false,
      angle: -180,
    });

    this.setMaxVelocity(200);
    if (handleInput) {
      scene.input.on(
        "pointermove",
        (pointer) => {
          this.setRotation(this.rotation + pointer.movementX / 1000);
        },
        this
      );
    }

    const { W } = Phaser.Input.Keyboard.KeyCodes;
    this._keys = scene.input.keyboard.addKeys({ fireEngine: W }) as PlayerInputState;
  }

  public preUpdate(time, delta) {
    if (this._handleInput) {
      if (this._keys.fireEngine.isDown) {
        this.scene.physics.velocityFromRotation(this.rotation, 200, (this.body as Phaser.Physics.Arcade.Body).acceleration);
        this._particleEmitter.start();
      } else {
        this.setAcceleration(0);
        this._particleEmitter.stop();
      }
    }

    const emitterPos = Phaser.Math.Rotate({ x: this.width / 2, y: 0 }, this.rotation);
    this._particleEmitter.setPosition(this.x - emitterPos.x, this.y - emitterPos.y);
    this._particleEmitter.setAngle(Phaser.Math.RadToDeg(this.rotation + Math.PI));
  }

  public update(time, delta) {}

  public getId() {
    return this._playerId;
  }

  public processUpdate(update: PlayerStateMessage) {
    this.setRotation(update.rotation);
    this.setVelocity(update.velocity.x, update.velocity.y);
  }
}
