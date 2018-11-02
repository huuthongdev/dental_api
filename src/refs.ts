
// ======================= IMPORT =======================
// Settings
import { DATABASE_URI, FRONT_END_URL, JWT_TOKEN_SECRET_KEY, ROOT_NAME, DEFAULT_PASSWORD, SERVER_URL, ROOT_EMAIL, ROOT_PHONE, SID_START_AT, BRANCH_MASTER_NAME } from './setting';
// Utils
import { ServerError } from './utils/server-error';
import { makeSure, mustExist, mustBeObjectId, mustMatchReg } from './utils/asserts';
import { verifyLogInToken, createToken } from './utils/jwt';
import { validateEmail } from './utils/validate';
// Models
import { Client } from './models/client.model';
import { User } from './models/user.model';
import { Branch } from './models/branch.model';
import { RoleInBranch } from './models/role-in-branch.model';
import { Product, ProductItem } from './models/product.model';
import { ServiceMeta } from './models/service-meta.model';
import { Ticket, TicketItem, TicketStatus } from './models/ticket.model';
import { ReceiptVoucher, ReceiptVoucherType } from './models/receipt-voucher.model';
import { CalendarDentist, CalendarStatus } from './models/calendar-dentist.model';
// Types
import { Role, AccessorieItem, ModifieldTicketMessage } from './types';
// Services
import { ModifiedService } from './services/modified/modified.service';
import { CreateUserService } from './services/user/create-user.service';
import { LoginService } from './services/user/log-in.service';
import { ChangePasswordService } from './services/user/change-password.service';
import { GetAllBranchService } from './services/branch/get-all-branch.service';
import { CreateBranchService } from './services/branch/create-branch.service';
import { UpdateBranchService } from './services/branch/update-branch.service';
import { RemoveBranchService } from './services/branch/remove-branch.service';
import { GetAllUSerInCurrentBranch } from './services/branch/get-all-user-in-current-branch.service';
import { SetRoleInBranchService } from './services/user/role-in-branch/set-role-in-branch.service';
import { GetUserInfo } from './services/user/get-user-info.service';
import { CreateService } from './services/service/create-service.service';
import { UpdateService } from './services/service/update-service.service';
import { RemoveService } from './services/service/remove-service.service';
import { GetAllService } from './services/service/get-all-service.service';
import { CreateServiceMeta } from './services/service/create-service-meta.service';
import { CreateProductService } from './services/product/create-product.service';
import { UpdateProductService } from './services/product/update-product.service';
import { RemoveProductService } from './services/product/remove-product.service';
import { CreateClientService } from './services/client/create-client.service';
import { UpdateClientService } from './services/client/update-client.service';
import { RemoveClientService } from './services/client/remove-client.service';
import { TicketService } from './services/ticket/ticket.service';
import { CreateTicketService } from './services/ticket/create-ticket.service';
import { CheckRoleInBranchService } from './services/user/role-in-branch/check-role-in-branch.service';
import { UpdateTicketService } from './services/ticket/update-ticket.service';
import { CreateTicketReceiptVoucherService } from './services/receipt-voucher/create-ticket-receipt-voucher.service';
import { CreateCalendarDentistService } from './services/calendar-dentist/create-calendar-dentist.service';
import { ChangeStatusCalendarDentistService } from './services/calendar-dentist/change-status-calendar-dentist.service';
// Middlewares
import { onError } from './routes/middlewares/on-error.middleware';
import { mustBeUser } from './routes/middlewares/must-be-user.middleware';
// Routes
import { calendarDentistRouter } from './routes/calendar-dentist.route';
import { receiptVoucherRouter } from './routes/receipt-voucher.route';
import { productRouter } from './routes/product.route';
import { userRouter } from './routes/user.route';
import { branchRouter } from './routes/branch.route';
import { serviceRouter } from './routes/service.route';
import { clientRouter } from './routes/client.route';
import { ticketRouter } from './routes/ticket.route';
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
import { ClientError } from './services/client/client.errors';
import { TicketError } from './services/ticket/ticket.errors';
import { ReceiptVoucherError } from './services/receipt-voucher/receipt-voucher.errors';
import { CalendarDentistError } from './services/calendar-dentist/calendar-dentist.errors';
// Modified select
import { modifiedSelect } from './services/modified/modified-select.service';

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
export { Product, ProductItem }
export { Service }
export { ServiceMeta }
export { ProductMeta }
export { Client }
export { Ticket, TicketItem, TicketStatus }
export { ReceiptVoucher, ReceiptVoucherType }
export { CalendarDentist, CalendarStatus }
// Types
export { Role, AccessorieItem }
// Services
export { CreateUserService }
export { LoginService }
export { ModifiedService, ModifieldTicketMessage }
export { ChangePasswordService }
export { GetAllBranchService }
export { CreateBranchService }
export { UpdateBranchService }
export { RemoveBranchService }
export { SetRoleInBranchService }
export { CheckRoleInBranchService }
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
export { CreateClientService }
export { UpdateClientService }
export { RemoveClientService }
export { TicketService }
export { CreateTicketService }
export { UpdateTicketService }
export { CreateTicketReceiptVoucherService }
export { CreateCalendarDentistService }
export { ChangeStatusCalendarDentistService }
// Middlewares
export { onError }
export { mustBeUser }
// Routes
export { calendarDentistRouter }
export { receiptVoucherRouter }
export { productRouter }
export { userRouter }
export { branchRouter }
export { serviceRouter }
export { clientRouter }
export { ticketRouter }
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
export { ClientError }
export { TicketError }
export { ReceiptVoucherError }
export { CalendarDentistError }
// Modified Select
export { modifiedSelect }