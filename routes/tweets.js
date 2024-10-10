var express = require('express');
var router = express.Router();

const User = require('../models/users');
const Tweet = require('../models/tweets');
const { checkBody } = require('../modules/checkBody');

router.post('/', (req, res) => {
    if (!checkBody(req.body, ['token', 'content'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }


    User.findOne({ token: req.body.token }).then(userData => {
        if (userData === null) {
            res.json({ result: false, error: 'User not found' });
            return;
        }

        const newTweet = new Tweet({
            author: userData.id,
            content: req.body.content,
            createdOn: new Date(),
        });

        newTweet.save().then(newDoc => {
            res.json({ result: true, tweet: newDoc });
        });
    })
})

router.get('all/:token', (req, res) => {
    User.findOne({ token : req.params.token }).then(userData => {
        if(userData === null) {
            res.json({ result: false, error:'User not found'})
            return;
        }
        Tweet.find() // Populate and select specific fields to return (for security purposes)
      .populate('author', ['username', 'firstName'])
      .populate('likes', ['username'])
      .sort({ createdOn: 'desc' })
      .then(tweets => {
        res.json({ result: true, tweets });
      });
  });
});
   
