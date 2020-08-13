module.exports = (req, res, next) => {
  const body = _.pick(req.body, ['event_name', 'event_category', 'event_place', 'event_address', 'event_initial_date', 'event_final_date', 'event_type', 'thumbnail']);
  body.user_id = req.user.id;

  async.auto({
    validate: (cb) => {
      cb();
    },
    create: ['validate', (_results, cb) => {
      models.Event
        .create(body)
        .then((doc) => { cb(null, _.pick(doc, ['id', 'event_name', 'event_category', 'event_place', 'event_address', 'event_initial_date', 'event_final_date', 'event_type', 'thumbnail'])); }, cb);
    }]
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(201).send(results.create);
  });
};
