import { Router } from 'express';
import { getUploadUrl } from "../utils/fileUpload.js";
import { isLoggedIn } from "../middleware/auth.js";

const router = Router();

router.get("/upload-url/:filename", isLoggedIn, async (req, res) => {
    try {
        const url = await getUploadUrl(req.params.filename);
        res.send({ url });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Kunne ikke genererer url til uploaded fil" });
    }
});

export default router;