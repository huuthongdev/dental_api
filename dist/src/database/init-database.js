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
const user_model_1 = require("../../src/models/user.model");
const refs_1 = require("../../src/refs");
const bcryptjs_1 = require("bcryptjs");
function initDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const userCount = yield user_model_1.User.count({});
        if (userCount !== 0)
            return;
        yield prepareDataInit();
    });
}
exports.initDatabase = initDatabase;
function prepareDataInit() {
    return __awaiter(this, void 0, void 0, function* () {
        const rootUser = yield createRootUser();
        yield createBranchMaster(rootUser._id);
        // TODO: TEST FRONT_END
        // const branch2 = await CreateBranchService.create(rootUser._id, 'CN GO VAP', 'govap@gmail.com', '09999', 'HCM', 'GO VAP');
        // await SetRoleInBranchService.set(rootUser._id, branch2._id, [Role.DIRECTOR]);
    });
}
exports.prepareDataInit = prepareDataInit;
function createRootUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const password = yield bcryptjs_1.hash(refs_1.DEFAULT_PASSWORD, 8);
        const user = new user_model_1.User({
            sid: refs_1.SID_START_AT,
            name: refs_1.ROOT_NAME,
            email: refs_1.ROOT_EMAIL,
            phone: refs_1.ROOT_PHONE,
            password,
        });
        return yield user.save();
    });
}
exports.createRootUser = createRootUser;
function createBranchMaster(rootUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const branchMaster = new refs_1.Branch({
            sid: refs_1.SID_START_AT,
            name: refs_1.BRANCH_MASTER_NAME,
            isMaster: true,
            createBy: rootUserId
        });
        yield branchMaster.save();
        return yield refs_1.SetRoleInBranchService.set(rootUserId, branchMaster._id, [refs_1.Role.ADMIN, refs_1.Role.DIRECTOR]);
    });
}
exports.createBranchMaster = createBranchMaster;
