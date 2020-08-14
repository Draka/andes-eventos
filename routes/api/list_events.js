module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => {
      cb();
    },
    query: ['validate', (results, cb) => {
      models.Event
        .findAll({
          where: { user_id: req.user.id },
          attributes: ['id', 'event_name', 'event_category', 'event_place', 'event_address', 'event_initial_date', 'event_final_date', 'event_type', 'thumbnail'],
          order: [
            ['created_at', 'DESC'],
          ],
        })
        .then((doc) => { cb(null, doc); }, cb);
    }]
  }, (err, results) => {
    if (err) {
      return next(err);
    } if (!results.query) {
      return listErrors(404, res);
    }
    res.send(results.query);
  });
};
