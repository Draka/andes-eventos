const jwt = require('jsonwebtoken');

function isAuthenticated(token) {
  try {
    return jwt.verify(token, config.keySecret);
  } catch (err) {
    return false;
  }
}

module.exports = (req, res, next) => {
  const token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || _.get(req, 'cookies.token');
  const payload = isAuthenticated(token);

  if (payload) {
    req.user = payload;
    res.locals.session = payload;
    return next();
  }
  next();
};
