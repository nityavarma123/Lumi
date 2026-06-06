const router = require('express').Router();
const ctrl   = require('../controllers/study.controller');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/',         ctrl.getSessions);
router.get('/week',     ctrl.getWeek);
router.get('/totals',   ctrl.getTotals);
router.post('/',        ctrl.create);
router.delete('/:id',   ctrl.remove);
module.exports = router;
