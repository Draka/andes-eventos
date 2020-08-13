const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

function comparePassword(password, field) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, field, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      resolve(isMatch);
    });
  });
}

function generateToken(user, secret) {
  const payload = {
    iss: 'localhost',
    id: user.id,
    iat: moment().unix(),
    exp: moment().add(1, 'years').unix()
  };
  return jwt.sign(payload, secret);
}

module.exports = (req, res, next) => {
  const errors = [];
  const body = _.pick(req.body, ['username', 'password']);
  body.username = _.trim(body.username);
  async.auto({
    validate: (cb) => {
      if (!body.password || body.password.length < global.minPassword) {
        errors.push({ field: 'password', msg: `La contraseña debe tener al menos ${global.minPassword} caracteres.` });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    query: ['validate', (results, cb) => {
      models.User
        .findOne({
          where: { username: body.username },
          attributes: ['id', 'password']
        })
        .then((doc) => { cb(null, doc); }, cb);
    }],
    token: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'username', msg: 'Usuario o Contraseña inválidos.' });
        return cb(listErrors(401, null, errors));
      }
      Promise.all(['password'].map((field) => comparePassword(req.body.password, results.query[field]))).then((rp) => {
        if (!rp[0] && !rp[1]) {
          errors.push({ field: 'username', msg: 'Usuario o Contraseña inválidos.' });
          return cb(listErrors(401, null, errors));
        }
        cb(null, generateToken(results.query, config.keySecret));
      }, (err) => cb(err));
    }]
  }, (err, results) => {
    if (err) {
      return next(err);
    } if (!results.query) {
      return listErrors(401, res);
    }
    res.send({ token: results.token });
  });
};
