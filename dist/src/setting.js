"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const nameProject = 'Dental';
const testingConfig = {
    DATABASE_URI: `mongodb://localhost/${nameProject.toLowerCase()}-test`,
    FRONT_END_URL: '',
    SERVER_URL: 'http://localhost:4000',
    JWT_TOKEN_SECRET_KEY: 'abc123',
    ROOT_NAME: 'admin',
    ROOT_EMAIL: 'admin@gmail.com',
    ROOT_PHONE: '0908508136',
    DEFAULT_PASSWORD: 'admin',
    SID_START_AT: 10000,
    BRANCH_MASTER_NAME: 'Branch Name'
};
const developmentConfig = {
    DATABASE_URI: `mongodb://localhost/${nameProject.toLowerCase()}`,
    // DATABASE_URI: "mongodb://dental:dental123@ds211635.mlab.com:11635/dental_test",
    FRONT_END_URL: 'http://localhost:3000',
    JWT_TOKEN_SECRET_KEY: 'abc123',
    ROOT_NAME: 'admin',
    ROOT_EMAIL: 'admin@gmail.com',
    ROOT_PHONE: '0908508136',
    DEFAULT_PASSWORD: 'admin',
    SERVER_URL: 'http://localhost:4000',
    SID_START_AT: 10000,
    BRANCH_MASTER_NAME: 'Branch Name'
};
const staggingConfig = {
    DATABASE_URI: 'mongodb://dental:dental123@ds211635.mlab.com:11635/dental_test',
    FRONT_END_URL: 'http://localhost:3000',
    JWT_TOKEN_SECRET_KEY: 'dentalapplicationjwttokensecretkey@289917554876',
    ROOT_EMAIL: 'admin@gmail.com',
    ROOT_PHONE: '0908508136',
    ROOT_NAME: 'admin',
    DEFAULT_PASSWORD: 'admin',
    SERVER_URL: 'https://dentalapi.herokuapp.com',
    SID_START_AT: 10000,
    BRANCH_MASTER_NAME: 'Branch Name'
};
// TODO update production config to run in production mode
// const productionConfig: ServerConfig = {};
function getConfig() {
    if (process.env.NODE_ENV === 'test')
        return testingConfig;
    if (process.env.NODE_ENV === 'production')
        return staggingConfig;
    return developmentConfig;
}
_a = getConfig(), exports.ROOT_EMAIL = _a.ROOT_EMAIL, exports.ROOT_PHONE = _a.ROOT_PHONE, exports.DATABASE_URI = _a.DATABASE_URI, exports.FRONT_END_URL = _a.FRONT_END_URL, exports.JWT_TOKEN_SECRET_KEY = _a.JWT_TOKEN_SECRET_KEY, exports.ROOT_NAME = _a.ROOT_NAME, exports.DEFAULT_PASSWORD = _a.DEFAULT_PASSWORD, exports.SERVER_URL = _a.SERVER_URL, exports.SHOULD_KEEP_ALIVE = _a.SHOULD_KEEP_ALIVE, exports.SID_START_AT = _a.SID_START_AT, exports.BRANCH_MASTER_NAME = _a.BRANCH_MASTER_NAME;
