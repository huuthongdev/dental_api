
// ======================= IMPORT =======================
// Settings
import { DATABASE_URI, FRONT_END_URL, JWT_TOKEN_SECRET_KEY, ROOT_NAME, DEFAULT_PASSWORD, SERVER_URL, ROOT_EMAIL, ROOT_PHONE } from './setting';
// Utils
import { ServerError } from './utils/server-error';
import { makeSure, mustExist, mustBeObjectId, mustMatchReg } from './utils/asserts';
import { verifyLogInToken, createToken } from './utils/jwt';
import { validateEmail } from './utils/validate';
// Models
import { User } from './models/user.model';
import { Branch } from './models/branch.model';
import { RoleInBranch } from './models/role-in-branch.model';
// Types
import { Role } from './types';
// Services
import { CreateUserService } from './services/user/create-user.service';
import { LoginService } from './services/user/log-in.service';
import { ChangePasswordService } from './services/user/change-password.service';
import { CreateBranchService } from './services/branch/create-branch.service';
import { ModifiedService } from './services/modified/modified.service';
import { UpdateBranchService } from './services/branch/update-branch.service';
import { DisableAndRemoveBranchService } from './services/branch/disable-and-remove-branch.service';
// Middlewares
import { onError } from './routes/middlewares/on-error.middleware';
import { mustBeUser } from './routes/middlewares/must-be-user.middleware';
// Routes
import { userRouter } from './routes/user.route';
import { branchRouter } from './routes/branch.route';
import { app } from './app';
// Databases
import { connectDatabase } from './database/connect-database';
import { initDatabase } from './database/init-database';
// Errors
import { BranchError } from './services/branch/branch.errors';
import { UserError } from './services/user/user.errors';

// ======================= EXPORT =======================
// Settings
export { DATABASE_URI, FRONT_END_URL, JWT_TOKEN_SECRET_KEY, ROOT_NAME, DEFAULT_PASSWORD, SERVER_URL, ROOT_EMAIL, ROOT_PHONE }
// Utils
export { ServerError }
export { makeSure, mustExist, mustBeObjectId, mustMatchReg }
export { verifyLogInToken, createToken }
export { validateEmail }
// Models
export { User }
export { Branch }
export { RoleInBranch }
// Types
export { Role }
// Services
export { CreateUserService }
export { LoginService }
export { ModifiedService }
export { ChangePasswordService }
export { CreateBranchService }
export { UpdateBranchService }
export { DisableAndRemoveBranchService }
// Middlewares
export { onError }
export { mustBeUser }
// Routes
export { userRouter }
export { branchRouter }
export { app }
// Databases
export { connectDatabase }
export { initDatabase }
// Errors
export { BranchError }
export { UserError }



