module.exports = (app) => {
  /* GET pages/users listing. */

  app.get('/', (req, res) => {
    res.render('pages/index', { title: 'Eventos', js: 'home' });
  });
  app.get('/404', (req, res) => {
    res.render('pages/404', { title: 'Página no encontrada', js: 'home' });
  });
  app.get('/registro', (req, res) => {
    res.render('pages/users/signup', { title: 'Registrarse', js: 'home', description: '' });
  });
  app.get('/registro-confirmacion', (req, res) => {
    res.render('pages/users/signup_confirm', { title: 'Registrarse', js: 'home' });
  });
  // User
  app.get('/cerrar-sesion', (req, res) => {
    res.clearCookie('token');
    res.render('pages/users/logout', { title: 'Cerrar Sesión', js: 'home' });
  });

  // Eventos
  app.get('/editar-evento', (req, res) => {
    res.render('pages/events/edit', { title: 'Editar Evento', js: 'home' });
  });
  app.get('/nuevo-evento', (req, res) => {
    res.render('pages/events/new', { title: 'Nuevo Evento', js: 'home' });
  });
  app.get('/detalle-evento', (req, res) => {
    res.render('pages/events/view', { title: 'Detalle Evento', js: 'home' });
  });
};
