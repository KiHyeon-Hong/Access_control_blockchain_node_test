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

/*
const options = {
            uri: `http://${network}:${config.port}/blockIntegrity`,
            method: 'GET',
          };
          request.get(options, function (error, response, body) {
            resolve(JSON.stringify({ error: error, body: body }));
          });
          JSON.parse('<%- JSON.stringify(chartData) %>'); 


*/
