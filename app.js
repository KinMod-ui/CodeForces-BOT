import express from 'express';
import parser from 'body-parser';

import { getReq } from './getReq.js';

import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 5000,
  max: 3,
  message: 'You have exceeded the 3 requests in 5 seconds limit!',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();

app.use(parser.urlencoded({ extended: true }));
app.use(limiter);
app.use(express.static('public'));

console.log('Go to http://localhost:3000');

app.get('/', function (req, res) {
  // console.log("Get page")
  res.sendFile('./index.html', { root: '.' });
});

app.post('/', function (req, res) {
  const username = req.body.username;
  console.log(username);

  const link =
    'https://codeforces.com/api/user.status?handle=' +
    username +
    '&from=1&count=1';
  res.sendFile('/results.html', { root: '.' });

  getReq(link);
});

app.listen(3000);
