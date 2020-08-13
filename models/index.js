exports.User = require('./users.model');
exports.Event = require('./events.model');

sequelize.sync();
// sequelize.sync({ alter: true });
