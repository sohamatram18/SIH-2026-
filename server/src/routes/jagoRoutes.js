import express from 'express';
import { handleChatQuery, getSuggestedPrompts, getKnowledgeOverview } from '../controllers/jagoController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/query', optionalAuth, handleChatQuery);
router.get('/suggestions', optionalAuth, getSuggestedPrompts);
router.get('/knowledge', getKnowledgeOverview);

export default router;
