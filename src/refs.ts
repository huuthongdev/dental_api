
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
import { Product } from './models/product.model';
import { ServiceMeta } from './models/service-meta.model';
// Types
import { Role, AccessorieItem } from './types';
// Services
import { CreateUserService } from './services/user/create-user.service';
import { LoginService } from './services/user/log-in.service';
import { ChangePasswordService } from './services/user/change-password.service';
import { CreateBranchService } from './services/branch/create-branch.service';
import { ModifiedService } from './services/modified/modified.service';
import { UpdateBranchService } from './services/branch/update-branch.service';
import { DisableAndRemoveBranchService } from './services/branch/disable-and-remove-branch.service';
import { SetRoleInBranchService } from './services/user/role-in-branch/set-role-in-branch.service';
import { GetUserInfo } from './services/user/get-user-info.service';
import { CreateService } from './services/service/create-service.service';
// Middlewares
import { onError } from './routes/middlewares/on-error.middleware';
import { mustBeUser } from './routes/middlewares/must-be-user.middleware';
// Routes
import { userRouter } from './routes/user.route';
import { branchRouter } from './routes/branch.route';
import { serviceRouter } from './routes/service.route';
import { app } from './app';
// Databases
import { connectDatabase } from './database/connect-database';
import { initDatabase } from './database/init-database';
// Errors
import { BranchError } from './services/branch/branch.errors';
import { UserError } from './services/user/user.errors';
import { RoleInBranchError } from './services/user/role-in-branch/role-in-branch.errors';
import { Service } from './models/service.model';
import { ProductMeta } from './models/product-meta.model';
import { ServiceError } from './services/service/service.errors';

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
export { Product }
export { Service }
export { ServiceMeta }
export { ProductMeta }
// Types
export { Role, AccessorieItem }
// Services
export { CreateUserService }
export { LoginService }
export { ModifiedService }
export { ChangePasswordService }
export { CreateBranchService }
export { UpdateBranchService }
export { DisableAndRemoveBranchService }
export { SetRoleInBranchService }
export { GetUserInfo }
export { CreateService }
// Middlewares
export { onError }
export { mustBeUser }
// Routes
export { userRouter }
export { branchRouter }
export { serviceRouter }
export { app }
// Databases
export { connectDatabase }
export { initDatabase }
// Errors
export { BranchError }
export { UserError }
export { RoleInBranchError }
export { ServiceError }