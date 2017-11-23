const fs = require('fs');
const faker = require('faker');

const campos = () => ({
  key: faker.database.column(),
  value: faker.random.words(3),
  type: faker.database.type(),
  required: faker.random.boolean(),
  length: faker.random.number(),
});

const proposta = () => {
  const id = faker.random.number();
  const dados = { [id]: [] };
  for (let i = 0; i < 150; i++) {
    dados[id].push(campos());
  }
  return dados;
};

const json = size => {
  const propostas = [];
  for (let i = 0; i < size; i++) {
    propostas.push(proposta());
  }
  return JSON.stringify(propostas);
};

const theWayJsonNeedsToBe = () => fs.writeFile('15k_propostas.json', json(15000));

const makeTheJsonGreatAgain = () => {
  for (let i = 0; i < 10; i++) {
    fs.appendFileSync('100k_propostas.json', json(10000));
  }
}

const main = () =>
  process.argv.filter(i => i === '100k').length > 0
  ? makeTheJsonGreatAgain()
  : theWayJsonNeedsToBe();

console.time('write_file');
main();
console.timeEnd('write_file');