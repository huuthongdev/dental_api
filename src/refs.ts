
// ======================= IMPORT =======================
// Settings
import { DATABASE_URI, FRONT_END_URL, JWT_TOKEN_SECRET_KEY, ROOT_NAME, DEFAULT_PASSWORD, SERVER_URL, ROOT_EMAIL, ROOT_PHONE, SID_START_AT, BRANCH_MASTER_NAME } from './setting';
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
import { RemoveBranchService } from './services/branch/remove-branch.service';
import { SetRoleInBranchService } from './services/user/role-in-branch/set-role-in-branch.service';
import { GetUserInfo } from './services/user/get-user-info.service';
import { CreateService } from './services/service/create-service.service';
import { UpdateService } from './services/service/update-service.service';
import { GetAllService } from './services/service/get-all-service.service';
import { CreateServiceMeta } from './services/service/create-service-meta.service';
import { CreateProductService } from './services/product/create-product.service';
import { UpdateProductService } from './services/product/update-product.service';
import { RemoveProductService } from './services/product/remove-product.service';
import { GetAllUSerInCurrentBranch } from './services/branch/get-all-user-in-current-branch.service';
// Middlewares
import { onError } from './routes/middlewares/on-error.middleware';
import { mustBeUser, mustBeChairman, mustBeDirector } from './routes/middlewares/must-be-user.middleware';
// Routes
import { productRouter } from './routes/product.route';
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
import { ProductError } from './services/product/product.errors';
// Modified select
import { modifiedSelect } from './services/modified/modified-select.service';
import { RemoveService } from './services/service/remove-service.service';

// ======================= EXPORT =======================
// Settings
export { SID_START_AT, DATABASE_URI, FRONT_END_URL, JWT_TOKEN_SECRET_KEY, ROOT_NAME, DEFAULT_PASSWORD, SERVER_URL, ROOT_EMAIL, ROOT_PHONE, BRANCH_MASTER_NAME }
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
export { RemoveBranchService }
export { SetRoleInBranchService }
export { GetUserInfo }
export { CreateService }
export { UpdateService }
export { RemoveService }
export { GetAllService }
export { CreateServiceMeta }
export { CreateProductService }
export { UpdateProductService }
export { RemoveProductService }
export { GetAllUSerInCurrentBranch }
// Middlewares
export { onError }
export { mustBeUser, mustBeChairman, mustBeDirector }
// Routes
export { productRouter }
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
export { ProductError }
// Modified Select
export { modifiedSelect }