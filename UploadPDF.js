import multer from "multer";
import path from "path";
import message from "./message.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `uploads/`);
    },
    filename: function (req, file, cb) {
        let extensionFile = path.extname(file.originalname);
        let saveFileName = `${Date.now()}${extensionFile}`;
        cb(null, saveFileName);
    }
});


const checkFileType = (file, cb) => {

    var ext = path.extname(file.originalname);

    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
        return cb(new Error('Only png, jpg , jpeg and pdf are allowed'));
    }
    return cb(null, true);
}

const upload = multer({
    storage: storage, fileFilter: (req, file, cb) => { checkFileType(file, cb) }
});

const cpUpload = upload.fields([{ name: 'adhaar_card', maxCount: 1 }, { name: 'pan_card', maxCount: 1 },{ name: 'resume', maxCount: 1 }]);

export default cpUpload;  

