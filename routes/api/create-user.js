module.exports = (req, res, next) => {
  const errors = [];
  const body = _.pick(req.body, ['username', 'first_name', 'last_name', 'email', 'password']);
  body.email = _.trim(body.email);
  body.email_normalized = validator.normalizeEmail(body.email);

  async.auto({
    validate: (cb) => {
      if (!validator.isEmail(body.email)) {
        errors.push({ field: 'email', msg: 'Por favor, escribe una dirección de correo válida.' });
      }
      if (!body.password) {
        errors.push({ field: 'password', msg: `La contraseña debe tener al menos ${global.minPassword} caracteres.` });
      }
      if (body.password && body.password.length < global.minPassword) {
        errors.push({ field: 'password', msg: `La contraseña debe tener al menos ${global.minPassword} caracteres.` });
      }
      if ((_.get(body, 'first_name') || '').length < 3) {
        errors.push({ field: 'first_name', msg: 'Debe escribir un nombre válido' });
      }
      if ((_.get(body, 'last_name') || '').length < 3) {
        errors.push({ field: 'last_name', msg: 'Debe escribir un apellido válido' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.User
        .findAll({ where: { email_normalized: body.email_normalized } })
        .then((docs) => { cb(null, docs); }, cb);
    }],
    check: ['query', (results, cb) => {
      if (results.query.length) {
        errors.push({ field: 'email', msg: 'email must be unique' });
        return cb(listErrors(409, null, errors));
      }
      cb();
    }],
    create: ['check', (_results, cb) => {
      models.User
        .create(body)
        .then((doc) => { cb(null, _.pick(doc, ['username', 'first_name', 'last_name', 'email'])); }, cb);
    }]
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(201).send(results.create);
  });
};
