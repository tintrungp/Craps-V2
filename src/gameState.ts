/**
 * @fileoverview Game state management for craps simulation
 * @author Craps Simulator Team
 * @version 1.0.0
 */

import { 
  STARTING_BANKROLL, 
  GAME_PHASES, 
  POINT_NUMBERS,
  BET_TYPES,
  ERROR_MESSAGES
} from './utils/constants.js';
import { validateGameState, ValidationError } from './utils/validators.js';
import { deepClone } from './utils/helpers.js';

/**
 * Manages the complete game state for a craps game
 * Handles bankroll, bets, game phase, statistics, and player options
 * @class
 */
export class GameState {
  public bankroll: number;
  public phase: string;
  public point: number | null;
  public bets: Map<string, any>;
  public rollHistory: any[];
  public gameHistory: any[];
  public statistics: any;
  public playerOptions: any;
  public gameStartTime: Date;
  public currentRound: number;

  constructor(initialBankroll: number = STARTING_BANKROLL) {
    this.bankroll = initialBankroll;
    this.phase = GAME_PHASES.COME_OUT;
    this.point = null;
    this.bets = new Map();
    this.rollHistory = [];
    this.gameHistory = [];
    this.statistics = this._initializeStatistics();
    this.playerOptions = this._initializePlayerOptions();
    this.gameStartTime = new Date();
    this.currentRound = 1;
    
    validateGameState(this);
  }

  _initializeStatistics() {
    return {
      totalRolls: 0,
      passLineWins: 0,
      passLineLosses: 0,
      totalWinnings: 0,
      totalLosses: 0,
      largestWin: 0,
      largestLoss: 0,
      roundsPlayed: 0,
      averageBetSize: 0,
      timePlayed: 0,
      highestBankroll: STARTING_BANKROLL,
      lowestBankroll: STARTING_BANKROLL,
      betTypeStats: {}
    };
  }

  _initializePlayerOptions() {
    return {
      workingBets: true,        // Place bets work on come-out roll
      pressWinnings: false,     // Automatically press winning bets
      parlayMode: false,        // Let winnings ride
      autoOdds: false,          // Automatically take max odds
      maxOddsMultiplier: 3      // Maximum odds multiplier
    };
  }

  /**
   * Place a bet on the craps table
   * @param {string} betType - Type of bet from BET_TYPES constants
   * @param {number} amount - Amount to bet in dollars
   * @param {Object} [metadata={}] - Additional bet metadata
   * @returns {boolean} True if bet was placed successfully
   * @throws {ValidationError} If insufficient funds or invalid bet
   */
  placeBet(betType, amount, metadata = {}) {
    if (this.bankroll < amount) {
      throw new ValidationError(ERROR_MESSAGES.INSUFFICIENT_BANKROLL);
    }

    if (this.bets.has(betType)) {
      const existingBet = this.bets.get(betType);
      existingBet.amount += amount;
      this.bankroll -= amount;
    } else {
      const bet = {
        type: betType,
        amount: amount,
        placedAt: new Date(),
        round: this.currentRound,
        working: this._isBetWorking(betType),
        ...metadata
      };
      
      this.bets.set(betType, bet);
      this.bankroll -= amount;
    }

    this._updateStatistics('betPlaced', { betType, amount });
    return true;
  }

  removeBet(betType) {
    const bet = this.bets.get(betType);
    if (!bet) {
      throw new ValidationError(ERROR_MESSAGES.BET_NOT_FOUND);
    }

    if (!this._canRemoveBet(betType)) {
      throw new ValidationError(`Cannot remove ${betType} bet at this time`);
    }

    this.bets.delete(betType);
    this.bankroll += bet.amount;
    
    return bet;
  }

  _canRemoveBet(betType) {
    switch (betType) {
      case BET_TYPES.PASS:
      case BET_TYPES.DONT_PASS:
        return this.phase === GAME_PHASES.COME_OUT;
      case BET_TYPES.COME:
      case BET_TYPES.DONT_COME:
        return !this.bets.get(betType)?.established;
      default:
        return true;
    }
  }

  _isBetWorking(betType) {
    const alwaysWorking = [
      BET_TYPES.PASS, BET_TYPES.DONT_PASS, BET_TYPES.FIELD,
      BET_TYPES.ANY_SEVEN, BET_TYPES.ANY_CRAPS, BET_TYPES.HORN
    ];

    if (alwaysWorking.includes(betType)) {
      return true;
    }

    if (betType.includes('place') || betType.includes('buy')) {
      return this.phase === GAME_PHASES.POINT || this.playerOptions.workingBets;
    }

    if (betType.includes('hard')) {
      return this.phase === GAME_PHASES.POINT || this.playerOptions.workingBets;
    }

    return true;
  }

  updateBetWorking(betType, working) {
    const bet = this.bets.get(betType);
    if (!bet) {
      throw new ValidationError(ERROR_MESSAGES.BET_NOT_FOUND);
    }

    if (this._canChangeBetWorking(betType)) {
      bet.working = working;
      return true;
    }

    throw new ValidationError(`Cannot change working status for ${betType} bet`);
  }

  _canChangeBetWorking(betType) {
    const allowedTypes = [
      BET_TYPES.PLACE_4, BET_TYPES.PLACE_5, BET_TYPES.PLACE_6,
      BET_TYPES.PLACE_8, BET_TYPES.PLACE_9, BET_TYPES.PLACE_10,
      BET_TYPES.BUY_4, BET_TYPES.BUY_5, BET_TYPES.BUY_6,
      BET_TYPES.BUY_8, BET_TYPES.BUY_9, BET_TYPES.BUY_10,
      BET_TYPES.HARD_4, BET_TYPES.HARD_6, BET_TYPES.HARD_8, BET_TYPES.HARD_10
    ];

    return allowedTypes.includes(betType);
  }

  /**
   * Establish a point number and transition to point phase
   * @param {number} pointNumber - Point number to establish (4,5,6,8,9,10)
   * @throws {ValidationError} If invalid point number
   */
  establishPoint(pointNumber) {
    if (!POINT_NUMBERS.includes(pointNumber)) {
      throw new ValidationError(`Invalid point number: ${pointNumber}`);
    }

    this.point = pointNumber;
    this.phase = GAME_PHASES.POINT;
    
    this._moveComeBetsToNumbers();
    this._updateBetWorkingStatus();
  }

  clearPoint() {
    this.point = null;
    this.phase = GAME_PHASES.COME_OUT;
    this.currentRound++;
    
    this._updateBetWorkingStatus();
    this.statistics.roundsPlayed++;
  }

  _moveComeBetsToNumbers() {
    for (const [betType, bet] of this.bets.entries()) {
      if (betType === BET_TYPES.COME && bet.point === this.point) {
        bet.established = true;
      }
    }
  }

  _updateBetWorkingStatus() {
    for (const [betType, bet] of this.bets.entries()) {
      bet.working = this._isBetWorking(betType);
    }
  }

  addWinnings(betType, amount) {
    this.bankroll += amount;
    this._updateStatistics('winnings', { betType, amount });
    
    if (amount > this.statistics.largestWin) {
      this.statistics.largestWin = amount;
    }
  }

  subtractLosses(betType, amount) {
    this.bankroll = Math.max(0, this.bankroll - amount);
    this._updateStatistics('losses', { betType, amount });
    
    if (amount > this.statistics.largestLoss) {
      this.statistics.largestLoss = amount;
    }
  }

  pressBet(betType, pressAmount = null) {
    const bet = this.bets.get(betType);
    if (!bet) {
      throw new ValidationError(ERROR_MESSAGES.BET_NOT_FOUND);
    }

    const amount = pressAmount || bet.amount;
    if (this.bankroll < amount) {
      throw new ValidationError(ERROR_MESSAGES.INSUFFICIENT_BANKROLL);
    }

    bet.amount += amount;
    this.bankroll -= amount;

    return bet.amount;
  }

  parlayBet(betType, winnings) {
    const bet = this.bets.get(betType);
    if (!bet) {
      throw new ValidationError(ERROR_MESSAGES.BET_NOT_FOUND);
    }

    bet.amount += winnings;
    this.bankroll += winnings;

    return bet.amount;
  }

  addToRollHistory(roll) {
    this.rollHistory.push({
      ...roll,
      round: this.currentRound,
      bankrollBefore: this.bankroll,
      activeBets: new Map(this.bets)
    });

    if (this.rollHistory.length > 100) {
      this.rollHistory = this.rollHistory.slice(-50);
    }

    this.statistics.totalRolls++;
  }

  _updateStatistics(action, data) {
    switch (action) {
      case 'betPlaced':
        if (!this.statistics.betTypeStats[data.betType]) {
          this.statistics.betTypeStats[data.betType] = {
            totalBets: 0,
            totalAmount: 0,
            wins: 0,
            losses: 0,
            netResult: 0
          };
        }
        this.statistics.betTypeStats[data.betType].totalBets++;
        this.statistics.betTypeStats[data.betType].totalAmount += data.amount;
        break;

      case 'winnings':
        this.statistics.totalWinnings += data.amount;
        if (this.statistics.betTypeStats[data.betType]) {
          this.statistics.betTypeStats[data.betType].wins++;
          this.statistics.betTypeStats[data.betType].netResult += data.amount;
        }
        break;

      case 'losses':
        this.statistics.totalLosses += data.amount;
        if (this.statistics.betTypeStats[data.betType]) {
          this.statistics.betTypeStats[data.betType].losses++;
          this.statistics.betTypeStats[data.betType].netResult -= data.amount;
        }
        break;
    }

    if (this.bankroll > this.statistics.highestBankroll) {
      this.statistics.highestBankroll = this.bankroll;
    }
    if (this.bankroll < this.statistics.lowestBankroll) {
      this.statistics.lowestBankroll = this.bankroll;
    }

    const totalBetAmount = Array.from(this.bets.values())
      .reduce((sum, bet) => sum + bet.amount, 0);
    
    if (this.statistics.totalRolls > 0) {
      this.statistics.averageBetSize = 
        (this.statistics.averageBetSize * (this.statistics.totalRolls - 1) + totalBetAmount) / 
        this.statistics.totalRolls;
    }
  }

  getActiveBets() {
    return new Map(
      Array.from(this.bets.entries()).filter(([, bet]) => bet.working)
    );
  }

  getAllBets() {
    return new Map(this.bets);
  }

  getTotalBetAmount() {
    return Array.from(this.bets.values())
      .reduce((sum, bet) => sum + bet.amount, 0);
  }

  canPlaceBet(betType, amount) {
    try {
      if (this.bankroll < amount) return false;
      return true;
    } catch {
      return false;
    }
  }

  isGameOver() {
    return this.bankroll <= 0 && this.bets.size === 0;
  }

  getNetResult() {
    return this.bankroll - STARTING_BANKROLL + this.getTotalBetAmount();
  }

  getGameDuration() {
    return Date.now() - this.gameStartTime.getTime();
  }

  setPlayerOption(option, value) {
    if (!(option in this.playerOptions)) {
      throw new ValidationError(`Invalid player option: ${option}`);
    }

    this.playerOptions[option] = value;
  }

  getPlayerOptions() {
    return { ...this.playerOptions };
  }

  clearAllBets() {
    const removableBets = [];
    
    for (const [betType, bet] of this.bets.entries()) {
      if (this._canRemoveBet(betType)) {
        removableBets.push(betType);
        this.bankroll += bet.amount;
      }
    }

    for (const betType of removableBets) {
      this.bets.delete(betType);
    }

    return removableBets;
  }

  /**
   * Get comprehensive game statistics
   * @returns {GameStatistics} Complete statistics including win rates, ROI, and performance metrics
   */
  getStatistics() {
    const duration = this.getGameDuration();
    this.statistics.timePlayed = duration;

    return {
      ...this.statistics,
      netResult: this.getNetResult(),
      winPercentage: this._calculateWinPercentage(),
      roi: this._calculateROI(),
      formattedDuration: this._formatDuration(duration)
    };
  }

  _calculateWinPercentage() {
    const { totalWinnings, totalLosses } = this.statistics;
    const totalAction = totalWinnings + totalLosses;
    return totalAction > 0 ? (totalWinnings / totalAction) * 100 : 0;
  }

  _calculateROI() {
    const invested = STARTING_BANKROLL;
    const netResult = this.getNetResult();
    return invested > 0 ? (netResult / invested) * 100 : 0;
  }

  _formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  saveState() {
    return {
      bankroll: this.bankroll,
      phase: this.phase,
      point: this.point,
      bets: Array.from(this.bets.entries()),
      rollHistory: [...this.rollHistory],
      statistics: deepClone(this.statistics),
      playerOptions: { ...this.playerOptions },
      gameStartTime: this.gameStartTime.getTime(),
      currentRound: this.currentRound
    };
  }

  loadState(savedState) {
    this.bankroll = savedState.bankroll;
    this.phase = savedState.phase;
    this.point = savedState.point;
    this.bets = new Map(savedState.bets);
    this.rollHistory = savedState.rollHistory;
    this.statistics = savedState.statistics;
    this.playerOptions = savedState.playerOptions;
    this.gameStartTime = new Date(savedState.gameStartTime);
    this.currentRound = savedState.currentRound;
    
    validateGameState(this);
  }

  reset(newBankroll = STARTING_BANKROLL) {
    this.bankroll = newBankroll;
    this.phase = GAME_PHASES.COME_OUT;
    this.point = null;
    this.bets = new Map();
    this.rollHistory = [];
    this.gameHistory = [];
    this.statistics = this._initializeStatistics();
    this.playerOptions = this._initializePlayerOptions();
    this.gameStartTime = new Date();
    this.currentRound = 1;
  }

  toString() {
    return `Bankroll: $${this.bankroll} | Phase: ${this.phase} | Point: ${this.point || 'None'} | Active Bets: ${this.bets.size}`;
  }
}