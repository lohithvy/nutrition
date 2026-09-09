const fs = require('fs');
const path = require('path');
const csvx = require('csv-parse/sync');

const compCsvPath = path.join(__dirname, '../../node_modules/@ifct2017/compositions/index.csv');
const content = fs.readFileSync(compCsvPath, 'utf8');

const records = csvx.parse(content, {
  columns: true,
  skip_empty_lines: true,
  comment: '#',
});

console.log('Total IFCT 2017 records parsed:', records.length);

const sample = records[0];
const keys = Object.keys(sample);

const getCol = (row, field) => {
  for (const k of Object.keys(row)) {
    if (k.endsWith(`; ${field}`) || k === field) {
      return row[k];
    }
  }
  return null;
};

console.log('Sample parsed:');
console.log('Code:', getCol(sample, 'code'));
console.log('Name:', getCol(sample, 'name'));
console.log('Sci:', getCol(sample, 'scie'));
console.log('Lang:', getCol(sample, 'lang'));
console.log('Group:', getCol(sample, 'grup'));
console.log('Energy (kJ):', getCol(sample, 'enerc'));
console.log('Protein (g):', getCol(sample, 'protcnt'));
console.log('Fat (g):', getCol(sample, 'fatce'));
console.log('Carbs (g):', getCol(sample, 'choavldf'));
console.log('Fiber (g):', getCol(sample, 'fibtg'));
