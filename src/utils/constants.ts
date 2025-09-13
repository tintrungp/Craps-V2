import type { ChipDenominations, BetTypes, PayoutOddsMap } from '../types/index.js';

export const GAME_PHASES = {
  COME_OUT: 'come_out',
  POINT: 'point'
};

export const CHIP_DENOMINATIONS: ChipDenominations = {
  WHITE: { value: 1, color: 'white', symbol: '⚪' },
  RED: { value: 5, color: 'red', symbol: '🔴' },
  GREEN: { value: 10, color: 'green', symbol: '🟢' },
  BLACK: { value: 25, color: 'black', symbol: '⚫' },
  PURPLE: { value: 100, color: 'magenta', symbol: '🟣' }
};

export const CHIP_VALUES = [1, 5, 10, 25, 100];

export const STARTING_BANKROLL = 10000;

export const DICE_FACES = [1, 2, 3, 4, 5, 6];
export const DICE_COUNT = 2;

export const POINT_NUMBERS = [4, 5, 6, 8, 9, 10];
export const FIELD_NUMBERS = [2, 3, 4, 9, 10, 11, 12];
export const HARDWAY_NUMBERS = [4, 6, 8, 10];

export const BET_TYPES: BetTypes = {
  PASS: 'pass',
  DONT_PASS: 'dont_pass',
  PASS_ODDS: 'pass_odds',
  DONT_PASS_ODDS: 'dont_pass_odds',
  COME: 'come',
  DONT_COME: 'dont_come',
  COME_ODDS: 'come_odds',
  DONT_COME_ODDS: 'dont_come_odds',
  PLACE_4: 'place_4',
  PLACE_5: 'place_5',
  PLACE_6: 'place_6',
  PLACE_8: 'place_8',
  PLACE_9: 'place_9',
  PLACE_10: 'place_10',
  BUY_4: 'buy_4',
  BUY_5: 'buy_5',
  BUY_6: 'buy_6',
  BUY_8: 'buy_8',
  BUY_9: 'buy_9',
  BUY_10: 'buy_10',
  LAY_4: 'lay_4',
  LAY_5: 'lay_5',
  LAY_6: 'lay_6',
  LAY_8: 'lay_8',
  LAY_9: 'lay_9',
  LAY_10: 'lay_10',
  FIELD: 'field',
  HARD_4: 'hard_4',
  HARD_6: 'hard_6',
  HARD_8: 'hard_8',
  HARD_10: 'hard_10',
  ANY_SEVEN: 'any_seven',
  ANY_CRAPS: 'any_craps',
  ACE_DEUCE: 'ace_deuce',
  ACES: 'aces',
  BOXCARS: 'boxcars',
  ELEVEN: 'eleven',
  HORN: 'horn',
  WORLD: 'world',
  HOP_BET: 'hop_bet'
};

export const PAYOUT_ODDS: PayoutOddsMap = {
  [BET_TYPES.PASS]: { win: 1, lose: 1 },
  [BET_TYPES.DONT_PASS]: { win: 1, lose: 1 },
  
  [BET_TYPES.PASS_ODDS]: {
    4: { win: 2, lose: 1 },
    5: { win: 3, lose: 2 },
    6: { win: 6, lose: 5 },
    8: { win: 6, lose: 5 },
    9: { win: 3, lose: 2 },
    10: { win: 2, lose: 1 }
  },
  
  [BET_TYPES.DONT_PASS_ODDS]: {
    4: { win: 1, lose: 2 },
    5: { win: 2, lose: 3 },
    6: { win: 5, lose: 6 },
    8: { win: 5, lose: 6 },
    9: { win: 2, lose: 3 },
    10: { win: 1, lose: 2 }
  },
  
  [BET_TYPES.PLACE_4]: { win: 9, lose: 5 },
  [BET_TYPES.PLACE_5]: { win: 7, lose: 5 },
  [BET_TYPES.PLACE_6]: { win: 7, lose: 6 },
  [BET_TYPES.PLACE_8]: { win: 7, lose: 6 },
  [BET_TYPES.PLACE_9]: { win: 7, lose: 5 },
  [BET_TYPES.PLACE_10]: { win: 9, lose: 5 },
  
  [BET_TYPES.BUY_4]: { win: 2, lose: 1, commission: 0.05 },
  [BET_TYPES.BUY_5]: { win: 3, lose: 2, commission: 0.05 },
  [BET_TYPES.BUY_6]: { win: 6, lose: 5, commission: 0.05 },
  [BET_TYPES.BUY_8]: { win: 6, lose: 5, commission: 0.05 },
  [BET_TYPES.BUY_9]: { win: 3, lose: 2, commission: 0.05 },
  [BET_TYPES.BUY_10]: { win: 2, lose: 1, commission: 0.05 },
  
  [BET_TYPES.LAY_4]: { win: 1, lose: 2, commission: 0.05 },
  [BET_TYPES.LAY_5]: { win: 2, lose: 3, commission: 0.05 },
  [BET_TYPES.LAY_6]: { win: 5, lose: 6, commission: 0.05 },
  [BET_TYPES.LAY_8]: { win: 5, lose: 6, commission: 0.05 },
  [BET_TYPES.LAY_9]: { win: 2, lose: 3, commission: 0.05 },
  [BET_TYPES.LAY_10]: { win: 1, lose: 2, commission: 0.05 },
  
  [BET_TYPES.FIELD]: { 
    win: 1, 
    lose: 1,
    special: {
      2: { win: 2, lose: 1 },
      12: { win: 2, lose: 1 }
    }
  },
  
  [BET_TYPES.HARD_4]: { win: 7, lose: 1 },
  [BET_TYPES.HARD_6]: { win: 9, lose: 1 },
  [BET_TYPES.HARD_8]: { win: 9, lose: 1 },
  [BET_TYPES.HARD_10]: { win: 7, lose: 1 },
  
  [BET_TYPES.ANY_SEVEN]: { win: 4, lose: 1 },
  [BET_TYPES.ANY_CRAPS]: { win: 7, lose: 1 },
  [BET_TYPES.ACE_DEUCE]: { win: 15, lose: 1 },
  [BET_TYPES.ACES]: { win: 30, lose: 1 },
  [BET_TYPES.BOXCARS]: { win: 30, lose: 1 },
  [BET_TYPES.ELEVEN]: { win: 15, lose: 1 },
  
  [BET_TYPES.HORN]: {
    2: { win: 30, lose: 3 },
    3: { win: 15, lose: 3 },
    11: { win: 15, lose: 3 },
    12: { win: 30, lose: 3 }
  }
};

export const ODDS_MULTIPLIERS = {
  4: 3,
  5: 4, 
  6: 5,
  8: 5,
  9: 4,
  10: 3
};

export const MIN_BET = 1;
export const MAX_BET = 5000;

export const ROLL_OUTCOMES = {
  NATURAL: 'natural',        // 7 or 11 on come out
  CRAPS: 'craps',           // 2, 3, or 12 on come out
  POINT: 'point',           // 4, 5, 6, 8, 9, 10 on come out
  SEVEN_OUT: 'seven_out',   // 7 during point phase
  POINT_MADE: 'point_made', // Point number rolled during point phase
  NO_DECISION: 'no_decision' // Any other number during point phase
};

export const GAME_MESSAGES = {
  NEW_GAME: 'New game started! Place your bets.',
  COME_OUT_ROLL: 'Come out roll!',
  POINT_ESTABLISHED: (point) => `Point is ${point}. Shooter must roll ${point} or 7.`,
  NATURAL_WINNER: (roll) => `Natural ${roll}! Pass line wins!`,
  CRAPS_LOSER: (roll) => `Craps ${roll}! Pass line loses!`,
  POINT_MADE: (point) => `${point} - Point made! Pass line wins!`,
  SEVEN_OUT: 'Seven out! Pass line loses.',
  INSUFFICIENT_FUNDS: 'Insufficient funds for this bet.',
  INVALID_BET: 'Invalid bet amount or type.',
  BET_PLACED: (type, amount) => `Placed ${type} bet: $${amount}`,
  BET_REMOVED: (type, amount) => `Removed ${type} bet: $${amount}`,
  PAYOUT: (amount) => `Payout: $${amount}`,
  GAME_OVER: 'Game over! No more funds available.'
};

export const ERROR_MESSAGES = {
  INVALID_DICE_ROLL: 'Invalid dice roll result',
  INSUFFICIENT_BANKROLL: 'Insufficient bankroll for bet',
  BET_NOT_FOUND: 'Bet not found',
  INVALID_BET_TYPE: 'Invalid bet type',
  INVALID_BET_AMOUNT: 'Invalid bet amount',
  GAME_NOT_INITIALIZED: 'Game not properly initialized',
  INVALID_GAME_STATE: 'Invalid game state',
  BETTING_CLOSED: 'Betting is closed for this roll'
};

export const CLI_COLORS = {
  CHIP_WHITE: 'white',
  CHIP_RED: 'red', 
  CHIP_GREEN: 'green',
  CHIP_BLACK: 'black',
  CHIP_PURPLE: 'magenta',
  WINNING_BET: 'green',
  LOSING_BET: 'red',
  PUSH_BET: 'yellow',
  TABLE_GREEN: 'green',
  DICE: 'white',
  POINT_MARKER: 'yellow',
  BANKROLL: 'cyan',
  PAYOUT: 'green',
  ERROR: 'red',
  SUCCESS: 'green',
  INFO: 'blue',
  WARNING: 'yellow'
};