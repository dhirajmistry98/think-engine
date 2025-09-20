// server/controllers/aiController.js
import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import axios from "axios";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const userId = req.userId;
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash-exp",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations(user_id,prompt,content,type) VALUES(${userId},${prompt},${content},'article')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const userId = req.userId;
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash-exp",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations(user_id,prompt,content,type) VALUES(${userId},${prompt},${content},'blog-title')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateImage = async (req, res) => {
  try {
    const userId = req.userId;
    const { prompt, publish } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 5) {
      return res.json({
        success: false,
        message:
          "Free users can only generate 5 images. Upgrade to premium for unlimited access.",
      });
    }

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      { prompt },
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
        timeout: 30000,
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`INSERT INTO creations(user_id,prompt,content,type,publish) VALUES(${userId},${prompt},${secure_url},'image',${
      publish ?? false
    })`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const userId = req.userId;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql`INSERT INTO creations(user_id,prompt,content,type) VALUES(${userId},'Remove background from image',${secure_url},'image')`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const userId = req.userId;
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const image_Url = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql`INSERT INTO creations(user_id,prompt,content,type) VALUES(${userId},${`Removed ${object} from image`},${image_Url},'image')`;

    res.json({ success: true, content: image_Url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const userId = req.userId;
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file size exceeds allowed size(5MB).",
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash-exp",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations(user_id,prompt,content,type) VALUES(${userId},'Review the uploaded resume',${content},'resume-review')`;

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const fixCode = async (req, res) => {
  try {
    const userId = req.userId;
    const { code, language } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    if (!code || !code.trim()) {
      return res.json({
        success: false,
        message: "Code is required.",
      });
    }

    if (!language) {
      return res.json({
        success: false,
        message: "Programming language is required.",
      });
    }

    const analysisPrompt = `You are an expert code reviewer and debugger. Analyze the following ${language} code and provide a comprehensive response in JSON format with these exact keys:

1. "issues": An array of objects, each containing:
   - "type": "error", "warning", or "suggestion"
   - "message": Description of the issue
   - "line": Line number (estimate if needed)
   - "severity": "high", "medium", or "low"

2. "fixedCode": The corrected and optimized version of the code with proper formatting

3. "explanation": A clear explanation of what was wrong and how it was fixed

4. "qualityScore": A number from 0-100 representing the code quality after fixes

Original ${language} code:
\`\`\`${language}
${code}
\`\`\`

Please ensure the JSON is properly formatted and complete.`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash-exp",
      messages: [
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const aiResponse = response.choices[0].message.content;

    let parsedResponse;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.log("AI Response parsing failed:", parseError.message);
      parsedResponse = {
        issues: [
          {
            type: "info",
            message: "Code analysis completed",
            line: 1,
            severity: "low",
          },
        ],
        fixedCode: code,
        explanation: "AI provided general code review and suggestions.",
        qualityScore: 75,
      };
    }

    const safeResponse = {
      issues: parsedResponse.issues || [],
      fixedCode: parsedResponse.fixedCode || code,
      explanation:
        parsedResponse.explanation || "Code has been reviewed and optimized.",
      qualityScore: parsedResponse.qualityScore || 75,
    };

    await sql`
      INSERT INTO creations(
        user_id, 
        prompt, 
        content, 
        type, 
        language, 
        explanation, 
        quality_score, 
        original_code, 
        issues_found
      ) VALUES(
        ${userId},
        ${"Fix and optimize " + language + " code"},
        ${safeResponse.fixedCode},
        'code-fix',
        ${language},
        ${safeResponse.explanation},
        ${safeResponse.qualityScore},
        ${code},
        ${JSON.stringify(safeResponse.issues)}
      )
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({
      success: true,
      data: safeResponse,
    });
  } catch (error) {
    console.log("Code fix error:", error.message);
    res.json({
      success: false,
      message: "An error occurred while fixing the code. Please try again.",
    });
  }
};
