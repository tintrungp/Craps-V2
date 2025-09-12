import { 
  CHIP_VALUES, 
  MIN_BET, 
  MAX_BET, 
  BET_TYPES,
  POINT_NUMBERS,
  HARDWAY_NUMBERS
} from './constants.js';

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function isValidChipAmount(amount) {
  return typeof amount === 'number' && 
         amount > 0 && 
         amount >= MIN_BET && 
         amount <= MAX_BET &&
         Number.isInteger(amount);
}

export function canMakeChipCombination(amount, availableChips = CHIP_VALUES) {
  if (!isValidChipAmount(amount)) return false;
  
  const sortedChips = [...availableChips].sort((a, b) => b - a);
  let remaining = amount;
  
  for (const chipValue of sortedChips) {
    while (remaining >= chipValue) {
      remaining -= chipValue;
    }
  }
  
  return remaining === 0;
}

export function getOptimalChipCombination(amount, availableChips = CHIP_VALUES) {
  if (!canMakeChipCombination(amount, availableChips)) {
    throw new ValidationError(`Cannot make amount $${amount} with available chips`);
  }
  
  const combination = {};
  const sortedChips = [...availableChips].sort((a, b) => b - a);
  let remaining = amount;
  
  for (const chipValue of sortedChips) {
    const count = Math.floor(remaining / chipValue);
    if (count > 0) {
      combination[chipValue] = count;
      remaining -= count * chipValue;
    }
  }
  
  return combination;
}

export function isValidBetType(betType) {
  return Object.values(BET_TYPES).includes(betType);
}

export function isValidBetAmount(amount, bankroll) {
  return isValidChipAmount(amount) && amount <= bankroll;
}

export function validateBetPlacement(betType, amount, gameState) {
  if (!isValidBetType(betType)) {
    throw new ValidationError(`Invalid bet type: ${betType}`);
  }
  
  if (!isValidBetAmount(amount, gameState.bankroll)) {
    throw new ValidationError(`Invalid bet amount: $${amount}`);
  }
  
  if (!canMakeChipCombination(amount)) {
    throw new ValidationError(`Cannot make bet amount $${amount} with available chip denominations`);
  }
  
  if (gameState.bankroll < amount) {
    throw new ValidationError(`Insufficient funds. Bankroll: $${gameState.bankroll}, Bet: $${amount}`);
  }
  
  validateBetTypeAvailability(betType, gameState);
  
  return true;
}

export function validateBetTypeAvailability(betType, gameState) {
  const { phase, point } = gameState;
  
  switch (betType) {
    case BET_TYPES.PASS_ODDS:
    case BET_TYPES.DONT_PASS_ODDS:
      if (phase !== 'point' || !point) {
        throw new ValidationError('Odds bets only available when point is established');
      }
      if (!gameState.bets.has(betType === BET_TYPES.PASS_ODDS ? BET_TYPES.PASS : BET_TYPES.DONT_PASS)) {
        throw new ValidationError('Must have line bet before placing odds');
      }
      break;
      
    case BET_TYPES.COME_ODDS:
    case BET_TYPES.DONT_COME_ODDS:
      if (!gameState.bets.has(betType === BET_TYPES.COME_ODDS ? BET_TYPES.COME : BET_TYPES.DONT_COME)) {
        throw new ValidationError('Must have come bet before placing odds');
      }
      break;
      
    default:
      break;
  }
}

export function isValidDiceRoll(dice) {
  return Array.isArray(dice) && 
         dice.length === 2 &&
         dice.every(die => Number.isInteger(die) && die >= 1 && die <= 6);
}

export function isValidPoint(point) {
  return point === null || POINT_NUMBERS.includes(point);
}

export function isValidGamePhase(phase) {
  return phase === 'come_out' || phase === 'point';
}

export function isHardRoll(dice) {
  if (!isValidDiceRoll(dice)) return false;
  const [die1, die2] = dice;
  const total = die1 + die2;
  return die1 === die2 && HARDWAY_NUMBERS.includes(total);
}

export function isSoftRoll(dice, targetNumber) {
  if (!isValidDiceRoll(dice)) return false;
  const [die1, die2] = dice;
  const total = die1 + die2;
  return total === targetNumber && die1 !== die2;
}

export function validateGameState(gameState) {
  const requiredProperties = ['bankroll', 'phase', 'point', 'bets', 'rollHistory'];
  
  for (const prop of requiredProperties) {
    if (!(prop in gameState)) {
      throw new ValidationError(`Game state missing required property: ${prop}`);
    }
  }
  
  if (typeof gameState.bankroll !== 'number' || gameState.bankroll < 0) {
    throw new ValidationError('Invalid bankroll amount');
  }
  
  if (!isValidGamePhase(gameState.phase)) {
    throw new ValidationError(`Invalid game phase: ${gameState.phase}`);
  }
  
  if (!isValidPoint(gameState.point)) {
    throw new ValidationError(`Invalid point: ${gameState.point}`);
  }
  
  if (gameState.phase === 'point' && !gameState.point) {
    throw new ValidationError('Point phase requires a point number');
  }
  
  if (gameState.phase === 'come_out' && gameState.point) {
    throw new ValidationError('Come out phase should not have a point number');
  }
  
  if (!(gameState.bets instanceof Map)) {
    throw new ValidationError('Game state bets must be a Map');
  }
  
  if (!Array.isArray(gameState.rollHistory)) {
    throw new ValidationError('Roll history must be an array');
  }
  
  return true;
}

export function validateOddsMultiplier(multiplier, maxOdds = 10) {
  return typeof multiplier === 'number' && 
         multiplier > 0 && 
         multiplier <= maxOdds &&
         Number.isInteger(multiplier);
}

export function getMaxOddsForBet(betType, betAmount, point, maxOddsMultiplier = 10) {
  if (betType !== BET_TYPES.PASS_ODDS && betType !== BET_TYPES.DONT_PASS_ODDS) {
    return 0;
  }
  
  if (!POINT_NUMBERS.includes(point)) {
    return 0;
  }
  
  return betAmount * maxOddsMultiplier;
}

export function sanitizeInput(input) {
  if (typeof input === 'string') {
    return input.trim().toLowerCase();
  }
  return input;
}

export function parseNumber(input) {
  const num = Number(input);
  if (isNaN(num)) {
    throw new ValidationError(`Invalid number: ${input}`);
  }
  return num;
}

export function parseBetAmount(input) {
  const amount = parseNumber(input);
  if (!isValidChipAmount(amount)) {
    throw new ValidationError(`Invalid bet amount: $${amount}`);
  }
  return amount;
}