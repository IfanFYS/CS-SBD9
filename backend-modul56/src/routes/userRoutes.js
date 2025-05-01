const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Debug middleware to log request body
const logRequestBody = (req, res, next) => {
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  next();
};

router.get('/', userController.getAllUsers);
router.post('/register', logRequestBody, userController.registerUser); // Added middleware
router.post('/login', logRequestBody, userController.loginUser); // Added middleware
router.get('/:email', userController.getUserByEmail);
router.put('/', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/topUp', userController.topUp);

module.exports = router;