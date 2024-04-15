import { Router } from "express";
import path from "path";
import { UploadController } from "./../controllers";

const router = Router();

const controller = new UploadController();

const multer = require("multer");

const imageStorage = multer.diskStorage({
  // @ts-ignore
  destination: function (req, file, cb) {
    cb(null, "static/images/");
  },
  // @ts-ignore
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadImagee = multer({ storage: imageStorage });
const uploadImage = uploadImagee.fields([{ name: "image", maxCount: 1 }]);

const videoStorage = multer.diskStorage({
  // @ts-ignore
  destination: function (req, file, cb) {
    cb(null, "static/videos/");
  },
  // @ts-ignore
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadVideoo = multer({ storage: videoStorage });
const uploadVideo = uploadVideoo.fields([{ name: "video", maxCount: 1 }]);

router.post("/image", uploadImage, controller.image);

router.post("/video", uploadVideo, controller.video);

export default router;
