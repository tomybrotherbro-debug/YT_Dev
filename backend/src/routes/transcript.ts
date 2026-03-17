import { Router } from 'express';
import { getTranscript, summarize } from '../controllers/transcriptController.js';

export const transcriptRouter = Router();

transcriptRouter.post('/transcript', getTranscript);
transcriptRouter.post('/summarize', summarize);

