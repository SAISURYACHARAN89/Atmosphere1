// Simple auth stub - replace with JWT or supabase validation
module.exports = async function auth(req, res, next) {
    // Example: check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();
    // Bearer <token> expected; in real implementation verify JWT or lookup session
    req.user = { id: 'anonymous' };
    next();
};
