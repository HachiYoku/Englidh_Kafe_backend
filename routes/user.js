const express = require('express');
const multer = require('multer');
const router = express.Router();
const validateToken = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');
const { getProfile, updateProfile, deletAccount, updateUserStatus, updateUserCourseAccess } = require('../controllers/userController');
const upload = multer({ storage: multer.memoryStorage() });

// middleware that is specific to this router
router.use((req, res, next) => {
 console.log('Time: ', Date.now())
 next()
})


router.get('/', validateToken, getProfile)

router.put('/', validateToken, upload.single('avatar'), updateProfile)

router.put('/:id/status', validateToken, requireAdmin, updateUserStatus)

router.put('/:id/course-access', validateToken, requireAdmin, updateUserCourseAccess)

router.delete('/:id', validateToken, requireAdmin, deletAccount)


module.exports = router
