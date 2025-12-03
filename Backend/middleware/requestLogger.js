module.exports = function requestLogger(req, res, next) {
    // basic request logging
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
};
