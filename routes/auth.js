const express = require('express');
const router = express.Router();

const { register, verifyEmail, resendVerification, login, forgotPassword, resetPassword } = require('../controllers/authController')

// middleware that is specific to this router
router.use((req, res, next) => {
 console.log('Time: ', Date.now())
 next()
})


router.post('/register', register)

router.get('/verify-email', verifyEmail)
router.get('/verify-email/:token', verifyEmail)
router.post('/verify-email', verifyEmail)

router.post('/resend-verification', resendVerification)

router.post('/login', login)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password', resetPassword)



module.exports = router
