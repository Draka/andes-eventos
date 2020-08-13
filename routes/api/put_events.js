module.exports = (req, res, next) => {
  const body = _.pick(req.body, ['event_name', 'event_category', 'event_place', 'event_address', 'event_initial_date', 'event_final_date', 'event_type', 'thumbnail']);
  async.auto({
    validate: (cb) => {
      cb();
    },
    query: ['validate', (results, cb) => {
      models.Event
        .findOne({
          where: { id: req.params.id, user_id: req.user.id },
          attributes: ['id']
        })
        .then((doc) => { cb(null, doc); }, cb);
    }],
    update: ['query', (results, cb) => {
      models.Event
        .update(body, {
          where: { id: req.params.id, user_id: req.user.id }
        })
        .then((doc) => { cb(null, doc); }, cb);
    }],

  }, (err, results) => {
    if (err) {
      return next(err);
    } if (!results.query) {
      return listErrors(404, res);
    }
    body.id = req.params.id;
    res.status(202).send(body);
  });
};
