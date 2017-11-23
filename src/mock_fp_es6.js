import fs from 'fs';
import faker from 'faker';
import { range } from 'ramda';

const campos = () => ({
  key: faker.database.column(),
  value: faker.random.words(3),
  type: faker.database.type(),
  required: faker.random.boolean(),
  length: faker.random.number(),
});

const proposta = () => ({
  [faker.random.number()]: range(0, 150).map(campos)
});

const json = size => JSON.stringify(range(0, size).map(proposta));

const theWayJsonNeedsToBe = size => fs.writeFile('15k_propostas.json', json(size));

const makeTheJsonGreatAgain = (n, size) =>
  range(0, n)
    .forEach((i, ix) => {
      console.log(`Pacote [${ix}] - ${ix * size} até ${(ix + 1) * size}`);
      fs.appendFileSync(
        '100k_propostas.json',
        (ix === 0
        ? '[' + json(size).slice(1, -1) + ','
        : (ix === n - 1
          ? json(size).slice(1, -1) + ']'
          : json(size).slice(1, -1) + ',')
        )
      );
    });

const main = () =>
  process.argv.filter(i => i === '100k').length > 0
    ? makeTheJsonGreatAgain(10, 10000)
    : theWayJsonNeedsToBe(15000);

console.time('write_file');
main();
console.timeEnd('write_file');