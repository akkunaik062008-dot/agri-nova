import { supabaseAdmin, isSupabaseConfigured } from '../config/supabaseAdmin.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // In development / demo mode, grant demo session access
      if (!isSupabaseConfigured() || req.headers['x-demo-user']) {
        req.user = {
          id: req.headers['x-user-id'] || 'demo-farmer-id',
          email: 'farmer@agrivision.ai',
          full_name: 'Dr. Evelyn Vance (Chief Agronomist)',
          role: 'authenticated'
        };
        return next();
      }
      return res.status(401).json({
        success: false,
        error: 'Authorization header missing or invalid format. Bearer token required.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Check for demo token
    if (token === 'demo-token' || !isSupabaseConfigured()) {
      req.user = {
        id: req.headers['x-user-id'] || 'demo-farmer-id',
        email: 'farmer@agrivision.ai',
        full_name: 'Dr. Evelyn Vance (Chief Agronomist)',
        role: 'authenticated'
      };
      return next();
    }

    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired Supabase session token.',
        details: error?.message
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('[Auth Middleware Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal authentication verification error.'
    });
  }
};
