import crypto from 'crypto';
import { isValidDiceRoll } from './utils/validators.js';
import { formatDiceRoll } from './utils/helpers.js';

export class Dice {
  constructor() {
    this.rollHistory = [];
    this.statistics = {
      totalRolls: 0,
      rollCounts: {
        2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0,
        8: 0, 9: 0, 10: 0, 11: 0, 12: 0
      },
      hardwayCount: { 4: 0, 6: 0, 8: 0, 10: 0 },
      sequences: []
    };
  }

  roll() {
    const die1 = this._generateSecureRandomInt(1, 6);
    const die2 = this._generateSecureRandomInt(1, 6);
    const dice = [die1, die2];
    
    if (!isValidDiceRoll(dice)) {
      throw new Error('Generated invalid dice roll');
    }
    
    const rollResult = this._createRollResult(dice);
    this._recordRoll(rollResult);
    
    return rollResult;
  }

  _generateSecureRandomInt(min, max) {
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const maxValue = Math.pow(256, bytesNeeded);
    const threshold = Math.floor(maxValue / range) * range;
    
    let randomValue;
    do {
      const randomBytes = crypto.randomBytes(bytesNeeded);
      randomValue = randomBytes.readUIntBE(0, bytesNeeded);
    } while (randomValue >= threshold);
    
    return min + (randomValue % range);
  }

  _createRollResult(dice) {
    const [die1, die2] = dice;
    const total = die1 + die2;
    const isHard = die1 === die2;
    const timestamp = new Date();
    
    return {
      dice: [die1, die2],
      total,
      isHard,
      timestamp,
      display: formatDiceRoll(dice)
    };
  }

  _recordRoll(rollResult) {
    this.rollHistory.push(rollResult);
    this._updateStatistics(rollResult);
    
    if (this.rollHistory.length > 1000) {
      this.rollHistory = this.rollHistory.slice(-500);
    }
  }

  _updateStatistics(rollResult) {
    const { total, isHard } = rollResult;
    
    this.statistics.totalRolls++;
    this.statistics.rollCounts[total]++;
    
    if (isHard && [4, 6, 8, 10].includes(total)) {
      this.statistics.hardwayCount[total]++;
    }
    
    this.statistics.sequences.push(total);
    if (this.statistics.sequences.length > 50) {
      this.statistics.sequences = this.statistics.sequences.slice(-25);
    }
  }

  getLastRoll() {
    return this.rollHistory[this.rollHistory.length - 1] || null;
  }

  getLastNRolls(n) {
    return this.rollHistory.slice(-n);
  }

  getRollHistory() {
    return [...this.rollHistory];
  }

  getStatistics() {
    return {
      ...this.statistics,
      frequencies: this._calculateFrequencies(),
      streaks: this._calculateStreaks(),
      entropy: this._calculateEntropy()
    };
  }

  _calculateFrequencies() {
    const { totalRolls, rollCounts } = this.statistics;
    if (totalRolls === 0) return {};
    
    const frequencies = {};
    const expectedFrequencies = {
      2: 1/36, 3: 2/36, 4: 3/36, 5: 4/36, 6: 5/36, 7: 6/36,
      8: 5/36, 9: 4/36, 10: 3/36, 11: 2/36, 12: 1/36
    };
    
    for (const [total, count] of Object.entries(rollCounts)) {
      const actualFreq = count / totalRolls;
      const expectedFreq = expectedFrequencies[total];
      
      frequencies[total] = {
        actual: actualFreq,
        expected: expectedFreq,
        deviation: actualFreq - expectedFreq,
        count
      };
    }
    
    return frequencies;
  }

  _calculateStreaks() {
    const sequences = this.statistics.sequences;
    if (sequences.length < 2) return {};
    
    let currentStreak = 1;
    let maxStreak = 1;
    let streakValue = sequences[0];
    const streaks = {};
    
    for (let i = 1; i < sequences.length; i++) {
      if (sequences[i] === sequences[i - 1]) {
        currentStreak++;
      } else {
        if (currentStreak > 1) {
          streaks[streakValue] = Math.max(streaks[streakValue] || 0, currentStreak);
        }
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
        streakValue = sequences[i];
      }
    }
    
    if (currentStreak > 1) {
      streaks[streakValue] = Math.max(streaks[streakValue] || 0, currentStreak);
    }
    
    return { maxStreak, streaks };
  }

  _calculateEntropy() {
    const { rollCounts, totalRolls } = this.statistics;
    if (totalRolls === 0) return 0;
    
    let entropy = 0;
    for (const count of Object.values(rollCounts)) {
      if (count > 0) {
        const probability = count / totalRolls;
        entropy -= probability * Math.log2(probability);
      }
    }
    
    return entropy;
  }

  validateRandomness(minimumRolls = 100) {
    const stats = this.getStatistics();
    
    if (stats.totalRolls < minimumRolls) {
      return {
        valid: false,
        reason: `Insufficient rolls for validation (${stats.totalRolls} < ${minimumRolls})`
      };
    }
    
    const chiSquareResult = this._chiSquareTest(stats.frequencies);
    const entropyResult = this._validateEntropy(stats.entropy);
    const streakResult = this._validateStreaks(stats.streaks);
    
    const valid = chiSquareResult.valid && entropyResult.valid && streakResult.valid;
    
    return {
      valid,
      tests: {
        chiSquare: chiSquareResult,
        entropy: entropyResult,
        streaks: streakResult
      },
      recommendation: valid ? 'Dice appear random' : 'Potential bias detected'
    };
  }

  _chiSquareTest(frequencies) {
    let chiSquare = 0;
    const { totalRolls } = this.statistics;
    
    for (const [total, freq] of Object.entries(frequencies)) {
      const observed = freq.count;
      const expected = freq.expected * totalRolls;
      
      if (expected > 0) {
        chiSquare += Math.pow(observed - expected, 2) / expected;
      }
    }
    
    const criticalValue = 19.675;
    const valid = chiSquare <= criticalValue;
    
    return {
      valid,
      chiSquare,
      criticalValue,
      pValue: this._calculatePValue(chiSquare, 10)
    };
  }

  _calculatePValue(chiSquare, degreesOfFreedom) {
    return Math.exp(-chiSquare / 2) * Math.pow(chiSquare / 2, degreesOfFreedom / 2) / 
           this._gamma(degreesOfFreedom / 2 + 1);
  }

  _gamma(n) {
    if (n === 1) return 1;
    if (n === 0.5) return Math.sqrt(Math.PI);
    return (n - 1) * this._gamma(n - 1);
  }

  _validateEntropy(entropy) {
    const expectedEntropy = 3.274;
    const tolerance = 0.5;
    const valid = Math.abs(entropy - expectedEntropy) <= tolerance;
    
    return {
      valid,
      entropy,
      expected: expectedEntropy,
      deviation: entropy - expectedEntropy
    };
  }

  _validateStreaks(streakData) {
    const maxAllowableStreak = Math.max(8, Math.log2(this.statistics.totalRolls));
    const valid = streakData.maxStreak <= maxAllowableStreak;
    
    return {
      valid,
      maxStreak: streakData.maxStreak,
      maxAllowable: maxAllowableStreak,
      streaks: streakData.streaks
    };
  }

  clearHistory() {
    this.rollHistory = [];
    this.statistics = {
      totalRolls: 0,
      rollCounts: {
        2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0,
        8: 0, 9: 0, 10: 0, 11: 0, 12: 0
      },
      hardwayCount: { 4: 0, 6: 0, 8: 0, 10: 0 },
      sequences: []
    };
  }

  simulateRolls(count) {
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(this.roll());
    }
    return results;
  }

  toString() {
    const lastRoll = this.getLastRoll();
    if (!lastRoll) return 'No rolls yet';
    
    return `Last roll: ${lastRoll.display.text} | Total rolls: ${this.statistics.totalRolls}`;
  }
}