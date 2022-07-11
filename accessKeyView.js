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

fs.writeFileSync(__dirname + '/files/accessKey.log', '', 'utf8');

let error = fs
  .readFileSync(__dirname + '/files/ForgedAccessKey.txt', 'utf8')
  .split('\n')
  .map((v) => {
    return v.split(' ')[1];
  });

for (let i = 0; i < error.length; i++) {
  error[i] = error[i].split('\r')[0];
}

console.log(error);

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

  console.log('시험 출입키 데이터');
  console.log(chain[req.query.accessKey].transaction.accessKey);
  console.log('위변조 출입키');
  console.log(req.query.change);
  console.log();

  chain[req.query.accessKey].transaction.accessKey = req.query.change;

  fs.appendFileSync(__dirname + '/files/accessKey.log', `시험 출입키 데이터\n`, 'utf8');
  fs.appendFileSync(__dirname + '/files/accessKey.log', `${temp}\n`, 'utf8');
  fs.appendFileSync(__dirname + '/files/accessKey.log', `위변조 출입키\n`, 'utf8');
  fs.appendFileSync(__dirname + '/files/accessKey.log', `${req.query.change}\n`, 'utf8');

  fs.writeFileSync(__dirname + '/AccessKeyBlockchain/files/Blockchain.json', jsonFormat(chain), 'utf8');

  res.redirect('/');
});

app.listen(65001, () => {
  console.log('Server running...');
});
