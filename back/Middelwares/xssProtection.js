/**
 * Custom XSS Protection Middleware (Express v5 Compatible)
 * 
 * This middleware sanitizes user input to prevent XSS attacks.
 * It's compatible with Express v5 where req.query is read-only.
 */

const xss = require('xss');

/**
 * Recursively sanitize an object's values
 */
const sanitizeValue = (value) => {
    if (typeof value === 'string') {
        // Remove potentially dangerous HTML/JS
        return xss(value);
    }

    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }

    if (value && typeof value === 'object') {
        const sanitized = {};
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                sanitized[key] = sanitizeValue(value[key]);
            }
        }
        return sanitized;
    }

    return value;
};

/**
 * XSS Protection Middleware
 */
const xssProtection = (req, res, next) => {
    try {
        // Sanitize req.body (mutable)
        if (req.body && typeof req.body === 'object') {
            req.body = sanitizeValue(req.body);
        }

        // Sanitize req.params (mutable)
        if (req.params && typeof req.params === 'object') {
            for (const key in req.params) {
                if (req.params.hasOwnProperty(key)) {
                    req.params[key] = sanitizeValue(req.params[key]);
                }
            }
        }

        // For req.query (read-only in Express v5), create a sanitized copy
        // Store it in req.sanitizedQuery for use in controllers if needed
        if (req.query && typeof req.query === 'object') {
            req.sanitizedQuery = sanitizeValue({ ...req.query });
        }

        next();
    } catch (error) {
        console.error('XSS Protection Error:', error);
        next(); // Continue even if sanitization fails
    }
};

module.exports = xssProtection;
