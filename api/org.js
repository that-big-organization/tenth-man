const { Router } = require('express')
const OrgCtrl = require('../controllers/org')

const router = Router()

router.route('/').get().post()
router.route('/login')
router.route('/logout')
router.route('/near-me').get().post()
router.route('/:id').get().put().delete
router.route('/:id/events').get().post()
router.route('/:id/events/:event').get().post().put().delete()


module.exports = router