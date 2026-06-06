const router = require('express').Router();
const ctrl   = require('../controllers/schedule.controller');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/',        ctrl.getEvents);
router.post('/',       ctrl.create);
router.patch('/:id',   ctrl.update);
router.delete('/:id',  ctrl.remove);
module.exports = router;
