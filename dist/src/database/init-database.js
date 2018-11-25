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
        yield createProduct(rootUser._id);
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
        yield refs_1.CreateService.create(userId, { name: 'Chụp Phim Quanh Chóp KTS', suggestedRetailerPrice: 50000, unit: 'phim' });
        yield refs_1.CreateService.create(userId, { name: 'Cạo Vôi Răng & Đánh Bóng 2 Hàm', suggestedRetailerPrice: 200000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Cạo Vôi Răng nặng', suggestedRetailerPrice: 500000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Điều trị nha chu', suggestedRetailerPrice: 200000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Nhổ Răng Sữa', suggestedRetailerPrice: 20000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Nhổ Răng Vĩnh Viễn', suggestedRetailerPrice: 500000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Tiểu Phẫu Răng Khôn, Nạo Cắt Chóp', suggestedRetailerPrice: 1000000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Tẩy Trắng Răng tại Nhà', suggestedRetailerPrice: 900000, unit: 'bộ' });
        yield refs_1.CreateService.create(userId, { name: 'Tẩy Trắng Răng tại Phòng Khám', suggestedRetailerPrice: 1600000, unit: '2 hàm' });
        yield refs_1.CreateService.create(userId, { name: 'Trám Răng Sữa', suggestedRetailerPrice: 150000, unit: 'xoang' });
        yield refs_1.CreateService.create(userId, { name: 'Trám Răng Composite', suggestedRetailerPrice: 300000, unit: 'xoang' });
        yield refs_1.CreateService.create(userId, { name: 'Trám Răng Mẻ Góc', suggestedRetailerPrice: 200000, unit: 'xoang' });
        yield refs_1.CreateService.create(userId, { name: 'Đắp Mặt Răng - Đóng Kẽ Răng', suggestedRetailerPrice: 300000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Điều Trị Tủy', suggestedRetailerPrice: 700000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Cắm Chốt Kim Loại', suggestedRetailerPrice: 500000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Cắm Chốt Sợi trám composite', suggestedRetailerPrice: 1000000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Răng Sứ Kim Loại', suggestedRetailerPrice: 1000000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Răng Sứ Titan', suggestedRetailerPrice: 1600000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Inlay/onlay Sứ Ép', suggestedRetailerPrice: 2500000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Răng Sứ Zirconia', suggestedRetailerPrice: 3200000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Răng Sứ Khối Argen', suggestedRetailerPrice: 4000000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Răng Sứ cercon HT', suggestedRetailerPrice: 5000000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Mặt Dán Sứ veneer Emax', suggestedRetailerPrice: 6000000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Mặt Dán Sứ Nano', suggestedRetailerPrice: 7000000, unit: 'răng' });
        yield refs_1.CreateService.create(userId, { name: 'Răng Sứ LaVa Plus USA', suggestedRetailerPrice: 7000000, unit: 'răng' });
    });
}
exports.createService = createService;
function createProduct(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield refs_1.CreateProductService.create(userId, { name: 'Khẩu trang y tế', suggestedRetailerPrice: 10000, origin: 'VN', unit: 'gói' });
        yield refs_1.CreateProductService.create(userId, { name: 'Máy vệ sinh nướu tại nhà', suggestedRetailerPrice: 7000000, origin: 'VN', unit: 'máy' });
        yield refs_1.CreateProductService.create(userId, { name: 'Efferalgan - thuốc giảm đau', suggestedRetailerPrice: 7000, origin: 'VN', unit: 'viên' });
    });
}
exports.createProduct = createProduct;
