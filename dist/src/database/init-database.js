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
        yield createService(rootUser._id);
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
function createService(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield refs_1.CreateService.create(userId, 'Chụp Phim Quanh Chóp KTS', 50000, [], [], 'phim');
        yield refs_1.CreateService.create(userId, 'Cạo Vôi Răng & Đánh Bóng 2 Hàm', 200000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Cạo Vôi Răng nặng', 500000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Điều trị nha chu', 200000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Nhổ Răng Sữa', 20000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Nhổ Răng Vĩnh Viễn', 500000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Tiểu Phẫu Răng Khôn, Nạo Cắt Chóp', 1000000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Tẩy Trắng Răng tại Nhà', 900000, [], [], 'bộ');
        yield refs_1.CreateService.create(userId, 'Tẩy Trắng Răng tại Phòng Khám', 1600000, [], [], '2 hàm');
        yield refs_1.CreateService.create(userId, 'Trám Răng Sữa', 150000, [], [], 'xoang');
        yield refs_1.CreateService.create(userId, 'Trám Răng Composite', 300000, [], [], 'xoang');
        yield refs_1.CreateService.create(userId, 'Trám Răng Mẻ Góc', 200000, [], [], 'xoang');
        yield refs_1.CreateService.create(userId, 'Đắp Mặt Răng - Đóng Kẽ Răng', 300000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Điều Trị Tủy', 700000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Cắm Chốt Kim Loại', 500000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Cắm Chốt Sợi trám composite', 1000000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Răng Sứ Kim Loại', 1000000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Răng Sứ Titan', 1600000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Inlay/onlay Sứ Ép', 2500000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Răng Sứ Zirconia', 3200000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Răng Sứ Khối Argen', 4000000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Răng Sứ cercon HT', 5000000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Mặt Dán Sứ veneer Emax', 6000000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Mặt Dán Sứ Nano', 7000000, [], [], 'răng');
        yield refs_1.CreateService.create(userId, 'Răng Sứ LaVa Plus USA', 7000000, [], [], 'răng');
    });
}
exports.createService = createService;
