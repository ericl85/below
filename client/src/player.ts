import "phaser";
import { InputState } from "./inputState";

export class Player extends Phaser.Physics.Arcade.Image {
  private _keys;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "ship");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setMaxVelocity(200);

    scene.input.on(
      "pointermove",
      (pointer) => {
        this.setRotation(this.rotation + pointer.movementX / 1000);
      },
      this
    );

    const { W } = Phaser.Input.Keyboard.KeyCodes;
    this._keys = scene.input.keyboard.addKeys({ fireEngine: W });
  }

  public preUpdate(time, delta) {
    if (this._keys.fireEngine.isDown) {
      this.scene.physics.velocityFromRotation(this.rotation, 200, (this.body as Phaser.Physics.Arcade.Body).acceleration);
    } else {
      this.setAcceleration(0);
    }
  }
}
