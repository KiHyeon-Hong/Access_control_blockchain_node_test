const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/'));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  request.get(`http://localhost:65006/getBlockchain`, (error, response, body) => {
    res.render('main', {
      chain: { data: JSON.parse(body) },
    });
  });
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
