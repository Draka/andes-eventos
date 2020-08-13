const { Sequelize, DataTypes } = require('sequelize');

const bcrypt = require('bcrypt-nodejs');

function hash(obj, key) {
  return new Promise((resolve, reject) => {
    if (!obj[key]) {
      resolve();
    }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return reject(err);
      }
      bcrypt.hash(obj[key], salt, null, (err, hash) => {
        if (err) {
          return reject(err);
        }
        obj[key] = hash;
        resolve();
      });
    });
  });
}

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isAlphanumeric: {
        msg: 'Números y letras son permitidos.'
      }
    }
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email_normalized: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'No es un email válido.'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  underscored: true
});

User.beforeCreate(async (user) => {
  await hash(user, 'password');
});

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true

module.exports = User;
