// Wait till the browser is ready to render the game (avoids glitches)

window.requestAnimationFrame(function () {
  new GameView(KeyboardInputManager, HTMLActuator, LocalStorageManager);
});
