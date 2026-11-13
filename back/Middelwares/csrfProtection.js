const createCsrfProtection = (allowedOrigins) => (req, res, next) => {
  const method = req.method.toUpperCase();

  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return next();
  }

  const origin = req.headers.origin || req.headers.referer;
  const hasAuthCookie = Boolean(req.cookies?.accessToken || req.cookies?.refreshToken);

  if (!origin && hasAuthCookie) {
    return res.status(403).json({
      message: 'CSRF protection: request origin is required',
      code: 'CSRF_ORIGIN_REQUIRED',
    });
  }

  if (!origin) return next();

  try {
    const requestOrigin = new URL(origin).origin;
    if (!allowedOrigins.includes(requestOrigin)) {
      return res.status(403).json({
        message: 'CSRF protection: request origin not authorized',
        code: 'CSRF_ORIGIN_NOT_ALLOWED',
      });
    }
  } catch {
    return res.status(403).json({
      message: 'Invalid request origin',
      code: 'CSRF_ORIGIN_INVALID',
    });
  }

  return next();
};

module.exports = createCsrfProtection;
