// const https = require('https');
import axios from 'axios';
import exec from 'child_process';
// var exec = require('child_process').exec,
var child;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
var ans = null;

export const getReq = async (link) => {
  var flag = 0;
  var time;
  var question;
  while (1) {
    try {
      const request = await axios.get(link);

      const respo = request.data;
      time = respo.result[0].creationTimeSeconds;
      ans = respo.result[0].verdict;
    } catch (err) {
      console.log(err.response);
      console.log('Too many attempts. Please try later');

      continue;
    }
    if (flag == 1) {
      child = exec.exec(
        'python3 ./Verdic.py ' + ans + ' ' + question,
        function (err, _stdout, _stderr) {
          if (err !== null) {
            console.log('exec error: ' + err);
          }
        }
      );
      console.log(ans + ' ' + question);
    }
    // await delay(4000);
    var timeNew = time;
    var newReq;
    var verd = ans;
    while (1) {
      await delay(4000);
      try {
        newReq = await axios.get(link);

        const dat = newReq.data;
        timeNew = dat.result[0].creationTimeSeconds;
        verd = dat.result[0].verdict;
        question = dat.result[0].problem.index;
      } catch (err) {
        console.log(err.response);
        console.log('Too many attempts. Please try later');
        continue;
      }

      if (time == timeNew) {
        // await delay(4000);
        continue;
      } else if (time != timeNew && verd == 'TESTING') {
        while (verd == 'TESTING' || verd == undefined) {
          await delay(1000);
          try {
            newReq = await axios.get(link);

            const dat = newReq.data;
            timeNew = dat.result[0].creationTimeSeconds;
            verd = dat.result[0].verdict;
          } catch (err) {
            console.log(err.response);
            console.log('Too many attempts. Please try later');
            continue;
          }
        }
        ans = verd;
        flag = 1;
        break;
      } else if (time != timeNew && verd != undefined) {
        ans = verd;
        flag = 1;
        break;
      } else {
        await delay(1500);
      }
    }
  }
};
