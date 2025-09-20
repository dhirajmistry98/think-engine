import { clerkClient, getAuth } from "@clerk/express";

export const auth = [
  async (req, res, next) => {
    try {
      // Get auth from request using getAuth
      const { userId, sessionClaims } = getAuth(req);
      
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required. Please login.' 
        });
      }

      console.log('=== AUTH MIDDLEWARE DEBUG ===');
      console.log('User ID:', userId);
      console.log('Session Claims:', JSON.stringify(sessionClaims, null, 2));

      // Get user data from Clerk
      const user = await clerkClient.users.getUser(userId);
      console.log('User Public Metadata:', JSON.stringify(user.publicMetadata, null, 2));

      // CHECK FOR PREMIUM PLAN IN MULTIPLE WAYS:
      // 1. Check session claims 'pla' field (this is where Clerk stores it)
      const hasPremiumFromPla = sessionClaims?.pla === "u:premium";
      // 2. Check publicMetadata.plan (backup method)
      const hasPremiumFromMetadata = sessionClaims?.publicMetadata?.plan === "premium" || user.publicMetadata?.plan === "premium";

      console.log('Premium from PLA field:', hasPremiumFromPla);
      console.log('Premium from metadata:', hasPremiumFromMetadata);

      // Use either method to detect premium
      const hasPremiumPlan = hasPremiumFromPla || hasPremiumFromMetadata;

      if (!hasPremiumPlan && user.privateMetadata?.free_usage != null) {
        req.free_usage = user.privateMetadata.free_usage;
      } else if (!hasPremiumPlan) {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: {
            free_usage: 0,
          },
        });
        req.free_usage = 0;
      } else {
        req.free_usage = 0; // Premium users don't have usage limits
      }

      req.plan = hasPremiumPlan ? "premium" : "free";
      req.userId = userId; // Add userId to req for easier access

      console.log('Final detected plan:', req.plan);
      console.log('Final free usage:', req.free_usage);
      console.log('=== END AUTH MIDDLEWARE DEBUG ===');

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ 
        success: false, 
        message: 'Authentication failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
];