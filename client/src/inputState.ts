export interface InputState {
  firingEngine: boolean;
}
export const inputState = (keys: Phaser.Input.Keyboard.Key[]): InputState => {
  const state: InputState = {
    firingEngine: false,
  };

  for (const key of keys) {
    if (key.keyCode === Phaser.Input.Keyboard.KeyCodes.W && key.isDown) {
      state.firingEngine = true;
    }
  }

  return state;
};
