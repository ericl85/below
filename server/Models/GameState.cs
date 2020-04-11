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
                Rotation = 0.0F,
                Velocity = new Vec2
                {
                    X = 10.0F,
                    Y = 10.0F,
                },
                Position = new Vec2
                {
                    X = 400.0F,
                    Y = 300.0F,
                }
            };

            Players.Add(playerId, player);

            return player;
        }
    }

    public class Player
    {
        public int Id { get; set; }
        public float Rotation { get; set; }
        public Vec2 Velocity { get; set; }
        public Vec2 Position { get; set; }
    }

    public struct PlayerUpdate
    {
        public int Id { get; set; }
        public float Rotation { get; set; }
        public Vec2 Velocity { get; set; }
        public bool FiringEngine { get; set; }
    }
}
