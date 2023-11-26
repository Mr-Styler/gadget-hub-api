const multer = require('multer');

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public');
    },
    filename: (req, file, cb) => {
        let folderName, name
    
        switch (req.originalUrl) {
            case "/api/v1/products":
                folderName = "/img/blog";
                name = "recipe"
                break;

            case "/api/v1/users/me":
                folderName = "/img/users";
                name = "user"
                break;
            
            default:
                folderName = "images"
                break;
        }
        const ext = file.mimetype.split('/')[1];
        cb(null, `${folderName}/${name}-${Date.now()}.${ext}`)
    }
});

const imageFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Not an image'), false);
    }
};

upload = multer({
    storage: imageStorage,
    fileFilter: imageFilter
});

exports.uploadImages = upload.fields([
    {name: 'image', maxCount: 1},
    {name: 'images', maxCount: 3}
])
