import sql from "../configs/db.js";


export const getUserCreations = async (req, res) => {
  try {
    const userId = req.userId
    const  creations = await sql`
        SELECT * 
        FROM creations 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC
      `;
      res.json({success : true,creations})
    } catch (error) {
     res.json({success : false, message: error.message});
    }

  };


export const getPublishedCreations = async (req, res) => {
  try {
    const creations =
      await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
    res.json({ success: true, creations});
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const toggleLikeCreation = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;
    if (!creation) {
      return res.json({ success: false, message: "Creation not found" }); 
    }

    const currentLikes = creation.likes; 
    const userIdStr = userId.toString();
    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((user) => user != userIdStr);
      message = 'Creation Unliked';
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = 'Creation Liked'; 
    }

    const formattedArray = `{${updatedLikes.join(',')}}`;  // Fixed: json -> join
    await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`; // Fixed: like -> likes
    res.json({ success: true, message });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getUserCodeFixes = async (req, res) => {
  try {
    const userId = req.userId;
    const codeFixes = await sql`
      SELECT 
        id, 
        language, 
        original_code, 
        content as fixed_code, 
        explanation, 
        quality_score, 
        issues_found, 
        created_at,
        updated_at
      FROM creations 
      WHERE user_id = ${userId} AND type = 'code-fix' 
      ORDER BY created_at DESC
    `;
    res.json({ success: true, data: codeFixes });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getCodeFixById = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const [codeFix] = await sql`
      SELECT 
        id, 
        language, 
        original_code, 
        content as fixed_code, 
        explanation, 
        quality_score, 
        issues_found, 
        created_at,
        updated_at
      FROM creations 
      WHERE id = ${id} AND user_id = ${userId} AND type = 'code-fix'
    `;

    if (!codeFix) {
      return res.json({ success: false, message: "Code fix not found" });
    }

    res.json({ success: true, data: codeFix });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getCodeQualityStats = async (req, res) => {
  try {
    const userId = req.userId;
    
    const stats = await sql`
      SELECT 
        language,
        COUNT(*) as total_fixes,
        AVG(quality_score) as avg_quality_score,
        MIN(quality_score) as min_quality_score,
        MAX(quality_score) as max_quality_score
      FROM creations 
      WHERE user_id = ${userId} AND type = 'code-fix' AND quality_score IS NOT NULL
      GROUP BY language
      ORDER BY total_fixes DESC
    `;

    const overallStats = await sql`
      SELECT 
        COUNT(*) as total_code_fixes,
        AVG(quality_score) as overall_avg_quality,
        COUNT(CASE WHEN quality_score >= 80 THEN 1 END) as high_quality_fixes,
        COUNT(CASE WHEN quality_score < 60 THEN 1 END) as low_quality_fixes
      FROM creations 
      WHERE user_id = ${userId} AND type = 'code-fix' AND quality_score IS NOT NULL
    `;

    res.json({ 
      success: true, 
      data: {
        languageStats: stats,
        overallStats: overallStats[0] || {}
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getRecentCodeFixes = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 5 } = req.query;

    const recentFixes = await sql`
      SELECT 
        id,
        language,
        quality_score,
        created_at,
        SUBSTRING(original_code, 1, 100) as code_preview
      FROM creations 
      WHERE user_id = ${userId} AND type = 'code-fix'
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    res.json({ success: true, data: recentFixes });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteCodeFix = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;


    const [codeFix] = await sql`
      SELECT id FROM creations 
      WHERE id = ${id} AND user_id = ${userId} AND type = 'code-fix'
    `;

    if (!codeFix) {
      return res.json({ success: false, message: "Code fix not found or access denied" });
    }

    await sql`DELETE FROM creations WHERE id = ${id} AND user_id = ${userId} AND type = 'code-fix'`;
    res.json({ success: true, message: "Code fix deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const searchCodeFixes = async (req, res) => {
  try {
    const userId = req.userId;
    const { language, minQuality, maxQuality, search } = req.query;

    let query = sql`
      SELECT 
        id, 
        language, 
        quality_score, 
        created_at,
        SUBSTRING(original_code, 1, 100) as code_preview,
        SUBSTRING(explanation, 1, 200) as explanation_preview
      FROM creations 
      WHERE user_id = ${userId} AND type = 'code-fix'
    `;

    // Build dynamic filters
    const conditions = [];
    const params = [];

    if (language) {
      conditions.push(`language = $${params.length + 1}`);
      params.push(language);
    }

    if (minQuality) {
      conditions.push(`quality_score >= $${params.length + 1}`);
      params.push(parseInt(minQuality));
    }

    if (maxQuality) {
      conditions.push(`quality_score <= $${params.length + 1}`);
      params.push(parseInt(maxQuality));
    }

    if (search) {
      conditions.push(`(original_code ILIKE $${params.length + 1} OR explanation ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    // For dynamic queries, we need to construct the SQL differently
    let sqlQuery = `
      SELECT 
        id, 
        language, 
        quality_score, 
        created_at,
        SUBSTRING(original_code, 1, 100) as code_preview,
        SUBSTRING(explanation, 1, 200) as explanation_preview
      FROM creations 
      WHERE user_id = $1 AND type = 'code-fix'
    `;

    const queryParams = [userId];
    let paramIndex = 2;

    if (language) {
      sqlQuery += ` AND language = $${paramIndex}`;
      queryParams.push(language);
      paramIndex++;
    }

    if (minQuality) {
      sqlQuery += ` AND quality_score >= $${paramIndex}`;
      queryParams.push(parseInt(minQuality));
      paramIndex++;
    }

    if (maxQuality) {
      sqlQuery += ` AND quality_score <= $${paramIndex}`;
      queryParams.push(parseInt(maxQuality));
      paramIndex++;
    }

    if (search) {
      sqlQuery += ` AND (original_code ILIKE $${paramIndex} OR explanation ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    sqlQuery += ` ORDER BY created_at DESC`;

    const results = await sql.unsafe(sqlQuery, queryParams);
    res.json({ success: true, data: results });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};