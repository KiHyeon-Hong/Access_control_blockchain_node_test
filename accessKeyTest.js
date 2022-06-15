const fs = require('fs');
const readline = require('readline');
const jsonFormat = require('json-format');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let cnt = 0;

let error = [
  '9285c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  'ssz5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  '3f35c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  'aps5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  'bgs5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  '60d5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  'cxs5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  'ngd5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  'wsz5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  'noo5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  '9285c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  'ssz5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  '3f35c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  'aps5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  'bgs5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  '60d5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  'cxs5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  'ngd5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  'wsz5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
  'noo5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',
];

fs.writeFileSync(__dirname + '/files/accessKey.log', '', 'utf8');

rl.on('line', (data) => {
  let chain = JSON.parse(fs.readFileSync(__dirname + '/AccessKeyBlockchain/files/Blockchain.json', 'utf8'));

  let temp = chain[cnt + 1].transaction.accessKey;

  console.log('시험 출입키 데이터');
  console.log(chain[cnt + 1].transaction.accessKey);
  console.log('위변조 출입키');
  console.log(error[cnt]);
  console.log();

  chain[cnt + 1].transaction.accessKey = error[cnt];

  fs.appendFileSync(__dirname + '/files/accessKey.log', `시험 출입키 데이터\n`, 'utf8');
  fs.appendFileSync(__dirname + '/files/accessKey.log', `${temp}\n`, 'utf8');
  fs.appendFileSync(__dirname + '/files/accessKey.log', `위변조 출입키\n`, 'utf8');
  fs.appendFileSync(__dirname + '/files/accessKey.log', `${error[cnt]}\n`, 'utf8');

  fs.writeFileSync(__dirname + '/AccessKeyBlockchain/files/Blockchain.json', jsonFormat(chain), 'utf8');

  if (cnt === 19) {
    rl.close();
  }

  cnt++;
});
