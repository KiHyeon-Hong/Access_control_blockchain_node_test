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

let tot = 5;
let cnt = 0;

app.get('/', function (req, res) {
  request.get(`http://localhost:65006/getBlockchain`, (error, response, body) => {
    res.render('main', {
      chain: { data: JSON.parse(body) },
    });
  });
});

app.get('/update', function (req, res) {
  let chain = JSON.parse(fs.readFileSync(__dirname + '/files/AccessKey.json', 'utf8'));

  res.render('update', {
    chain: { data: chain[req.query.accessKey], error: error[req.query.accessKey - 1] },
  });
});

app.get('/change', function (req, res) {
  let chain = JSON.parse(fs.readFileSync(__dirname + '/files/AccessKey.json', 'utf8'));

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

  fs.writeFileSync(__dirname + '/files/AccessKey.json', jsonFormat(chain), 'utf8');

  cnt++;

  if (cnt === tot) {
    while (true) {
      let results = fs.readFileSync(__dirname + '/files/AccessKey.log', 'utf8').split('\n');

      if (results[results.length - 4] === '복구된 출입키') {
        break;
      }
    }

    res.redirect('/results');
  } else {
    res.redirect('/');
  }
});

app.get('/results', function (req, res) {
  let results = fs.readFileSync(__dirname + '/files/AccessKey.log', 'utf8').split('\n');

  let success = 0;
  let fail = 0;

  for (let i = 0; i < results.length; i++) {
    if (results[i] === '시험 출입키 데이터') {
      if (results[i + 1] === results[i + 7]) {
        success++;
      } else {
        fail++;
      }
    }
  }

  fs.appendFileSync(__dirname + '/files/AccessKey.log', `===============================================================\n`, 'utf8');
  fs.appendFileSync(__dirname + '/files/AccessKey.log', `총 데이터: ${tot}개\n`, 'utf8');
  fs.appendFileSync(__dirname + '/files/AccessKey.log', `성공: ${success}회\n`, 'utf8');
  fs.appendFileSync(__dirname + '/files/AccessKey.log', `실패: ${fail}회\n`, 'utf8');
  fs.appendFileSync(__dirname + '/files/AccessKey.log', `성공률: ${(success / (success + fail)) * 100}%\n\n`, 'utf8');

  let date = new Date();
  fs.appendFileSync(__dirname + '/files/AccessKey.log', `종료 시간: ${date}`, 'utf8');

  res.render('result', {
    tot: tot,
    success: success,
    fail: fail,
    rank: (success / (success + fail)) * 100,
  });
});

app.get('/finish', function (req, res) {
  res.render('finish', {});

  setTimeout(() => {
    process.exit(1);
  }, 5000);
});

app.get('/setBlockIntegrityTime', function (req, res) {
  request.get(`http://localhost:65006/setBlockIntegrityTime?time=${req.query.time}`, (error, response, body) => {
    res.redirect('/');
  });
});

app.listen(65001, () => {
  // console.log('Server running...');
});
