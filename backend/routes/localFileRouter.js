import { Router } from 'express';
import multer from 'multer';

const router = Router();

// hvor filer skal ligge
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");   // gem i backend/uploads/
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// modtager filen som form-data
router.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // URL til hvor billedet ligger
    const publicUrl = `http://localhost:8080/uploads/${req.file.filename}`;

    res.json({ url: publicUrl });
});



export default router;