using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Below.Server
{
    public class GameHub : Hub
    {
        private GameStateService _gameStateService;
        private ILogger<GameHub> _logger;

        public GameHub(GameStateService gameStateService, ILogger<GameHub> logger)
        {
            _gameStateService = gameStateService;
            _logger = logger;
        }

        public async Task Join()
        {
            Player playerJoined = _gameStateService.GameState.AddPlayer();
            _logger.LogInformation("Player with ID {0} joined.", playerJoined.Id);

            await Clients.Caller.SendAsync("JoinSuccess", playerJoined);
        }

        public async IAsyncEnumerable<Player> GameStateUpdates([EnumeratorCancellation]CancellationToken token)
        {
            while (!token.IsCancellationRequested)
            {
                foreach (var player in _gameStateService.GameState.Players.Values)
                {
                    yield return player;
                }

                await Task.Delay(100);
            }
        }
    }
}
