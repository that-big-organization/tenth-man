const { Router } = require('express')
const UserCtrl = require('../controllers/user')

const router = Router()

// router.route('/:id').get(UserCtrl.getUser)
router.route("/register").post(UserCtrl.register)
router.route("/login").post(UserCtrl.generateLoginCode)
// router.route("/logout").post(UserCtrl.logout)
router.route("/delete").delete(UserCtrl.delete)
router.route("/update-preferences").put(UserCtrl.save)
// router.route('verify')
//     .get(UserCtrl.createCode)
//     .post(UserCtrl.validateCode)




module.exports = router
