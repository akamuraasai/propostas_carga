import { MongoClient } from 'mongodb';
import assert from 'assert';

import StreamArray from 'stream-json/utils/StreamArray';
import path from 'path';
import fs from 'fs';

// import json from '../15k_propostas.json';

const url = 'mongodb://localhost:27017/fies';

const getData = () => {
  let jsonStream = StreamArray.make();
  let db;
  MongoClient.connect(url, (err, conn) => {
    db = conn;

    console.time('insert_time');
    let filename = path.join(__dirname, '../100k_propostas.json');
    fs.createReadStream(filename).pipe(jsonStream.input);
  });

  jsonStream.output.on('data', function ({index, value}) {
    if (index % 1000 === 0 && index !== 0) {
      console.log(`${index} registros inseridos...`)
    }
    insertDocuments(db, [value], () => {});
  });

  jsonStream.output.on('end', function () {
    console.log('Todos os registros inseridos.');
    console.timeEnd('insert_time');
    db.close();
  });
}

const insertDocuments = (db, data, callback) => {
  const collection = db.collection('propostas');
  collection
    .insertMany(data, (err, result) => {
      callback(result);
    });
}

getData();