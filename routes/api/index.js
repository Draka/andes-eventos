module.exports = (app) => {
  app.post('/api/create-user/', require('./create-user'));
  app.post('/api/api-auth/', require('./api-auth'));
  app.get('/api/events/', checkAuth, require('./list_events'));
  app.get('/api/events/:id', checkAuth, require('./get_events'));
  app.post('/api/events/', checkAuth, require('./post_events'));
  app.put('/api/events/:id', checkAuth, require('./put_events'));
  app.delete('/api/events/:id', checkAuth, require('./delete_events'));
};
