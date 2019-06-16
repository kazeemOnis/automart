import multer from 'multer';
import path from 'path';
import Datauri from 'datauri';
import { regexChecker } from '.';

const storage = multer.memoryStorage();

const checkFileType = (file, callback) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  if (regexChecker(fileTypes, file.mimetype)) {
    callback(null, true);
  } else callback(null, false);
};

const upload = multer({ storage, checkFileType }).array('images', 5);

const dUri = new Datauri();
const dataUri = file => dUri.format(path.extname(file.originalname).toString(), file.buffer);

export { upload, dataUri };
