import { Router } from "express";
import { createNote, getNotes, uploadImage, updateNote, deleteNote } from "../controllers/note.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
    .post(upload.array("images", 10), createNote)
    .get(getNotes);

router.route("/upload-image").post(upload.single("image"), uploadImage);

router.route("/:noteId")
    .patch(upload.array("images", 10), updateNote)
    .delete(deleteNote);

export default router;
