import path from 'path';
import merge from 'lodash/merge';

// Default configuations applied to all environments
const defaultConfig = {
  env: process.env.NODE_ENV,
  get envs() {
    return {
      test: process.env.NODE_ENV === 'test',
      development: process.env.NODE_ENV === 'development',
      production: process.env.NODE_ENV === 'production',
    };
  },

  version: require('../../package.json').version,
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 5000,
  ip: process.env.IP || '0.0.0.0',
  apiPrefix: '', // Could be /api/resource or /api/v2/resource
  userRoles: ['user', 'admin', 'family', 'designated'],

  /**
   * MongoDB configuration options
   */
  mongo: {
    seed: true,
    options: {
      db: {
        safe: true,
      },
    },
  },

  /**
   * Security configuation options regarding sessions, authentication and hashing
   */
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'i-am-the-secret-key-of-coding-exercise',
    sessionExpiration: process.env.SESSION_EXPIRATION || '365d', // 365 days
    saltRounds: process.env.SALT_ROUNDS || 12,
  },
  messages: {
    inValidCredentials: 'Invalid Credentials',
    userNotFound: 'User Not Found!',
    taskNotFound: 'Task Not Found!',
    userExist: 'User Already Exist!',
    success: 'success!',
    inValidToken: 'Token is not valid!',
    noToken: 'No token, authorization denied!',
    authorization: 'Authorization',
    accessDenied: 'Access denied. No permission to access!',
  },
};

// Environment specific overrides
const environmentConfigs = {
  development: {
    mongo: {
      uri: process.env.MONGO_URI || 'mongodb+srv://test:test@cluster0.ezm89.mongodb.net/Cluster0?retryWrites=true&w=majority',
    },
    security: {
      saltRounds: 4,
    },
  },
  test: {
    port: 27017,
    mongo: {
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017/mgs_db',
    },
    security: {
      saltRounds: 4,
    },
  },
  production: {
    mongo: {
      seed: false,
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017/mgs_db',
    },
  },
};

// Recursively merge configurations
export default merge(defaultConfig, environmentConfigs[process.env.NODE_ENV] || {});
