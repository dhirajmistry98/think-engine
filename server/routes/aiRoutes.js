import express from "express";
import { auth } from "../middleware/auth.js";
import { 
  generateArticle, 
  generateBlogTitle, 
  generateImage, 
  removeImageBackground, 
  removeImageObject, 
  resumeReview,
  fixCode 
} from "../controllers/aiController.js";
import { upload } from "../configs/multer.js";

const aiRouter = express.Router();

// Apply auth middleware to all AI routes
aiRouter.use(auth);

aiRouter.post('/generate-article', generateArticle);
aiRouter.post('/generate-blog-title', generateBlogTitle);
aiRouter.post('/generate-image', generateImage);
aiRouter.post('/remove-image-background', upload.single('image'), removeImageBackground);
aiRouter.post('/remove-image-object', upload.single('image'), removeImageObject);
aiRouter.post('/resume-review', upload.single('resume'), resumeReview);
aiRouter.post('/code/fix', fixCode);

export default aiRouter;
