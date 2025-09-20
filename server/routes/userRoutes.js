import express from "express";
import { auth } from '../middleware/auth.js';
import { 
  deleteCodeFix, 
  getCodeFixById, 
  getCodeQualityStats, 
  getPublishedCreations, 
  getRecentCodeFixes, 
  getUserCodeFixes, 
  getUserCreations, 
  searchCodeFixes, 
  toggleLikeCreation 
} from "../controllers/userController.js";

const userRouter = express.Router();

// Apply auth middleware to all user routes
userRouter.use(auth);

userRouter.get('/get-user-creations', getUserCreations);
userRouter.get('/get-publish-creations', getPublishedCreations);
userRouter.post('/toggle-like-creation', toggleLikeCreation);
userRouter.get('/code-fixes', getUserCodeFixes);
userRouter.get('/code-fixes/:id', getCodeFixById);
userRouter.get('/code-quality-stats', getCodeQualityStats);
userRouter.get('/recent-code-fixes', getRecentCodeFixes);
userRouter.delete('/code-fixes/:id', deleteCodeFix);
userRouter.get('/search-code-fixes', searchCodeFixes);

export default userRouter;