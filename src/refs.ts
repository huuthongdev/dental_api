
// settings
export { DATABASE_URI, FRONT_END_URL, JWT_TOKEN_SECRET_KEY, ROOT_NAME, DEFAULT_PASSWORD, SERVER_URL, ROOT_EMAIL, ROOT_PHONE } from './setting';
// utils
export { ServerError } from './utils/server-error';
export { makeSure, mustExist, mustBeObjectId, mustMatchReg } from './utils/asserts';
export { verifyLogInToken, createToken } from './utils/jwt';
export { validateEmail } from './utils/validate';
// models
export { User } from './models/user.model';
// types
export { Role } from './types';
// services
export { CreateUserService } from './services/user/create-user.service';
export { LoginService } from './services/user/log-in.service';

// middlewares
export { onError } from './routes/middlewares/on-error.middleware';
export { mustBeUser } from './routes/middlewares/must-be-user.middleware';
// routes
export { userRouter } from './routes/user.route';

export { app } from './app';
// databases
export { connectDatabase } from './database/connect-database';
export { initDatabase } from './database/init-database';
