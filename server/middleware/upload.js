const multer = require('multer');

const storage = multer.memoryStorage(); // You can also use diskStorage for saving files to disk
const upload = multer({ storage });

module.exports = upload;
