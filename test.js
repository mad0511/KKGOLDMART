const send = require('gmail-send')({
    user: 'kkgoldmart@gmail.com',
    pass: 'wiqzdktewlljyjya',
    to:   'kkgoldmart@gmail.com',
  });


send({
    subject: "subject",
    text: "message", 

}, (error, result, fullResult) => {
    if (error) console.error(error);
    console.log(result);
})