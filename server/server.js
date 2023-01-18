const express = require('express');
const Twitter = require('twit');
 
const app = express();
const client = new Twitter({
  consumer_key: 'rSRm5bfQSnakP552UulelhjqY',
  consumer_secret: 'HX81wDEyEMB92hN3YNbOlcMMUxXM091aL5cS0ePc4WJ0JoPejC',
  access_token: '1305945282824343557-YqWUSdep90orfAk4ufoEBiO0yHSLUA',
  access_token_secret: 'V0zwd0ixM2xhHjX4NFui4ino03ulah7pZUc6IBSoUqSuT'
});
 
app.use(require('cors')());
app.use(require('body-parser').json());

app.get('/home_timeline', (req, res) => {
    const params = { tweet_mode: 'extended', count: 10 };
   
    client
      .get(`statuses/home_timeline`, params)
      .then(timeline => {
         
        res.send(timeline);
      })
      .catch(error => {
      res.send(error);
    });
      
});

app.listen(3000, () => console.log('Server running'));
