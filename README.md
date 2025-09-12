# Craps Simulator

A comprehensive craps casino game simulator with beautiful CLI interface, designed for future expansion to web, desktop, and multiplayer versions.

## Features

- 🎲 **Realistic Craps Gameplay**: All standard casino bets and rules
- 💰 **$10,000 Starting Bankroll**: Full casino experience
- 🎯 **All Bet Types**: Pass/Don't Pass, Odds, Place, Field, Hardways, Props
- 🎨 **Beautiful CLI**: Colorful terminal interface with animations
- 🎲 **Secure Random Dice**: Cryptographically secure randomness
- ⚙️ **Player Options**: Working bets, press winnings, parlay mode
- 🧪 **Comprehensive Testing**: Unit and E2E tests
- 📐 **Modular Architecture**: Ready for UI/multiplayer expansion

## Quick Start

```bash
# Install dependencies
npm install

# Start the CLI game
npm start

# Run tests
npm test

# Development mode with auto-restart
npm run dev
```

## Game Rules

### Chip Denominations
- $1 (White)
- $5 (Red) 
- $25 (Green)
- $100 (Black)
- $500 (Purple)

### Available Bets
- **Pass/Don't Pass**: Basic line bets
- **Odds**: Behind the line with proper multipliers
- **Place Bets**: Numbers 4,5,6,8,9,10
- **Field**: One-roll bet on 2,3,4,9,10,11,12
- **Hardways**: Hard 4,6,8,10
- **Propositions**: Horn, Any Seven, Hop bets

### Player Controls
- Place and remove bets
- Press winnings (let them ride)
- Toggle working bets on/off
- Clear entire table

## Architecture

Built with modular, testable architecture:

```
src/
├── game.js              # Main API
├── gameState.js         # State management  
├── dice.js              # Secure randomness
├── chipManager.js       # Chip handling
├── payouts.js          # Centralized odds
├── bets/               # Bet implementations
└── utils/              # Constants & helpers

cli/                    # Terminal interface
tests/                  # Comprehensive testing
```

## Development

### Project Structure
- **Modular Design**: Each component has single responsibility
- **Loose Coupling**: Easy to test and extend
- **Event-Driven**: Ready for UI integration
- **Future-Ready**: Web → Electron → Multiplayer path

### Testing
```bash
npm test                # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

### Code Quality
```bash
npm run lint           # ESLint checking
```

## Future Roadmap

1. **CLI Version** (Current)
2. **Web Interface**: HTML5 Canvas craps table
3. **Electron Desktop**: Native desktop app
4. **Multiplayer**: Real-time multiplayer tables

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with Node.js and modern JavaScript
- CLI interface powered by Chalk, Inquirer, and CLI-Table3
- Comprehensive testing with Jest
- Mathematical accuracy verified through extensive testing