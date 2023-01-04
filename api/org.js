const { Router } = require('express')
const OrgCtrl = require('../controllers/org')

const router = Router()

router.route('/').get(OrgCtrl.getAllOrg).post(OrgCtrl.createOrg)
router.route('/login')
router.route('/logout')
router.route('/near-me').get(OrgCtrl.orgNearMe)
router.route('/:id').get(OrgCtrl.getOrg).put(OrgCtrl.updateOrg).delete(OrgCtrl.deleteOrg)
router.route('/:id/events').get(OrgCtrl.getEvents).post(OrgCtrl.createEvent)
router.route('/:id/events/:event').get(OrgCtrl.getEvent).post(OrgCtrl.eventForm).put(OrgCtrl.editEvent).delete(OrgCtrl.deleteOrg)


module.exports = router