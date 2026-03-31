const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/authMiddleware');

const { register, verifyEmail, resendVerification, login, getCurrentUser, forgotPassword, resetPassword } = require('../controllers/authController')

// middleware that is specific to this router
router.use((req, res, next) => {
 console.log('Time: ', Date.now())
 next()
})


router.post('/register', register)

router.get('/verify-email', verifyEmail)

router.post('/resend-verification', resendVerification)

router.post('/login', login)

router.get('/me', validateToken, getCurrentUser)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password/:token', resetPassword)



module.exports = router
