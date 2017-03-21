const express = require('express')
const router = express.Router()
const mongoConnected = require('./db.js')
const jwt = require('jsonwebtoken')
const config = require('./config.json')

router.post('/login', (req, res) => {
  mongoConnected.then(db => {
    db
      .collection('users')
      .findOne(
        { 'username': req.body.username, 'password': req.body.password },
        { '_id': 0, 'password': 0, 'iat': 0 },
        (err, user) => {
          if (!user || err) {
            res.status(404).send()
          } else {
            const token = jwt.sign(user, config.jwt_secret)

            res.status(200).json({
              user,
              token,
              tokenType: 'Bearer'
            })
          }
        }
      )
  })
})

router.post('/signup', (req, res) => {
  mongoConnected.then(db => {
    db
      .collection('users')
      .insert(req.body, (err, user) => {
        if (err) res.status(404).send(err)
        res.status(201).send()
      })
  })
})

router.get('/users', (req, res) => {
  mongoConnected.then(db => {
    db
      .collection('users').find({}, { _id: 0, password: 0 })
      .toArray((err, users) => {
        res.send(users)
      })
  })
})

router.get('/', (req, res) => {
  res.send('<h1>Eleks Frontend Camp Chat Servise</h1>');
})

module.exports = router