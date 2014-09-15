var path = require('path'),
    rootPath = path.normalize(__dirname ),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    port: 3000,
    db: process.env.DB_URL || 'mongodb://localhost/scheduler'
  },

  test: {
    root: rootPath,
    port: 80,
    db: process.env.DB_URL || 'mongodb://localhost/scheduler'
  },

  production: {
    root: rootPath,
    port: process.env.OPENSHIFT_NODEJS_PORT || 3000,
    db: process.env.DB_URL || 'mongodb://localhost/scheduler'
  }
};

module.exports = config[env];
