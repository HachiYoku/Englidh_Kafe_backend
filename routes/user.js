const express = require('express');
const multer = require('multer');
const router = express.Router();
const validateToken = require('../middleware/authMiddleware');
const { getProfile, updateProfile, deletAccount } = require('../controllers/userController');
const upload = multer({ storage: multer.memoryStorage() });

// middleware that is specific to this router
router.use((req, res, next) => {
 console.log('Time: ', Date.now())
 next()
})


router.get('/profile', validateToken, getProfile)

router.put('/profile', validateToken, upload.single('avatar'), updateProfile)

router.delete('/account', validateToken, deletAccount)


module.exports = router
