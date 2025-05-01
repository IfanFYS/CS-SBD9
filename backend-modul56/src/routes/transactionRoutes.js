const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/', transactionController.getAllTransactions);
router.post('/create', transactionController.createTransaction);
router.post('/pay/:id', transactionController.payTransaction);
router.delete('/:id', transactionController.deleteTransaction);
// --- ADD THIS ROUTE ---
router.get('/byUserId/:userId', transactionController.getTransactionsByUserId);
// --- END ADD ROUTE ---


module.exports = router;