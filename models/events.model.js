const { Sequelize, DataTypes } = require('sequelize');

const User = require('./users.model');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  event_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  event_category: {
    type: DataTypes.ENUM,
    values: ['CONFERENCE', 'CURSE', 'SEMINAR', 'CONGRESS'],
    allowNull: false,
    validate: { is: /^(CONFERENCE|COURSE|SEMINAR|CONGRESS)$/g }
  },
  event_place: {
    type: DataTypes.STRING,
    allowNull: false
  },
  event_address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  event_initial_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  event_final_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  event_type: {
    type: DataTypes.ENUM,
    values: ['VIRTUAL'],
    allowNull: false,
    validate: { is: /^(VIRTUAL)$/g }
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  underscored: true
});

User.hasMany(Event);
Event.belongsTo(User, {
  foreignKey: 'user_id'
});

// `sequelize.define` also returns the model
console.log(Event === sequelize.models.Event); // true

module.exports = Event;
