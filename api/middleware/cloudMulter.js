const multer = require('multer');
const cloudStorage = require('../middleware/cloudStorage');
const cloudMulter = multer({ 
    storage: cloudStorage,
    limits: {
        fileSize: 30000000, // 300 KB 
    },
    fileFilter: (req, file, next) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          next(null, true);
        } else {
          next(null, false);
          return next(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

module.exports = cloudMulter;