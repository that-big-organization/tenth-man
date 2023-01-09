const { Router } = require('express')
const UserCtrl = require('../controllers/user')

const router = Router()

router.route("/register").post(UserCtrl.register)
router.route("/login").post(UserCtrl.generateLoginCode)
router.route("/:id/delete").delete(UserCtrl.delete)
router.route("/:id/update-preferences").put(UserCtrl.save)
router.route("/:id").get(UserCtrl.getUser)




module.exports = router
