import { Router } from 'express';
import { getUploadUrl } from '../utils/fileUpload.js';
import { isLoggedIn } from '../middleware/auth.js';

const router = Router();

router.get('/upload-url/:filename', isLoggedIn, async (req, res) => {
  try {
    const filename = req.params.filename;
    const url = await getUploadUrl(filename);

    res.send({ url });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Kunne ikke genererer url til uploaded fil' });
  }
  console.log('ENV TEST fra backend:', process.env.HETZNER_BUCKET, process.env.HETZNER_ENDPOINT);
});

export default router;
