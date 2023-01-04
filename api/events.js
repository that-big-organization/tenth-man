const { Router } = require('express')
const EventCtrl = require('../controllers/event')

const router = Router()

router.route('/').get()
router.route('/near-me').get()
router.route('/:id').get()



module.exports = router