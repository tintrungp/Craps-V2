import chalk from 'chalk';
import inquirer from 'inquirer';
import Table from 'cli-table3';
import figlet from 'figlet';
import { GameState } from '../dist/gameState.js';
import { Dice } from '../dist/dice.js';
import { 
  BET_TYPES, 
  GAME_PHASES, 
  CHIP_DENOMINATIONS, 
  PAYOUT_ODDS,
  CLI_COLORS,
  GAME_MESSAGES 
} from '../dist/utils/constants.js';

export class CrapsTable {
  constructor() {
    this.gameState = new GameState();
    this.dice = new Dice();
    this.isRunning = false;
  }

  async start() {
    this.isRunning = true;
    this.displayWelcome();
    
    while (this.isRunning && !this.gameState.isGameOver()) {
      this.displayTable();
      await this.handleTurn();
    }
    
    if (this.gameState.isGameOver()) {
      this.displayGameOver();
    }
  }

  displayWelcome() {
    console.clear();
    console.clear();

    console.log(chalk.green(figlet.textSync('CRAPS', { 
      font: 'colossal',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    })));
    console.log(chalk.cyan('Welcome to the virtual craps table!\n'));
  }

  displayTable() {
    // Title
    console.log(chalk.green.bold('🎲 CRAPS TABLE 🎲\n'));
    
    // Game Status
    this.displayGameStatus();
    console.log('');
    
    // Table Layout
    this.displayTableLayout();
    console.log('');
    
    // Player Info
    this.displayPlayerInfo();
    console.log('');
    
    // Active Bets
    this.displayActiveBets();
    console.log('');
  }

  displayGameStatus() {
    const phase = this.gameState.phase === GAME_PHASES.COME_OUT ? 'COME OUT' : ' POINT  ';
    const phaseColor = this.gameState.phase === GAME_PHASES.COME_OUT ? 'yellow' : 'cyan';
    console.log(chalk.green('╔══════════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.green(`║    Game Status                   ║      Phase: ${chalk[phaseColor](phase)}              ║`));
    console.log(chalk.green('╠══════════════════════════════════════════════════════════════════════╣'));
    
    if (this.gameState.point) {
      console.log(`Point: ${chalk.yellow.bold(`[${this.gameState.point}]`)}`);
    }
    
    const lastRoll = this.dice.getLastRoll();
    if (lastRoll) {
      const diceDisplay = `${lastRoll.dice[0]} ${lastRoll.dice[1]}`;
      const totalDisplay = `(${lastRoll.total})`;
      console.log(`Last Roll: ${chalk.white.bold(diceDisplay)} ${chalk.cyan(totalDisplay)}`);
    }
  }

  displayTableLayout() {
    console.log(chalk.green('╔══════════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.green('║                            CRAPS TABLE                               ║'));
    console.log(chalk.green('╠══════════════════════════════════════════════════════════════════════╣'));
    
    // Pass Line
    const passLineBet = this.gameState.bets.get(BET_TYPES.PASS);
    const passDisplay = passLineBet ? `[$${passLineBet.amount}]` : '[   ]';
    console.log(chalk.green('║ ') + chalk.white.bold('PASS LINE') + '                                    ' + 
                chalk.cyan(passDisplay.padEnd(8)) + chalk.green(' ║'));
    
    // Don't Pass
    const dontPassBet = this.gameState.bets.get(BET_TYPES.DONT_PASS);
    const dontPassDisplay = dontPassBet ? `[$${dontPassBet.amount}]` : '[   ]';
    console.log(chalk.green('║ ') + chalk.white.bold('DON\'T PASS') + '                                ' + 
                chalk.cyan(dontPassDisplay.padEnd(8)) + chalk.green(' ║'));
    
    // Numbers Row
    console.log(chalk.green('║                                                                      ║'));
    const numbers = ['4', '5', 'SIX', '8', 'NINE', '10'];
    let numberLine = chalk.green('║ ');
    
    numbers.forEach((num, i) => {
      const actualNum = num === 'SIX' ? '6' : (num === 'NINE' ? '9' : num);
      const placeBet = this.gameState.bets.get(`place_${actualNum}`);
      const betDisplay = placeBet ? `$${placeBet.amount}` : '';
      const isPoint = this.gameState.point == actualNum;
      
      let display;
      if (isPoint) {
        display = chalk.yellow.bold(`[${num}]`);
      } else {
        display = chalk.white.bold(num);
      }
      
      if (betDisplay) {
        display += chalk.cyan(` ${betDisplay}`);
      }
      
      numberLine += display.padEnd(11);
    });
    numberLine += chalk.green(' ║');
    console.log(numberLine);
    
    // Field
    console.log(chalk.green('║                                                                      ║'));
    const fieldBet = this.gameState.bets.get(BET_TYPES.FIELD);
    const fieldDisplay = fieldBet ? `[$${fieldBet.amount}]` : '[        ]';
    console.log(chalk.green('║ ') + chalk.white.bold('FIELD: 2,3,4,9,10,11,12 (2&12 pay double)') + '        ' + 
                chalk.cyan(fieldDisplay) + chalk.green(' ║'));
    
    console.log(chalk.green('╚══════════════════════════════════════════════════════════════════════╝'));
  }

  displayPlayerInfo() {
    console.log(chalk.bold('Player Info:'));
    console.log(`Bankroll: ${chalk.cyan.bold(`$${this.gameState.bankroll}`)}`);
    console.log(`Total Bet: ${chalk.yellow(`$${this.gameState.getTotalBetAmount()}`)}`);
    console.log(`Available: ${chalk.green(`$${this.gameState.bankroll}`)}`);
  }

  displayActiveBets() {
    const bets = this.gameState.getAllBets();
    if (bets.size === 0) {
      console.log(chalk.gray('No active bets'));
      return;
    }

    console.log(chalk.bold('Active Bets:'));
    const table = new Table({
      head: ['Bet Type', 'Amount', 'Working'],
      style: { head: ['cyan'], border: ['grey'] }
    });

    for (const [type, bet] of bets) {
      const workingStatus = bet.working ? chalk.green('✓') : chalk.red('✗');
      table.push([
        this.formatBetTypeName(type),
        `$${bet.amount}`,
        workingStatus
      ]);
    }

    console.log(table.toString());
  }

  formatBetTypeName(betType) {
    return betType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async handleTurn() {
    const choices = [
      { name: '🎲 Roll Dice', value: 'roll' },
      { name: '💰 Place Bet', value: 'bet' },
      { name: '📊 View Statistics', value: 'stats' },
      { name: '⚙️  Game Options', value: 'options' },
      { name: '❌ Quit Game', value: 'quit' }
    ];

    if (this.gameState.getAllBets().size > 0) {
      choices.splice(2, 0, { name: '🚫 Remove Bet', value: 'remove' });
    }

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: choices
      }
    ]);

    switch (action) {
      case 'roll':
        await this.rollDice();
        break;
      case 'bet':
        await this.placeBet();
        break;
      case 'remove':
        await this.removeBet();
        break;
      case 'stats':
        await this.showStatistics();
        break;
      case 'options':
        await this.gameOptions();
        break;
      case 'quit':
        this.isRunning = false;
        break;
    }
  }

  async rollDice() {
    if (this.gameState.getAllBets().size === 0) {
      console.log(chalk.yellow('⚠️  No bets placed! Place a bet before rolling.'));
      await this.waitForEnter();
      return;
    }

    console.log(chalk.cyan('\n🎲 Rolling dice...'));
    await this.sleep(1000);

    const roll = this.dice.roll();
    this.gameState.addToRollHistory(roll);

    // Animated dice roll
    for (let i = 0; i < 3; i++) {
      process.stdout.write('\r🎲 Rolling... ');
      await this.sleep(200);
      process.stdout.write('🎲 Rolling... ');
      await this.sleep(200);
    }

    console.log(`\n\n🎲 ${chalk.white.bold(`${roll.dice[0]} ${roll.dice[1]}`)} ${chalk.cyan.bold(`(${roll.total})`)}`);
    
    if (roll.isHard) {
      console.log(chalk.yellow('🔥 Hard way!'));
    }

    // Process the roll based on game phase
    await this.processRoll(roll);
    await this.waitForEnter();
  }

  async processRoll(roll) {
    const { total } = roll;
    
    if (this.gameState.phase === GAME_PHASES.COME_OUT) {
      await this.processComOutRoll(total);
    } else {
      await this.processPointRoll(total);
    }
  }

  async processComOutRoll(total) {
    if (total === 7 || total === 11) {
      // Natural - Pass wins, Don't Pass loses
      console.log(chalk.green(`\n✅ Natural ${total}! Pass line wins!`));
      await this.resolveBets('natural', total);
    } else if ([2, 3, 12].includes(total)) {
      // Craps - Pass loses, Don't Pass wins (except 12 which pushes)
      console.log(chalk.red(`\n❌ Craps ${total}! Pass line loses!`));
      await this.resolveBets('craps', total);
    } else {
      // Point established
      this.gameState.establishPoint(total);
      console.log(chalk.yellow(`\n🎯 Point established: ${total}`));
      console.log(chalk.cyan(`Shooter must roll ${total} again or 7 to resolve pass line bets.`));
    }
  }

  async processPointRoll(total) {
    if (total === 7) {
      // Seven out - Pass loses, Don't Pass wins
      console.log(chalk.red('\n💥 Seven out! Pass line loses!'));
      await this.resolveBets('seven_out', total);
      this.gameState.clearPoint();
    } else if (total === this.gameState.point) {
      // Point made - Pass wins, Don't Pass loses
      console.log(chalk.green(`\n🎉 ${total} - Point made! Pass line wins!`));
      await this.resolveBets('point_made', total);
      this.gameState.clearPoint();
    } else {
      // No decision - process other bets
      console.log(chalk.gray(`\n➡️  ${total} - No decision on pass line`));
      await this.resolveBets('no_decision', total);
    }
  }

  async resolveBets(outcome, rollTotal) {
    const bets = this.gameState.getAllBets();
    let totalPayout = 0;

    for (const [betType, bet] of bets) {
      if (!bet.working) continue;

      const resolution = this.resolveBet(betType, bet, outcome, rollTotal);
      
      if (resolution.result === 'win') {
        console.log(chalk.green(`💰 ${this.formatBetTypeName(betType)} wins $${resolution.payout}!`));
        this.gameState.addWinnings(betType, resolution.payout);
        totalPayout += resolution.payout;
        this.gameState.bets.delete(betType);
      } else if (resolution.result === 'lose') {
        console.log(chalk.red(`💸 ${this.formatBetTypeName(betType)} loses $${bet.amount}`));
        this.gameState.bets.delete(betType);
      } else if (resolution.result === 'push') {
        console.log(chalk.yellow(`🤝 ${this.formatBetTypeName(betType)} pushes (returned)`));
        this.gameState.bankroll += bet.amount;
        this.gameState.bets.delete(betType);
      }
    }

    if (totalPayout > 0) {
      console.log(chalk.green.bold(`\n💵 Total payout: $${totalPayout}`));
    }
  }

  resolveBet(betType, bet, outcome, rollTotal) {
    // This is a simplified bet resolution - full implementation would be more complex
    switch (betType) {
      case BET_TYPES.PASS:
        if (outcome === 'natural') return { result: 'win', payout: bet.amount * 2 };
        if (outcome === 'craps' || outcome === 'seven_out') return { result: 'lose', payout: 0 };
        if (outcome === 'point_made') return { result: 'win', payout: bet.amount * 2 };
        return { result: 'none', payout: 0 };

      case BET_TYPES.DONT_PASS:
        if (outcome === 'natural') return { result: 'lose', payout: 0 };
        if (outcome === 'craps' && rollTotal !== 12) return { result: 'win', payout: bet.amount * 2 };
        if (outcome === 'craps' && rollTotal === 12) return { result: 'push', payout: 0 };
        if (outcome === 'seven_out') return { result: 'win', payout: bet.amount * 2 };
        if (outcome === 'point_made') return { result: 'lose', payout: 0 };
        return { result: 'none', payout: 0 };

      case BET_TYPES.FIELD:
        if ([2, 3, 4, 9, 10, 11, 12].includes(rollTotal)) {
          if (rollTotal === 2 || rollTotal === 12) {
            return { result: 'win', payout: bet.amount * 3 }; // Double payout
          } else {
            return { result: 'win', payout: bet.amount * 2 }; // Even money
          }
        } else {
          return { result: 'lose', payout: 0 };
        }

      default:
        return { result: 'none', payout: 0 };
    }
  }

  async placeBet() {
    const availableBets = [
      { name: '🟢 Pass Line', value: BET_TYPES.PASS },
      { name: '🔴 Don\'t Pass', value: BET_TYPES.DONT_PASS },
      { name: '🎯 Field (2,3,4,9,10,11,12)', value: BET_TYPES.FIELD }
    ];

    // Add place bets if we're in point phase
    if (this.gameState.phase === GAME_PHASES.POINT) {
      availableBets.push(
        { name: '4️⃣ Place 4', value: BET_TYPES.PLACE_4 },
        { name: '5️⃣ Place 5', value: BET_TYPES.PLACE_5 },
        { name: '6️⃣ Place 6', value: BET_TYPES.PLACE_6 },
        { name: '8️⃣ Place 8', value: BET_TYPES.PLACE_8 },
        { name: '9️⃣ Place 9', value: BET_TYPES.PLACE_9 },
        { name: '🔟 Place 10', value: BET_TYPES.PLACE_10 }
      );
    }

    const { betType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'betType',
        message: 'Select bet type:',
        choices: [
          ...availableBets,
          { name: '← Back to main menu', value: 'back' }
        ]
      }
    ]);

    if (betType === 'back') return;

    const { amount } = await inquirer.prompt([
      {
        type: 'number',
        name: 'amount',
        message: `How much do you want to bet? (Available: $${this.gameState.bankroll})`,
        validate: (input) => {
          if (input <= 0) return 'Bet amount must be positive';
          if (input > this.gameState.bankroll) return 'Insufficient funds';
          return true;
        }
      }
    ]);

    try {
      this.gameState.placeBet(betType, amount);
      console.log(chalk.green(`\n✅ Placed ${this.formatBetTypeName(betType)} bet: $${amount}`));
    } catch (error) {
      console.log(chalk.red(`\n❌ Error placing bet: ${error.message}`));
    }

    await this.sleep(1500);
  }

  async removeBet() {
    const activeBets = Array.from(this.gameState.getAllBets().keys());
    
    if (activeBets.length === 0) {
      console.log(chalk.yellow('No active bets to remove.'));
      await this.waitForEnter();
      return;
    }

    const choices = activeBets.map(betType => ({
      name: `${this.formatBetTypeName(betType)} ($${this.gameState.bets.get(betType).amount})`,
      value: betType
    }));

    choices.push({ name: '← Back to main menu', value: 'back' });

    const { betType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'betType',
        message: 'Select bet to remove:',
        choices: choices
      }
    ]);

    if (betType === 'back') return;

    try {
      const removedBet = this.gameState.removeBet(betType);
      console.log(chalk.green(`\n✅ Removed ${this.formatBetTypeName(betType)} bet: $${removedBet.amount}`));
    } catch (error) {
      console.log(chalk.red(`\n❌ Cannot remove bet: ${error.message}`));
    }

    await this.sleep(1500);
  }

  async showStatistics() {
    console.clear();
    console.log(chalk.green.bold('📊 GAME STATISTICS\n'));

    const stats = this.gameState.getStatistics();
    const diceStats = this.dice.getStatistics();

    // Game Stats
    const gameTable = new Table({
      head: ['Metric', 'Value'],
      style: { head: ['cyan'], border: ['grey'] }
    });

    gameTable.push(
      ['Rounds Played', stats.roundsPlayed],
      ['Total Rolls', stats.totalRolls],
      ['Starting Bankroll', `$${10000}`],
      ['Current Bankroll', `$${this.gameState.bankroll}`],
      ['Net Result', `$${stats.netResult || 0}`],
      ['Largest Win', `$${stats.largestWin}`],
      ['Largest Loss', `$${stats.largestLoss}`],
      ['Time Played', stats.formattedDuration || '0s']
    );

    console.log('Game Statistics:');
    console.log(gameTable.toString());

    // Dice Statistics
    if (diceStats.totalRolls > 0) {
      console.log('\nDice Roll Frequencies:');
      const diceTable = new Table({
        head: ['Roll', 'Count', 'Frequency', 'Expected'],
        style: { head: ['cyan'], border: ['grey'] }
      });

      const expected = {
        2: 1/36, 3: 2/36, 4: 3/36, 5: 4/36, 6: 5/36, 7: 6/36,
        8: 5/36, 9: 4/36, 10: 3/36, 11: 2/36, 12: 1/36
      };

      for (let i = 2; i <= 12; i++) {
        const count = diceStats.rollCounts[i] || 0;
        const frequency = count / diceStats.totalRolls;
        const expectedFreq = expected[i];
        
        diceTable.push([
          i,
          count,
          `${(frequency * 100).toFixed(1)}%`,
          `${(expectedFreq * 100).toFixed(1)}%`
        ]);
      }

      console.log(diceTable.toString());
    }

    await this.waitForEnter();
  }

  async gameOptions() {
    console.clear();
    console.log(chalk.green.bold('⚙️  GAME OPTIONS\n'));

    const options = this.gameState.getPlayerOptions();
    
    const { option } = await inquirer.prompt([
      {
        type: 'list',
        name: 'option',
        message: 'Select option to change:',
        choices: [
          {
            name: `Working Bets on Come-Out: ${options.workingBets ? '✅ ON' : '❌ OFF'}`,
            value: 'workingBets'
          },
          {
            name: `Auto Press Winnings: ${options.pressWinnings ? '✅ ON' : '❌ OFF'}`,
            value: 'pressWinnings'
          },
          {
            name: `Parlay Mode: ${options.parlayMode ? '✅ ON' : '❌ OFF'}`,
            value: 'parlayMode'
          },
          {
            name: `Auto Max Odds: ${options.autoOdds ? '✅ ON' : '❌ OFF'}`,
            value: 'autoOdds'
          },
          { name: '🔄 Reset Game', value: 'reset' },
          { name: '← Back to main menu', value: 'back' }
        ]
      }
    ]);

    switch (option) {
      case 'workingBets':
        this.gameState.setPlayerOption('workingBets', !options.workingBets);
        console.log(chalk.green(`Working bets ${!options.workingBets ? 'enabled' : 'disabled'}`));
        break;
      case 'pressWinnings':
        this.gameState.setPlayerOption('pressWinnings', !options.pressWinnings);
        console.log(chalk.green(`Auto press winnings ${!options.pressWinnings ? 'enabled' : 'disabled'}`));
        break;
      case 'parlayMode':
        this.gameState.setPlayerOption('parlayMode', !options.parlayMode);
        console.log(chalk.green(`Parlay mode ${!options.parlayMode ? 'enabled' : 'disabled'}`));
        break;
      case 'autoOdds':
        this.gameState.setPlayerOption('autoOdds', !options.autoOdds);
        console.log(chalk.green(`Auto max odds ${!options.autoOdds ? 'enabled' : 'disabled'}`));
        break;
      case 'reset':
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure you want to reset the game?',
            default: false
          }
        ]);
        
        if (confirm) {
          this.gameState.reset();
          this.dice.clearHistory();
          console.log(chalk.green('Game reset successfully!'));
        }
        break;
      case 'back':
        return;
    }

    if (option !== 'back') {
      await this.sleep(1500);
    }
  }

  displayGameOver() {
    console.clear();
    console.log(chalk.red(figlet.textSync('GAME OVER', { 
      font: 'Standard',
      horizontalLayout: 'fitted'
    })));
    
    console.log(chalk.red.bold('\n💸 You\'ve run out of money!\n'));
    
    const stats = this.gameState.getStatistics();
    console.log(chalk.cyan('Final Statistics:'));
    console.log(`Rounds Played: ${stats.roundsPlayed}`);
    console.log(`Total Rolls: ${stats.totalRolls}`);
    console.log(`Net Result: ${chalk.red(`-$${10000 - this.gameState.bankroll}`)}`);
    console.log(`Time Played: ${stats.formattedDuration || '0s'}`);
    
    console.log(chalk.yellow('\nThanks for playing! 🎲'));
  }

  async waitForEnter() {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: 'Press Enter to continue...'
      }
    ]);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}