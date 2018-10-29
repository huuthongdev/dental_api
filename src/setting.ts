const nameProject = 'Dental';

interface ServerConfig {
    DATABASE_URI: string;
    FRONT_END_URL: string;
    JWT_TOKEN_SECRET_KEY: string;
    ROOT_USERNAME: string;
    DEFAULT_PASSWORD: string;
    SERVER_URL: string;
    SHOULD_KEEP_ALIVE?: boolean;
}

const testingConfig: ServerConfig = {
    DATABASE_URI: `mongodb://localhost/${nameProject.toLowerCase()}-test`,
    FRONT_END_URL: 'http://kpi-stagging.herokuapp.com',
    SERVER_URL: 'http://localhost:4000',
    JWT_TOKEN_SECRET_KEY: 'abc123',
    ROOT_USERNAME: 'admin',
    DEFAULT_PASSWORD: 'admin',
}

const developmentConfig: ServerConfig = {
    DATABASE_URI: `mongodb://localhost/${nameProject.toLowerCase()}`,
    FRONT_END_URL: 'http://localhost:3000',
    JWT_TOKEN_SECRET_KEY: 'abc123',
    ROOT_USERNAME: 'admin',
    DEFAULT_PASSWORD: 'admin',
    SERVER_URL: 'http://localhost:4000'
};

const staggingConfig: ServerConfig = {
    DATABASE_URI: '',
    FRONT_END_URL: 'http://localhost:3000',
    JWT_TOKEN_SECRET_KEY: 'abc123',
    ROOT_USERNAME: 'admin',
    DEFAULT_PASSWORD: 'admin',
    SERVER_URL: 'https://api-kpibsc.herokuapp.com'
}

// TODO update production config to run in production mode
// const productionConfig: ServerConfig = {};

function getConfig(): ServerConfig {
    if (process.env.NODE_ENV === 'test') return testingConfig;
    if (process.env.NODE_ENV === 'production') return staggingConfig;
    return developmentConfig;
}

export const { DATABASE_URI, FRONT_END_URL, JWT_TOKEN_SECRET_KEY, ROOT_USERNAME, DEFAULT_PASSWORD, SERVER_URL, SHOULD_KEEP_ALIVE } = getConfig();
