const express = require('express');
const multer = require('multer');
const router = express.Router();
const validateToken = require('../middleware/authMiddleware');
const { getProfile, updateProfile, deletAccount } = require('../controllers/userController');
const upload = multer({ storage: multer.memoryStorage() });

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }

  next();
}

// middleware that is specific to this router
router.use((req, res, next) => {
 console.log('Time: ', Date.now())
 next()
})


router.get('/', validateToken, getProfile)

router.put('/', validateToken, upload.single('avatar'), updateProfile)

router.delete('/:id', validateToken, requireAdmin, deletAccount)


module.exports = router
