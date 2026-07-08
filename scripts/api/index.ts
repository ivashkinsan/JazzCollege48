import { Router } from 'express';
import achievementsRouter from './achievements.routes.ts';
import graduatesRouter from './graduates.routes.ts';
import videosRouter from './videos.routes.ts';
import libraryRouter from './library.routes.ts';
import contentRouter from './content.routes.ts';

const router = Router();

router.use(achievementsRouter);
router.use(graduatesRouter);
router.use(videosRouter);
router.use(libraryRouter);
router.use(contentRouter);

export default router;
