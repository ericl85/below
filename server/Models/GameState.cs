using System.Collections.Generic;

namespace Below.Server
{
    public class GameState
    {
        private readonly object _nextIdLock = new object();
        private int _nextId = 1;

        public Dictionary<int, Player> Players { get; set; }

        public GameState()
        {
            Players = new Dictionary<int, Player>();
        }

        public Player AddPlayer()
        {
            int playerId = 0;
            lock (_nextIdLock)
            {
                playerId = _nextId;
                _nextId++;
            }

            var player = new Player
            {
                Id = playerId,
                Direction = new Vec2
                {
                    X = 1.0F,
                    Y = 0.0F
                },
                Velocity = 0
            };

            Players.Add(playerId, player);

            return player;
        }
    }

    public class Player
    {
        public int Id { get; set; }
        public Vec2 Direction { get; set; }
        public float Velocity { get; set; }
    }

    public struct PlayerUpdate
    {
        public Vec2 Direction { get; set; }
        public bool FiringEngine { get; set; }
    }
}
