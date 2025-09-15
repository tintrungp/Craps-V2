import { CHIP_DENOMINATIONS, CLI_COLORS } from './constants.js';

export function formatCurrency(amount) {
  return `$${amount.toLocaleString()}`;
}

export function formatDiceRoll(dice) {
  if (!Array.isArray(dice) || dice.length !== 2) {
    throw new Error('Dice must be an array of 2 numbers');
  }
  
  const [die1, die2] = dice;
  const total = die1 + die2;
  const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  
  return {
    dice: [die1, die2],
    total,
    display: `${diceEmojis[die1 - 1]} ${diceEmojis[die2 - 1]}`,
    text: `${die1}-${die2} (${total})`
  };
}

export function getChipDisplay(amount) {
  const chips = [];
  let remaining = amount;
  
  const denominations = Object.values(CHIP_DENOMINATIONS).sort((a, b) => b.value - a.value);
  
  for (const chip of denominations) {
    const count = Math.floor(remaining / chip.value);
    if (count > 0) {
      chips.push({
        value: chip.value,
        count,
        color: chip.color,
        symbol: chip.symbol,
        display: `${chip.symbol} ${count}x$${chip.value}`
      });
      remaining -= count * chip.value;
    }
  }
  
  return {
    chips,
    total: amount,
    display: chips.map(c => c.display).join(' ')
  };
}

export function isNaturalRoll(dice) {
  const total = dice[0] + dice[1];
  return total === 7 || total === 11;
}

export function isCrapsRoll(dice) {
  const total = dice[0] + dice[1];
  return total === 2 || total === 3 || total === 12;
}

export function isPointNumber(total) {
  return [4, 5, 6, 8, 9, 10].includes(total);
}

export function getHardwayName(total) {
  const hardwayNames = {
    4: 'Hard Four',
    6: 'Hard Six', 
    8: 'Hard Eight',
    10: 'Hard Ten'
  };
  return hardwayNames[total] || null;
}

export function getFieldMultiplier(total) {
  if (total === 2 || total === 12) return 2;
  if ([3, 4, 9, 10, 11].includes(total)) return 1;
  return 0; // Not a field number
}

export function calculateTotalBetAmount(bets) {
  let total = 0;
  for (const bet of bets.values()) {
    total += bet.amount;
  }
  return total;
}

export function groupBetsByType(bets) {
  const groups = {
    line: [],      // Pass, Don't Pass, Come, Don't Come
    odds: [],      // All odds bets
    place: [],     // Place and buy bets
    field: [],     // Field bets
    hardway: [],   // Hardway bets  
    prop: []       // Proposition bets
  };
  
  for (const [type, bet] of bets.entries()) {
    if (type.includes('pass') || type.includes('come')) {
      if (type.includes('odds')) {
        groups.odds.push(bet);
      } else {
        groups.line.push(bet);
      }
    } else if (type.includes('place') || type.includes('buy')) {
      groups.place.push(bet);
    } else if (type === 'field') {
      groups.field.push(bet);
    } else if (type.includes('hard')) {
      groups.hardway.push(bet);
    } else {
      groups.prop.push(bet);
    }
  }
  
  return groups;
}

export function getPointMarkerDisplay(point) {
  if (!point) return '';
  
  const markers = {
    4: '◯────4────◯',
    5: '◯─────5─────◯', 
    6: '◯──────6──────◯',
    8: '◯──────8──────◯',
    9: '◯─────9─────◯',
    10: '◯────10────◯'
  };
  
  return markers[point] || `Point: ${point}`;
}

export function generateDiceAnimation() {
  const frames = [
    '🎲 🎲',
    '⚀ ⚀',
    '⚁ ⚁', 
    '⚂ ⚂',
    '⚃ ⚃',
    '⚄ ⚄',
    '⚅ ⚅'
  ];
  
  return frames;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function roundToNearestDollar(amount) {
  return Math.round(amount);
}

export function calculateWinPercentage(wins, losses) {
  const total = wins + losses;
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}

export function formatGameTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

export function getBetTypeDisplayName(betType) {
  const displayNames = {
    pass: 'Pass Line',
    dont_pass: 'Don\'t Pass',
    pass_odds: 'Pass Odds',
    dont_pass_odds: 'Don\'t Pass Odds',
    come: 'Come',
    dont_come: 'Don\'t Come',
    come_odds: 'Come Odds',
    dont_come_odds: 'Don\'t Come Odds',
    place_4: 'Place 4',
    place_5: 'Place 5', 
    place_6: 'Place 6',
    place_8: 'Place 8',
    place_9: 'Place 9',
    place_10: 'Place 10',
    buy_4: 'Buy 4',
    buy_5: 'Buy 5',
    buy_6: 'Buy 6', 
    buy_8: 'Buy 8',
    buy_9: 'Buy 9',
    buy_10: 'Buy 10',
    field: 'Field',
    hard_4: 'Hard 4',
    hard_6: 'Hard 6',
    hard_8: 'Hard 8',
    hard_10: 'Hard 10',
    any_seven: 'Any Seven',
    any_craps: 'Any Craps',
    ace_deuce: 'Ace-Deuce (3)',
    aces: 'Aces (2)',
    boxcars: 'Boxcars (12)',
    eleven: 'Eleven',
    horn: 'Horn',
    world: 'World'
  };
  
  return displayNames[betType] || betType;
}

export function createProgressBar(current, max, width = 20) {
  const percentage = Math.min(current / max, 1);
  const filled = Math.round(width * percentage);
  const empty = width - filled;
  
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percent = Math.round(percentage * 100);
  
  return `${bar} ${percent}%`;
}

export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Map) {
    const clonedMap = new Map();
    for (const [key, value] of obj.entries()) {
      clonedMap.set(key, deepClone(value));
    }
    return clonedMap;
  }
  
  if (obj instanceof Set) {
    const clonedSet = new Set();
    for (const value of obj.values()) {
      clonedSet.add(deepClone(value));
    }
    return clonedSet;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const clonedObj = {};
  for (const [key, value] of Object.entries(obj)) {
    clonedObj[key] = deepClone(value);
  }
  
  return clonedObj;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}