const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Root route to get all stores (matches frontend request to /store)
router.get('/', storeController.getAllStores);
// Keep the original route for backward compatibility
router.get('/getAll', storeController.getAllStores);

// Route to get store by ID
router.get('/:id', storeController.getStoreById);

// Post to root path (matches frontend request to /store with POST)
router.post('/', storeController.createStore);
// Keep the original route for backward compatibility
router.post('/create', storeController.createStore);

router.delete('/:id', storeController.deleteStore);
router.put('/', storeController.updateStore);

module.exports = router;