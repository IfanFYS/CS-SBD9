const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Root path for POST requests (matches frontend post to /item)
router.post('/', upload.single('image'), itemController.createItem);
// Keep the original route for backward compatibility
router.post('/create', upload.single('image'), itemController.createItem);

router.get('/', itemController.getAllItems);
router.get('/byId/:id', itemController.getItemById);
router.get('/byStoreId/:store_id', itemController.getItemByStoreId);
router.put('/', upload.single('image'), itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;