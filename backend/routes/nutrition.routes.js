const router     = require('express').Router();
const controller = require('../controllers/nutrition.controller');
const { protect }= require('../middleware/auth');

router.use(protect);

router.get('/',         controller.getMeals);
router.get('/totals',   controller.getTotals);
router.post('/',        controller.create);
router.post('/lookup',  controller.lookupFood);    // AI food lookup
router.delete('/:id',   controller.remove);

module.exports = router;
