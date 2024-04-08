const { Router } = require('express')
const authController = require('../controllers/authController')
const router = Router();

router.post('/signup', authController.signup_post)
router.get('/signup', authController.signup_get)
router.get('/login', authController.login_get)
router.post('/login', authController.login_post)
router.post('/logout', authController.logout_get)
router.get('/profile', authController.profile_get);

// router.get('/getmessages',authController.getmessages)

module.exports = router;