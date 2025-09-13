/**
 * Type definitions for the Craps Simulator
 * @author Craps Simulator Team
 * @version 1.0.0
 */

export interface DiceRoll {
  /** Array of two dice values [1-6, 1-6] */
  dice: [number, number];
  /** Sum of both dice */
  total: number;
  /** True if both dice show the same value */
  isHard: boolean;
  /** When the roll occurred */
  timestamp: Date;
  /** Display information for the roll */
  display: {
    /** Emoji representation of dice */
    display: string;
    /** Text representation like "3-4 (7)" */
    text: string;
  };
}

export interface Bet {
  /** Type of bet (from BET_TYPES constant) */
  type: string;
  /** Amount of the bet in dollars */
  amount: number;
  /** When the bet was placed */
  placedAt: Date;
  /** Game round when bet was placed */
  round: number;
  /** Whether the bet is currently working */
  working: boolean;
  /** Point number for come/don't come bets */
  point?: number;
  /** Whether a come bet is established */
  established?: boolean;
  /** Additional bet-specific data */
  metadata?: Record<string, any>;
}

export interface BetTypeStats {
  /** Total number of bets of this type */
  totalBets: number;
  /** Total amount bet */
  totalAmount: number;
  /** Number of wins */
  wins: number;
  /** Number of losses */
  losses: number;
  /** Net profit/loss */
  netResult: number;
}

export interface GameStatistics {
  /** Total number of rolls */
  totalRolls: number;
  /** Number of pass line wins */
  passLineWins: number;
  /** Number of pass line losses */
  passLineLosses: number;
  /** Total amount won */
  totalWinnings: number;
  /** Total amount lost */
  totalLosses: number;
  /** Largest single win amount */
  largestWin: number;
  /** Largest single loss amount */
  largestLoss: number;
  /** Number of complete rounds */
  roundsPlayed: number;
  /** Average bet size across all bets */
  averageBetSize: number;
  /** Time played in milliseconds */
  timePlayed: number;
  /** Highest bankroll reached */
  highestBankroll: number;
  /** Lowest bankroll reached */
  lowestBankroll: number;
  /** Statistics by bet type */
  betTypeStats: Record<string, BetTypeStats>;
  /** Net result (profit/loss) */
  netResult?: number;
  /** Win percentage */
  winPercentage?: number;
  /** Return on investment percentage */
  roi?: number;
  /** Formatted duration string */
  formattedDuration?: string;
}

export interface PlayerOptions {
  /** Whether place bets work on come-out roll */
  workingBets: boolean;
  /** Automatically press winning bets */
  pressWinnings: boolean;
  /** Let winnings ride automatically */
  parlayMode: boolean;
  /** Automatically take maximum odds */
  autoOdds: boolean;
  /** Maximum odds multiplier (1-10) */
  maxOddsMultiplier: number;
}

export interface ChipDenomination {
  /** Dollar value of the chip */
  value: number;
  /** Color name for display */
  color: string;
  /** Emoji symbol for the chip */
  symbol: string;
}

export interface ChipCombination {
  /** Map of chip values to counts */
  chips: Array<{
    value: number;
    count: number;
    color: string;
    symbol: string;
    display: string;
  }>;
  /** Total value of the combination */
  total: number;
  /** Human-readable display string */
  display: string;
}

export interface PayoutOdds {
  /** Winning odds numerator */
  win: number;
  /** Winning odds denominator */
  lose: number;
  /** Commission percentage (for buy/lay bets) */
  commission?: number;
  /** Special payout conditions */
  special?: Record<number, { win: number; lose: number }>;
}

export type BetResult = 'win' | 'lose' | 'push' | 'none';

export interface BetResolution {
  /** Result of the bet */
  result: BetResult;
  /** Amount to be paid out (0 if no payout) */
  payout: number;
  /** Human-readable reason for the result */
  reason?: string;
}

export type GamePhaseType = 'come_out' | 'point';

export interface GamePhase {
  /** Current game phase */
  phase: GamePhaseType;
  /** Current point number (null if come-out) */
  point: number | null;
}

export type RollOutcomeType = 'natural' | 'craps' | 'point' | 'seven_out' | 'point_made' | 'no_decision';

export interface RollOutcome {
  /** Type of outcome */
  type: RollOutcomeType;
  /** Human-readable description */
  message: string;
  /** Whether this outcome resolves bets */
  resolvesBets: boolean;
}

export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Reason for validation failure */
  reason?: string;
  /** Detailed test results */
  tests?: Record<string, any>;
}

export interface RandomnessTest {
  /** Whether test passed */
  valid: boolean;
  /** Test-specific data */
  [key: string]: any;
}

export interface RandomnessValidation extends ValidationResult {
  /** Detailed test results */
  tests: {
    /** Chi-square test results */
    chiSquare: RandomnessTest;
    /** Entropy test results */
    entropy: RandomnessTest;
    /** Streak analysis results */
    streaks: RandomnessTest;
  };
  /** Recommendation based on tests */
  recommendation: string;
}

export interface DiceFrequency {
  /** Actual frequency */
  actual: number;
  /** Expected frequency */
  expected: number;
  /** Deviation from expected */
  deviation: number;
  /** Count of occurrences */
  count: number;
}

export interface DiceStatistics {
  /** Total number of rolls */
  totalRolls: number;
  /** Count of each total (2-12) */
  rollCounts: Record<number, number>;
  /** Count of hardway rolls */
  hardwayCount: Record<number, number>;
  /** Recent roll sequence */
  sequences: number[];
  /** Frequency analysis */
  frequencies: Record<number, DiceFrequency>;
  /** Streak analysis */
  streaks: {
    maxStreak: number;
    streaks: Record<number, number>;
  };
  /** Entropy measure */
  entropy: number;
}

export interface GameStateSnapshot {
  /** Current bankroll */
  bankroll: number;
  /** Game phase */
  phase: GamePhaseType;
  /** Current point */
  point: number | null;
  /** Serialized bets map */
  bets: Array<[string, Bet]>;
  /** Roll history */
  rollHistory: DiceRoll[];
  /** Game statistics */
  statistics: GameStatistics;
  /** Player options */
  playerOptions: PlayerOptions;
  /** Start time timestamp */
  gameStartTime: number;
  /** Current round number */
  currentRound: number;
}

export interface BetPlacementResult {
  /** Whether bet was placed successfully */
  success: boolean;
  /** Error message if unsuccessful */
  error?: string;
  /** The placed bet object */
  bet?: Bet;
  /** Bankroll after bet placement */
  newBankroll: number;
}

export interface RollResult {
  /** The dice roll information */
  roll: DiceRoll;
  /** The game outcome */
  outcome: RollOutcome;
  /** Results for each affected bet */
  resolutions: BetResolution[];
  /** Total net payout for the player */
  netPayout: number;
  /** New game phase after roll */
  newPhase: GamePhase;
}

// Constants types
export interface ChipDenominations {
  WHITE: ChipDenomination;
  RED: ChipDenomination;
  GREEN: ChipDenomination;
  BLACK: ChipDenomination;
  PURPLE: ChipDenomination;
}

export interface BetTypes {
  [key: string]: string;
}

export interface PayoutOddsMap {
  [betType: string]: PayoutOdds | Record<number, PayoutOdds>;
}

// Error types
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Utility types
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;