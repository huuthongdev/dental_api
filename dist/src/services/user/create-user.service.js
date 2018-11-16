"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const refs_1 = require("../../refs");
const bcryptjs_1 = require("bcryptjs");
class CreateUserService {
    static validate(userId, name, email, phone, password, branchWorkId, branchRole) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(userId);
            // Check Exist
            refs_1.mustExist(name, refs_1.UserError.NAME_MUST_BE_PROVIDED);
            refs_1.mustExist(email, refs_1.UserError.EMAIL_MUST_BE_PROVIDED);
            refs_1.mustExist(phone, refs_1.UserError.PHONE_MUST_BE_PROVIDED);
            refs_1.mustExist(password, refs_1.UserError.PASSWORD_MUST_BE_PROVIDED);
            // Validate
            refs_1.makeSure(refs_1.validateEmail(email), refs_1.UserError.EMAIL_INCORRECT);
            // Check Unique
            const emailCount = yield refs_1.User.count({ email });
            refs_1.makeSure(emailCount === 0, refs_1.UserError.EMAIL_IS_EXISTED);
            const phoneCount = yield refs_1.User.count({ phone });
            refs_1.makeSure(phoneCount === 0, refs_1.UserError.PHONE_IS_EXISTED);
            // Check Role
            if (branchWorkId && branchRole) {
                const { ACCOUNTANT, ACCOUNTING_MANAGER, ADMIN, DIRECTOR, CUSTOMER_CARE, CUSTOMER_CARE_MANAGER, X_RAY, DENTISTS_MANAGER, DENTIST } = refs_1.Role;
                const rolesArr = [ACCOUNTANT, ACCOUNTING_MANAGER, ADMIN, DIRECTOR, CUSTOMER_CARE, CUSTOMER_CARE_MANAGER, X_RAY, DENTISTS_MANAGER, DENTIST];
                refs_1.makeSure(rolesArr.includes(branchRole), refs_1.RoleInBranchError.INVALID_ROLE);
                const branchWork = yield refs_1.Branch.findById(branchWorkId);
                refs_1.mustExist(branchWork, refs_1.BranchError.CANNOT_FIND_BRANCH);
                return branchWork;
            }
            return true;
        });
    }
    static create(userId, name, email, phone, password, birthday, city, district, address, homeTown, branchWorkId, branchRole) {
        return __awaiter(this, void 0, void 0, function* () {
            const branchWork = yield this.validate(userId, name, email, phone, password, branchWorkId, branchRole);
            const hashed = yield bcryptjs_1.hash(password, 8);
            const sid = yield this.getSid();
            const user = new refs_1.User({
                sid,
                // Personal Information
                name,
                email,
                phone,
                birthday,
                password: hashed,
                // Address
                city,
                district,
                address,
                homeTown,
                //  Create Related
                createBy: userId,
            });
            yield user.save();
            if (branchWork._id)
                return yield refs_1.SetRoleInBranchService.set(user._id, branchWork._id, [branchRole]);
            return yield refs_1.GetUserInfo.get(user._id);
        });
    }
    static getSid() {
        return __awaiter(this, void 0, void 0, function* () {
            const maxSid = yield refs_1.User.find({}).sort({ sid: -1 }).limit(1);
            if (maxSid.length === 0)
                return refs_1.SID_START_AT;
            return maxSid[0].sid + 1;
        });
    }
}
exports.CreateUserService = CreateUserService;
