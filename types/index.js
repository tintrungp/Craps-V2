/**
 * @fileoverview Type definitions for the Craps Simulator
 * @author Craps Simulator Team
 * @version 1.0.0
 */

/**
 * @typedef {Object} DiceRoll
 * @property {number[]} dice - Array of two dice values [1-6, 1-6]
 * @property {number} total - Sum of both dice
 * @property {boolean} isHard - True if both dice show the same value
 * @property {Date} timestamp - When the roll occurred
 * @property {Object} display - Display information for the roll
 * @property {string} display.display - Emoji representation of dice
 * @property {string} display.text - Text representation like "3-4 (7)"
 */

/**
 * @typedef {Object} Bet
 * @property {string} type - Type of bet (from BET_TYPES constant)
 * @property {number} amount - Amount of the bet in dollars
 * @property {Date} placedAt - When the bet was placed
 * @property {number} round - Game round when bet was placed
 * @property {boolean} working - Whether the bet is currently working
 * @property {number} [point] - Point number for come/don't come bets
 * @property {boolean} [established] - Whether a come bet is established
 * @property {Object} [metadata] - Additional bet-specific data
 */

/**
 * @typedef {Object} GameStatistics
 * @property {number} totalRolls - Total number of rolls
 * @property {number} passLineWins - Number of pass line wins
 * @property {number} passLineLosses - Number of pass line losses
 * @property {number} totalWinnings - Total amount won
 * @property {number} totalLosses - Total amount lost
 * @property {number} largestWin - Largest single win amount
 * @property {number} largestLoss - Largest single loss amount
 * @property {number} roundsPlayed - Number of complete rounds
 * @property {number} averageBetSize - Average bet size across all bets
 * @property {number} timePlayed - Time played in milliseconds
 * @property {number} highestBankroll - Highest bankroll reached
 * @property {number} lowestBankroll - Lowest bankroll reached
 * @property {Object} betTypeStats - Statistics by bet type
 */

/**
 * @typedef {Object} BetTypeStats
 * @property {number} totalBets - Total number of bets of this type
 * @property {number} totalAmount - Total amount bet
 * @property {number} wins - Number of wins
 * @property {number} losses - Number of losses
 * @property {number} netResult - Net profit/loss
 */

/**
 * @typedef {Object} PlayerOptions
 * @property {boolean} workingBets - Whether place bets work on come-out roll
 * @property {boolean} pressWinnings - Automatically press winning bets
 * @property {boolean} parlayMode - Let winnings ride automatically
 * @property {boolean} autoOdds - Automatically take maximum odds
 * @property {number} maxOddsMultiplier - Maximum odds multiplier (1-10)
 */

/**
 * @typedef {Object} ChipDenomination
 * @property {number} value - Dollar value of the chip
 * @property {string} color - Color name for display
 * @property {string} symbol - Emoji symbol for the chip
 */

/**
 * @typedef {Object} ChipCombination
 * @property {Object.<number, number>} chips - Map of chip values to counts
 * @property {number} total - Total value of the combination
 * @property {string} display - Human-readable display string
 */

/**
 * @typedef {Object} PayoutOdds
 * @property {number} win - Winning odds numerator
 * @property {number} lose - Winning odds denominator
 * @property {number} [commission] - Commission percentage (for buy/lay bets)
 * @property {Object} [special] - Special payout conditions
 */

/**
 * @typedef {Object} BetResolution
 * @property {'win'|'lose'|'push'|'none'} result - Result of the bet
 * @property {number} payout - Amount to be paid out (0 if no payout)
 * @property {string} [reason] - Human-readable reason for the result
 */

/**
 * @typedef {Object} GamePhase
 * @property {'come_out'|'point'} phase - Current game phase
 * @property {number|null} point - Current point number (null if come-out)
 */

/**
 * @typedef {Object} RollOutcome
 * @property {'natural'|'craps'|'point'|'seven_out'|'point_made'|'no_decision'} type
 * @property {string} message - Human-readable description
 * @property {boolean} resolvesBets - Whether this outcome resolves bets
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {string} [reason] - Reason for validation failure
 * @property {Object} [tests] - Detailed test results
 */

/**
 * @typedef {Object} RandomnessValidation
 * @property {boolean} valid - Whether randomness tests passed
 * @property {Object} tests - Detailed test results
 * @property {Object} tests.chiSquare - Chi-square test results
 * @property {Object} tests.entropy - Entropy test results
 * @property {Object} tests.streaks - Streak analysis results
 * @property {string} recommendation - Recommendation based on tests
 */

/**
 * @typedef {Object} DiceStatistics
 * @property {number} totalRolls - Total number of rolls
 * @property {Object.<number, number>} rollCounts - Count of each total (2-12)
 * @property {Object.<number, number>} hardwayCount - Count of hardway rolls
 * @property {number[]} sequences - Recent roll sequence
 * @property {Object} frequencies - Frequency analysis
 * @property {Object} streaks - Streak analysis
 * @property {number} entropy - Entropy measure
 */

/**
 * @typedef {Object} GameStateSnapshot
 * @property {number} bankroll - Current bankroll
 * @property {string} phase - Game phase
 * @property {number|null} point - Current point
 * @property {Array.<[string, Bet]>} bets - Serialized bets map
 * @property {DiceRoll[]} rollHistory - Roll history
 * @property {GameStatistics} statistics - Game statistics
 * @property {PlayerOptions} playerOptions - Player options
 * @property {number} gameStartTime - Start time timestamp
 * @property {number} currentRound - Current round number
 */

/**
 * @typedef {Object} BetPlacementResult
 * @property {boolean} success - Whether bet was placed successfully
 * @property {string} [error] - Error message if unsuccessful
 * @property {Bet} [bet] - The placed bet object
 * @property {number} newBankroll - Bankroll after bet placement
 */

/**
 * @typedef {Object} RollResult
 * @property {DiceRoll} roll - The dice roll information
 * @property {RollOutcome} outcome - The game outcome
 * @property {BetResolution[]} resolutions - Results for each affected bet
 * @property {number} netPayout - Total net payout for the player
 * @property {GamePhase} newPhase - New game phase after roll
 */

export {};