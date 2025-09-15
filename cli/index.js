#!/usr/bin/env node

import { CrapsTable } from './crapsTable.js';

console.log('🎲 Welcome to Craps V2! 🎲\n');

const table = new CrapsTable();
await table.start();