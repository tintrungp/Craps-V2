# Craps Simulator Development Plan

## Project Overview
A comprehensive craps simulator web app with modular architecture, starting with a CLI interface and designed for future expansion to web UI, Electron desktop app, and multiplayer functionality.

## Core Requirements
- **Starting Bankroll**: $10,000
- **Chip Denominations**: $1, $5, $25, $100, $500
- **All Standard Craps Bets**: Pass/Don't Pass, Odds, Place, Field, Hardways, Propositions
- **Secure Random Dice**: Cryptographically secure randomness
- **Player Options**: Working bets toggle, press winnings, parlay mode
- **Comprehensive Testing**: Unit tests + E2E tests
- **Future-Ready Architecture**: CLI → Web → Electron → Multiplayer

## Architecture Principles

### Modular Design
- **Single Responsibility**: Each module has one clear purpose
- **Loose Coupling**: Minimal dependencies between modules
- **High Cohesion**: Related functionality grouped together
- **Testability**: Each module can be tested in isolation

### File Structure
```
craps-simulator/
├── package.json
├── README.md
├── DEVELOPMENT_PLAN.md
├── cli/
│   ├── index.js              # CLI entry point
│   ├── interface.js          # Terminal UI management
│   ├── animations.js         # Dice rolls, chip animations
│   └── prompts.js           # Inquirer prompt configurations
├── src/
│   ├── game.js              # Main game controller (API)
│   ├── gameState.js         # Game state management
│   ├── dice.js              # Dice rolling and randomness
│   ├── chipManager.js       # Chip denominations and validation
│   ├── payouts.js           # Centralized payout calculations
│   ├── bets/
│   │   ├── index.js         # Bet registry and factory
│   │   ├── BaseBet.js       # Abstract base class
│   │   ├── PassLineBets.js  # Pass/Don't Pass + Odds
│   │   ├── PlaceBets.js     # Place bets (4,5,6,8,9,10)
│   │   ├── FieldBets.js     # Field betting
│   │   ├── HardwayBets.js   # Hard 4,6,8,10
│   │   └── PropBets.js      # Horn, Any Seven, etc.
│   ├── utils/
│   │   ├── constants.js     # Game constants and rules
│   │   ├── validators.js    # Input validation utilities
│   │   └── helpers.js       # General utility functions
│   └── events/
│       └── EventEmitter.js  # Custom event system for UI
└── tests/
    ├── unit/
    │   ├── gameState.test.js
    │   ├── dice.test.js
    │   ├── chipManager.test.js
    │   ├── payouts.test.js
    │   └── bets/
    │       ├── PassLineBets.test.js
    │       ├── PlaceBets.test.js
    │       ├── FieldBets.test.js
    │       ├── HardwayBets.test.js
    │       └── PropBets.test.js
    ├── e2e/
    │   ├── gameFlow.test.js
    │   ├── bettingScenarios.test.js
    │   └── bankrollManagement.test.js
    └── fixtures/
        └── testData.js
```

## Implementation Phases

### Phase 1: Foundation (Core Engine)
**Goal**: Working game engine with all business logic

#### 1.1 Project Setup ✅
- [x] Initialize Node.js project with dependencies
- [x] Set up testing framework (Jest)
- [x] Configure ESLint and development scripts
- [ ] Create project structure

#### 1.2 Core Systems
- [ ] **Constants & Configuration**
  - Game rules and betting limits
  - Odds tables for all bet types
  - Chip denominations and colors
  - Error messages and game text

- [ ] **Dice System** (`src/dice.js`)
  - Cryptographically secure random number generation
  - Dice roll simulation (two 6-sided dice)
  - Roll validation and history tracking
  - Statistical analysis methods

- [ ] **Game State Manager** (`src/gameState.js`)
  - Player bankroll management ($10,000 starting)
  - Game phase tracking (come-out vs. point)
  - Current point number storage
  - Active bet registry and amounts
  - Round history and statistics

- [ ] **Chip Manager** (`src/chipManager.js`)
  - 5 denomination system ($1, $5, $25, $100, $500)
  - Bet amount validation
  - Chip combination optimization
  - Insufficient funds checking

#### 1.3 Betting Architecture
- [ ] **Base Bet Class** (`src/bets/BaseBet.js`)
  - Common bet interface and lifecycle
  - Bet validation and state management
  - Abstract methods for resolution logic

- [ ] **Bet Registry** (`src/bets/index.js`)
  - Bet type factory and registration
  - Bet instance management
  - Type-specific validation

- [ ] **Payout Engine** (`src/payouts.js`)
  - Centralized odds storage
  - Payout calculation methods
  - House edge validation
  - Mathematical correctness verification

### Phase 2: Betting System Implementation
**Goal**: All standard craps bets with proper resolution

#### 2.1 Core Bets
- [ ] **Pass Line Bets** (`src/bets/PassLineBets.js`)
  - Pass and Don't Pass
  - Odds bets (behind the line)
  - Come-out roll vs. point resolution
  - Maximum odds multipliers

#### 2.2 Numbers Bets
- [ ] **Place Bets** (`src/bets/PlaceBets.js`)
  - Place bets on 4,5,6,8,9,10
  - Buy bets with commission
  - Working vs. Off toggle functionality
  - Proper odds: 4/10 (9:5), 5/9 (7:5), 6/8 (7:6)

#### 2.3 One-Roll Bets
- [ ] **Field Bets** (`src/bets/FieldBets.js`)
  - Field betting (2,3,4,9,10,11,12)
  - 2:1 payout on 2 and 12
  - 3:1 payout options for 2 or 12

#### 2.4 Multi-Roll Proposition Bets
- [ ] **Hardway Bets** (`src/bets/HardwayBets.js`)
  - Hard 4, 6, 8, 10
  - Resolution on hard number vs. seven vs. soft number
  - Working vs. Off on come-out rolls

#### 2.5 Center Table Bets
- [ ] **Proposition Bets** (`src/bets/PropBets.js`)
  - Horn bets (2,3,11,12)
  - Any Seven, Any Craps
  - Hop bets
  - High-low bets

### Phase 3: Game Logic Integration
**Goal**: Complete game flow with all rules

#### 3.1 Game Controller
- [ ] **Main Game API** (`src/game.js`)
  - Public interface for all game operations
  - Game flow orchestration
  - Event emission for UI updates
  - State persistence methods

#### 3.2 Player Options
- [ ] **Advanced Bet Management**
  - Working bets toggle (place bets on come-out)
  - Press winnings functionality
  - Parlay mode (let winnings ride)
  - Take bets down options

#### 3.3 Game Flow Logic
- [ ] **Come-Out Roll Phase**
  - Pass line resolution (7,11 win / 2,3,12 lose)
  - Point establishment (4,5,6,8,9,10)
  - Bet state transitions

- [ ] **Point Phase**
  - Point number resolution
  - Seven-out detection
  - Multiple roll tracking

### Phase 4: CLI Interface
**Goal**: Beautiful, interactive command-line interface

#### 4.1 CLI Foundation
- [ ] **CLI Entry Point** (`cli/index.js`)
  - Command-line argument parsing
  - Game initialization
  - Error handling and graceful exits

- [ ] **Terminal Interface** (`cli/interface.js`)
  - Chalk color schemes for chips and table
  - ASCII art for branding (figlet)
  - Screen clearing and cursor management

#### 4.2 Interactive Elements
- [ ] **User Prompts** (`cli/prompts.js`)
  - Inquirer configurations
  - Bet selection menus
  - Chip amount inputs
  - Game option toggles

- [ ] **Animations** (`cli/animations.js`)
  - Dice roll animations with suspense
  - Chip stacking visualizations
  - Payout celebrations
  - Progress indicators

#### 4.3 Table Display
- [ ] **Craps Table ASCII**
  - cli-table3 for bet placement visualization
  - Current bets display with amounts
  - Point marker and game phase indicators
  - Bankroll and statistics display

### Phase 5: Testing & Quality
**Goal**: Comprehensive test coverage and validation

#### 5.1 Unit Testing
- [ ] **Core System Tests**
  - Dice randomness and distribution
  - Game state transitions
  - Chip management and validation
  - Payout mathematical accuracy

- [ ] **Bet Logic Tests**
  - Each bet type resolution logic
  - Edge cases and boundary conditions
  - Invalid bet handling
  - Multi-bet scenarios

#### 5.2 Integration Testing
- [ ] **E2E Game Flow**
  - Complete game scenarios
  - Multi-roll sequences
  - Complex betting combinations
  - Bankroll depletion scenarios

#### 5.3 Mathematical Validation
- [ ] **House Edge Verification**
  - Statistical analysis of all bet types
  - Long-term expectation validation
  - Odds calculation accuracy
  - Random distribution testing

## Player Experience Features

### Betting Options
- **Standard Bets**: Pass, Don't Pass, Come, Don't Come
- **Odds Bets**: Behind the line with proper multipliers
- **Place Bets**: 4,5,6,8,9,10 with working/off toggle
- **Field Bets**: One-roll with 2:1 and 3:1 payouts
- **Hardways**: 4,6,8,10 with multi-roll tracking
- **Props**: Horn, Any Seven, Hop bets

### Player Controls
- **Chip Selection**: Choose from 5 denominations
- **Bet Management**: Place, press, take down, parlay
- **Working Toggles**: Control place bet activity
- **Clear Table**: Remove all bets before roll

### Information Display
- **Current Bankroll**: Real-time balance
- **Active Bets**: All placed bets with amounts
- **Game Phase**: Come-out vs. point with point number
- **Roll History**: Recent dice results
- **Statistics**: Win/loss ratios, time played

## Future Development Phases

### Phase 6: Web Interface
- **HTML5 Canvas**: Interactive craps table
- **Responsive Design**: Mobile and desktop support
- **Touch Controls**: Drag-and-drop betting
- **Visual Effects**: Dice animations, chip movements

### Phase 7: Electron Desktop App
- **Native Packaging**: Windows, macOS, Linux
- **Local Storage**: Save games and statistics
- **Offline Play**: No network required
- **System Integration**: Native menus and notifications

### Phase 8: Multiplayer Functionality
- **Network Architecture**: Real-time multiplayer
- **Room System**: Private and public tables
- **Chat System**: Player communication
- **Spectator Mode**: Watch games in progress

### Phase 9: Advanced Features
- **Statistics Engine**: Detailed analytics
- **Betting Strategies**: AI-assisted suggestions
- **Tutorial Mode**: Learn craps rules
- **Tournament Mode**: Competitive play

## Technical Considerations

### Performance
- **Memory Management**: Efficient state handling
- **CPU Usage**: Optimized calculations
- **Scalability**: Support for multiple concurrent games

### Security
- **Random Generation**: Cryptographically secure dice
- **Input Validation**: Prevent invalid bets
- **State Integrity**: Protect against manipulation

### Maintainability
- **Code Documentation**: Comprehensive inline docs
- **API Documentation**: External interface docs
- **Version Control**: Semantic versioning
- **Continuous Integration**: Automated testing

## Success Criteria

### Functionality
- [x] All standard craps bets implemented correctly
- [ ] Proper odds and payouts for every bet type
- [ ] Realistic game flow matching casino rules
- [ ] Comprehensive error handling

### Quality
- [ ] 80%+ test coverage on all modules
- [ ] Zero mathematical errors in payout calculations
- [ ] Clean, maintainable, well-documented code
- [ ] Performance suitable for real-time play

### User Experience
- [ ] Intuitive CLI interface
- [ ] Clear visual feedback for all actions
- [ ] Helpful error messages and guidance
- [ ] Smooth, engaging gameplay flow

### Architecture
- [ ] Modular design enabling easy extension
- [ ] Clean separation between game logic and UI
- [ ] Event-driven architecture for responsiveness
- [ ] Ready for web/desktop/multiplayer expansion

---

## Development Notes

### Key Decisions Made
1. **Hybrid Payout Architecture**: Centralized odds in payouts.js, logic in bet files
2. **Player Options**: Working bets, press winnings, parlay mode toggles
3. **CLI-First Approach**: Terminal interface before web UI
4. **Node.js Foundation**: JavaScript throughout for consistency

### Next Steps After Plan Completion
1. Review this plan with stakeholders
2. Set up development environment
3. Begin Phase 1 implementation
4. Establish regular review checkpoints
5. Plan demo sessions for feedback

This plan serves as a living document and will be updated as development progresses and requirements evolve.