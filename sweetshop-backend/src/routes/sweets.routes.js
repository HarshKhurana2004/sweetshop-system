const express = require('express');
const router = express.Router();

const sweetsController = require('../controllers/sweets.controller');
const auth = require('../middleware/auth.middleware');
const admin = require('../middleware/admin.middleware');

// SPECIFIC ROUTES FIRST
router.get('/search', auth, sweetsController.search);
router.post('/:id/purchase', auth, sweetsController.purchase);
router.post('/:id/restock', auth, admin, sweetsController.restock);

// BASE ROUTES
router.get('/', auth, sweetsController.getAll);
router.post('/', auth, admin, sweetsController.add);

// GENERIC ID ROUTES LAST (VERY IMPORTANT)
router.put('/:id', auth, admin, sweetsController.update);
router.delete('/:id', auth, admin, sweetsController.delete);

module.exports = router;
