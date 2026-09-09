const ifct = require('ifct2017');
const compositions = require('@ifct2017/compositions');
const descriptions = require('@ifct2017/descriptions');
const languages = require('@ifct2017/languages');
const groups = require('@ifct2017/groups');

async function test() {
  await compositions.load();
  await descriptions.load();
  await languages.load();
  await groups.load();

  console.log('Total compositions:', compositions.corpus.size);
  console.log('Total descriptions:', descriptions.corpus.size);
  console.log('Total languages:', languages.corpus.size);
  console.log('Total groups:', groups.corpus.size);

  const sampleCode = Array.from(compositions.corpus.keys())[0];
  console.log('\nSample Code:', sampleCode);
  console.log('Composition:', compositions.corpus.get(sampleCode));
  console.log('Description:', descriptions.corpus.get(sampleCode));
  console.log('Languages:', languages.corpus.get(sampleCode));
  console.log('Group:', groups.corpus.get(sampleCode.charAt(0)));
}

test();
