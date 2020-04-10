namespace Below.Server
{
    public class GameStateService
    {
        public GameState GameState { get; set; }

        public GameStateService()
        {
            GameState = new GameState();
        }
    }
}
