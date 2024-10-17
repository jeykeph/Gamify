import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that users can create a game",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const player1 = accounts.get('wallet_1')!;
    const player2 = accounts.get('wallet_2')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('board-game', 'create-game',
          [types.ascii("chess"), types.principal(player2.address)],
          player1.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    
    // Assert successful game creation
    block.receipts[0].result.expectOk().expectUint(1);
  },
});

Clarinet.test({
  name: "Ensure that players can make moves",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const player1 = accounts.get('wallet_1')!;
    const player2 = accounts.get('wallet_2')!;
    
    // Create a game
    let block = chain.mineBlock([
      Tx.contractCall('board-game', 'create-game',
          [types.ascii("chess"), types.principal(player2.address)],
          player1.address
      )
    ]);
    
    const gameId = block.receipts[0].result.expectOk().expectUint(1);
    
    // Player 1 makes a move
    block = chain.mineBlock([
      Tx.contractCall('board-game', 'make-move',
          [types.uint(gameId), types.ascii("e2-e4")],
          player1.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 3);
    block.receipts[0].result.expectOk().expectBool(true);
    
    // Player 2 tries to make a move (should fail as it's not their turn)
    block = chain.mineBlock([
      Tx.contractCall('board-game', 'make-move',
          [types.uint(gameId), types.ascii("e7-e5")],
          player2.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 4);
    block.receipts[0].result.expectErr().expectUint(100); // ERR_NOT_AUTHORIZED
  },
});

Clarinet.test({
  name: "Ensure that games can be ended and rewards are minted",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const player1 = accounts.get('wallet_1')!;
    const player2 = accounts.get('wallet_2')!;
    
    // Create a game
    let block = chain.mineBlock([
      Tx.contractCall('board-game', 'create-game',
          [types.ascii("chess"), types.principal(player2.address)],
          player1.address
      )
    ]);
    
    const gameId = block.receipts[0].result.expectOk().expectUint(1);
    
    // End the game
    block = chain.mineBlock([
      Tx.contractCall('board-game', 'end-game',
          [types.uint(gameId), types.principal(player1.address)],
          player1.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 3);
    block.receipts[0].result.expectOk().expectBool(true);
    
    // Check if reward NFT was minted
    const player1Balance = chain.callReadOnlyFn(
        'board-game',
        'get-balance',
        [types.principal(player1.address)],
        player1.address
    );
    player1Balance.result.expectOk().expectUint(1);
  },
});

Clarinet.test({
  name: "Ensure that player stats are updated correctly",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const player1 = accounts.get('wallet_1')!;
    const player2 = accounts.get('wallet_2')!;
    
    // Create and end a game
    let block = chain.mineBlock([
      Tx.contractCall('board-game', 'create-game',
          [types.ascii("chess"), types.principal(player2.address)],
          player1.address
      ),
      Tx.contractCall('board-game', 'end-game',
          [types.uint(1), types.principal(player1.address)],
          player1.address
      )
    ]);
    
    // Check player1's stats
    const player1Stats = chain.callReadOnlyFn(
        'board-game',
        'get-player-stats',
        [types.principal(player1.address)],
        player1.address
    );
    
    const expectedStats = {
      'games-played': types.uint(1),
      'games-won': types.uint(1)
    };
    
    assertEquals(player1Stats.result.expectOk(), expectedStats);
    
    // Check player2's stats
    const player2Stats = chain.callReadOnlyFn(
        'board-game',
        'get-player-stats',
        [types.principal(player2.address)],
        player2.address
    );
    
    const expectedStats2 = {
      'games-played': types.uint(1),
      'games-won': types.uint(0)
    };
    
    assertEquals(player2Stats.result.expectOk(), expectedStats2);
  },
});
