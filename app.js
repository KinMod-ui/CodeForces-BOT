const express = require('express')
const parser = require('body-parser')
const https = require('https')
var exec = require("child_process").exec,child;

const app = express()
app.set('view engine', 'ejs');
app.use(parser.urlencoded({extended:true}))
app.use(express.static("public"));

console.log("Go to http://localhost:3000")
app.get('/' , function(req , res){
    // console.log("Get page")
    res.render("index")
})

const delay = ms => new Promise(res => setTimeout(res, ms));
var ans = null
app.post('/' , function(req , res){

    const username = req.body.username
    console.log(username)
    const link = "https://codeforces.com/api/user.status?handle=" + username +"&from=1&count=1"
    res.render('results' , {verdict : ans})

    async function getreq()
    {
        var flag = 0
        var time
        var question
        while(1)
        {
            const request = https.get(link  ,function(response){
                response.on("data" ,  function(data){
                    var respo = JSON.parse(data)
                    time = respo.result[0].creationTimeSeconds
                    ans = respo.result[0].verdict
                    
                })
            })
            if (flag == 1){
                child = exec ("python3 ./Verdic.py " + ans + " " + question, function(err ,  stdout , stderr){
                    if (err !== null) {
                            console.log('exec error: ' + error);
                    }
                })
                // console.log(question)
            }
            await delay(4000)
            var timeNew = time
            var newReq
            var verd = ans
            while(1){
                newReq = https.get(link , function(resp){
                    resp.on("data" , function (dat){
                        dat = JSON.parse(dat)
                        timeNew = dat.result[0].creationTimeSeconds
                        verd = dat.result[0].verdict
                        question = dat.result[0].problem.index
                    })
                })
                if (time == timeNew){
                    await delay (4000)
                    continue
                }
                else if (time != timeNew && verd == "TESTING"){
                    
                    while(verd == "TESTING"  || verd == undefined){
                        await delay (1000)
                        newReq = https.get(link , function(resp){
                            resp.on("data" , function (dat){
                                dat = JSON.parse(dat)
                                timeNew = dat.result[0].creationTimeSeconds
                                verd = dat.result[0].verdict
                            })
                        })
                    }
                    ans = verd
                    flag = 1
                    break
                }
                else if (time != timeNew && verd != undefined){
                    ans = verd
                    flag = 1
                    break
                }
                else{
                    await delay(1500)
                }
            }
        }
    }

    getreq()
})

app.listen(3000)
