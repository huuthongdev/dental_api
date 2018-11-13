const nameProject = 'Dental';

interface ServerConfig {
    DATABASE_URI: string;
    FRONT_END_URL: string;
    JWT_TOKEN_SECRET_KEY: string;
    ROOT_NAME: string;
    ROOT_EMAIL: string;
    ROOT_PHONE: string;
    DEFAULT_PASSWORD: string;
    SERVER_URL: string;
    SHOULD_KEEP_ALIVE?: boolean;
    SID_START_AT: number;
    BRANCH_MASTER_NAME: string;
}

const testingConfig: ServerConfig = {
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
}

const developmentConfig: ServerConfig = {
    DATABASE_URI: `mongodb://localhost/${nameProject.toLowerCase()}`,
    // DATABASE_URI: 'mongodb://huuthongdev:dentalapplication@huuthongdev-shard-00-00-gumev.mongodb.net:27017,huuthongdev-shard-00-01-gumev.mongodb.net:27017,huuthongdev-shard-00-02-gumev.mongodb.net:27017/test?ssl=true&replicaSet=huuthongdev-shard-0&authSource=admin&retryWrites=true',
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

const staggingConfig: ServerConfig = {
    DATABASE_URI: '',
    FRONT_END_URL: 'http://localhost:3000',
    JWT_TOKEN_SECRET_KEY: 'abc123',
    ROOT_EMAIL: 'admin@gmail.com',
    ROOT_PHONE: '0908508136',
    ROOT_NAME: 'admin',
    DEFAULT_PASSWORD: 'admin',
    SERVER_URL: 'https://api-kpibsc.herokuapp.com',
    SID_START_AT: 10000,
    BRANCH_MASTER_NAME: 'Branch Name'
}

// TODO update production config to run in production mode
// const productionConfig: ServerConfig = {};

function getConfig(): ServerConfig {
    if (process.env.NODE_ENV === 'test') return testingConfig;
    if (process.env.NODE_ENV === 'production') return staggingConfig;
    return developmentConfig;
}

export const { ROOT_EMAIL, ROOT_PHONE, DATABASE_URI, FRONT_END_URL, JWT_TOKEN_SECRET_KEY, ROOT_NAME, DEFAULT_PASSWORD, SERVER_URL, SHOULD_KEEP_ALIVE, SID_START_AT, BRANCH_MASTER_NAME } = getConfig();
