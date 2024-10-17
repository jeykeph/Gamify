# Decentralized Board Game Platform

## Overview

This project implements a decentralized board game platform on the Stacks blockchain using Clarity smart contracts. Players can create games, make moves, and earn NFT rewards for victories. The platform supports various board games and includes features for community-driven game creation and rule modifications.

## Features

- On-chain game logic and moves
- NFT rewards for victories or milestones
- Community-driven game creation and rules modifications
- Player statistics tracking

## Smart Contract Structure

The main smart contract (`board-game.clar`) includes the following key components:

- Game creation and management
- Move validation and execution
- Game conclusion and reward distribution
- Player statistics tracking

## Getting Started

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet)
- [Node.js](https://nodejs.org/) and npm

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/decentralized-board-game.git
   cd decentralized-board-game
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run Clarinet console:
   ```
   clarinet console
   ```

## Testing

We use Vitest for testing our smart contracts. To run the tests:

```
npm test
```

## Usage

Here are some example interactions with the smart contract:

1. Create a new game:
   ```clarity
   (contract-call? .board-game create-game "chess" 'STDMAYER3PTRJH6FQVAAYR8H9FQKT0ZXGM1YRWY)
   ```

2. Make a move:
   ```clarity
   (contract-call? .board-game make-move u1 "e2-e4")
   ```

3. End a game:
   ```clarity
   (contract-call? .board-game end-game u1 tx-sender)
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
