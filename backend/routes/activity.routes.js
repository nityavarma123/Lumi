const router = require('express').Router();
const ctrl   = require('../controllers/activity.controller');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/',        ctrl.getLogs);
router.get('/stats',   ctrl.getStats);
router.post('/',       ctrl.create);
module.exports = router;
