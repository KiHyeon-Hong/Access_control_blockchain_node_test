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
];

rl.on('line', (data) => {
  let chain = JSON.parse(fs.readFileSync(__dirname + '/AccessKeyBlockchain/files/Blockchain.json', 'utf8'));

  console.log('시험 출입키 데이터');
  console.log(chain[cnt + 1].transaction.accessKey);
  console.log('위변조 출입키');
  console.log(error[cnt]);
  console.log();

  chain[cnt + 1].transaction.accessKey = error[cnt];

  fs.writeFileSync(__dirname + '/AccessKeyBlockchain/files/Blockchain.json', jsonFormat(chain), 'utf8');

  if (cnt === 9) {
    rl.close();
  }

  cnt++;
});
