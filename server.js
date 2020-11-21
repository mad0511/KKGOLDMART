const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var path = require('path');

app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static(path.join(__dirname, 'public')));

//make way for some custom css, js and images
app.use(express.static(path.join(__dirname, 'public/assets/css')));
app.use(express.static(path.join(__dirname, 'public/assets/js')));
app.use(express.static(path.join(__dirname, 'public/assets/img')));
app.use(express.static(path.join(__dirname, 'public/assets/vendor')));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// Login route for admin
app.get('/login', getFunc)
app.post('/estimator', estimator)
app.get('/',homePage)
app.post('/changeRate',changeRate)
app.post('/sendMail',sendMail)

const send = require('gmail-send')({
    user: 'kkgoldmart@gmail.com',
    pass: 'wiqzdktewlljyjya',
    to:   'kkgoldmart@gmail.com',
  });


function sendMail(req, res) {
    var username= req.body.username
    var email = req.body.email
    var subject = req.body.subject
    var message = req.body.message

    send({
        subject: username + " - " + subject + "(" + email + ")",
        text: message, 

    }, (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result);
    })
}

// render home page
function homePage(req, res) {
    var fs = require('fs'), filename = __dirname + "/gold_rate.txt";
    
    var data = fs.readFileSync(filename, 'utf8');
    console.log(data);
    var tfourkgold = data;

    var ttkgold = Number(((tfourkgold * 91.6)/100).toFixed(1));
    var tokgold = Number(((ttkgold * 91.6)/100).toFixed(1));

    console.log(ttkgold,tokgold)

    var filename = __dirname + "/silver_rate.txt";
    
    var silver = fs.readFileSync(filename, 'utf8');    
    
    res.render(path.join(__dirname, 'index.html'), {tfourkgold: tfourkgold, ttkgold: ttkgold, tokgold: tokgold, silver: silver});
}


// post for login
function estimator(req, res) {
    var username= req.body.fname
    var password = req.body.lname

    console.log(username, password);

    if (username == "kkgoldmart@admin.com" && password == "vibin"){
        var fs = require('fs'), filename = __dirname + "/gold_rate.txt";
    
        var data = fs.readFileSync(filename, 'utf8');
        console.log(data)
        var tfourkgold = data;
    
        var ttkgold = Number(((tfourkgold * 91.6)/100).toFixed(1));
        var tokgold = Number(((ttkgold * 91.6)/100).toFixed(1));
    
        console.log(ttkgold,tokgold)
    
        var filename = __dirname + "/silver_rate.txt";
        
        var silver = fs.readFileSync(filename, 'utf8');    
    
        res.render(path.join(__dirname, 'estimator.html'), {tfourkgold: tfourkgold, ttkgold: ttkgold, tokgold: tokgold, silver: silver});
    
    }
    else{
        res.render(path.join(__dirname, 'login.html'));
    }
    
  }


//  get for login route
function getFunc(req, res) {
    res.render(path.join(__dirname, 'login.html'));
}


function changeRate(req,res) {
    var gRate= req.body.grate
    var sRate = req.body.srate

    console.log(gRate, sRate);

    const fs = require('fs');

    // write to new_file
    fs.writeFile(__dirname + '/gold_rate.txt', gRate, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;

        // success case, the file was saved
        console.log('Gold rate saved!');
    });

    // write to new_file
    fs.writeFile(__dirname + '/silver_rate.txt', sRate, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;

        // success case, the file was saved
        console.log('Silver rate saved!');
    });
    
    var tfourkgold = gRate;

    var ttkgold = Number(((tfourkgold * 91.6)/100).toFixed(1));
    var tokgold = Number(((ttkgold * 91.6)/100).toFixed(1));

    var silver = sRate;
    
    res.render(path.join(__dirname, 'estimator.html'), {tfourkgold: tfourkgold, ttkgold: ttkgold, tokgold: tokgold, silver: silver});

  }


var server = app.listen(8081, function(){
    var port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});
