const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const fs = require('fs');
const jsonFormat = require('json-format');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/'));

app.set('view engine', 'ejs');

fs.writeFileSync(__dirname + '/files/AccessKey.log', '', 'utf8');

let date = new Date();

fs.appendFileSync(__dirname + '/files/AccessKey.log', `시작 시간: ${date}\n`, 'utf8');
fs.appendFileSync(__dirname + '/files/AccessKey.log', `#########################\n`, 'utf8');
fs.appendFileSync(__dirname + '/files/AccessKey.log', `# 나연테크 시험결과보고서 #\n`, 'utf8');
fs.appendFileSync(__dirname + '/files/AccessKey.log', `#########################\n\n`, 'utf8');
fs.appendFileSync(__dirname + '/files/AccessKey.log', `* 출입키 위변조 복구율\n`, 'utf8');
fs.appendFileSync(__dirname + '/files/AccessKey.log', `* 수행 100회, 총 테스트 데이터: 100개\n`, 'utf8');
fs.appendFileSync(__dirname + '/files/AccessKey.log', `* 목표 성공률: 100%\n\n`, 'utf8');

console.log(`시작 시간: ${date}`);
console.log(`#########################`);
console.log(`# 나연테크 시험결과보고서 #`);
console.log(`#########################\n`);
console.log(`* 출입키 위변조 복구율`);
console.log(`* 수행 100회, 총 테스트 데이터: 100개`);
console.log(`* 목표 성공률: 100%\n`);

let error = fs
  .readFileSync(__dirname + '/files/ForgedAccessKey.txt', 'utf8')
  .split('\n')
  .map((v) => {
    return v.split(' ')[1];
  });

for (let i = 0; i < error.length; i++) {
  error[i] = error[i].split('\r')[0];
}

let tot = 100;
let cnt = 0;

app.get('/', function (req, res) {
  request.get(`http://localhost:65006/getBlockchain`, (error, response, body) => {
    res.render('main', {
      chain: { data: JSON.parse(body) },
    });
  });
});

app.get('/update', function (req, res) {
  let chain = JSON.parse(fs.readFileSync(__dirname + '/AccessKeyBlockchain/files/Blockchain.json', 'utf8'));

  res.render('update', {
    chain: { data: chain[req.query.accessKey], error: error[req.query.accessKey - 1] },
  });
});

app.get('/change', function (req, res) {
  let chain = JSON.parse(fs.readFileSync(__dirname + '/AccessKeyBlockchain/files/Blockchain.json', 'utf8'));

  let temp = chain[req.query.accessKey].transaction.accessKey;

  date = new Date();

  console.log('===============================================================');
  console.log(`출입키 위변조 복구율 시험 ${cnt + 1}/${tot} (${date})\n`);
  console.log('시험 출입키 데이터');
  console.log(chain[req.query.accessKey].transaction.accessKey);
  console.log('위변조 출입키');
  console.log(req.query.change);
  console.log();

  chain[req.query.accessKey].transaction.accessKey = req.query.change;

  fs.appendFileSync(__dirname + '/files/AccessKey.log', `===============================================================\n`, 'utf8');
  fs.appendFileSync(__dirname + '/files/AccessKey.log', `출입키 위변조 복구율 시험 ${cnt + 1}/${tot} (${date})\n\n`, 'utf8');
  fs.appendFileSync(__dirname + '/files/AccessKey.log', `시험 출입키 데이터\n`, 'utf8');
  fs.appendFileSync(__dirname + '/files/AccessKey.log', `${temp}\n`, 'utf8');
  fs.appendFileSync(__dirname + '/files/AccessKey.log', `위변조 출입키\n`, 'utf8');
  fs.appendFileSync(__dirname + '/files/AccessKey.log', `${req.query.change}\n`, 'utf8');

  fs.writeFileSync(__dirname + '/AccessKeyBlockchain/files/Blockchain.json', jsonFormat(chain), 'utf8');

  cnt++;

  res.redirect('/');
});

app.listen(65001, () => {
  // console.log('Server running...');
});
