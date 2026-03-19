const express = require('express');
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
 console.log('Time: ', Date.now())
 next()
})
GET /api/user/profile
PUT /api/user/profile
DELETE /api/user/account
GET /api/user/my-courses

router.get('/profile', (req, res) => {
  res.send('User Profile endpoint')
})

router.put('/profile', (req, res) => {
  res.send('Update User Profile endpoint')
})

router.delete('/account', (req, res) => {
  res.send('Delete User Account endpoint')
})
