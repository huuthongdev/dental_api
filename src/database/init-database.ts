import faker from 'faker';
import { User } from '../../src/models/user.model';
import { ROOT_NAME, ROOT_EMAIL, ROOT_PHONE, DEFAULT_PASSWORD, SID_START_AT, BRANCH_MASTER_NAME, SetRoleInBranchService, Role, Branch, CreateBranchService, CreateService, CreateProductService } from '../../src/refs';
import { hash } from 'bcryptjs';

export async function initDatabase() {
    const userCount = await User.count({});
    if (userCount !== 0) return;
    await prepareDataInit();
}

export async function prepareDataInit() {
    const rootUser = await createRootUser();
    await createBranchMaster(rootUser._id);
    await createService(rootUser._id);
    await createProduct(rootUser._id);
    // TODO: TEST FRONT_END
    // const branch2 = await CreateBranchService.create(rootUser._id, 'CN GO VAP', 'govap@gmail.com', '09999', 'HCM', 'GO VAP');
    // await SetRoleInBranchService.set(rootUser._id, branch2._id, [Role.DIRECTOR]);
}

export async function createRootUser() {
    const password = await hash(DEFAULT_PASSWORD, 8);
    const user = new User({
        sid: SID_START_AT,
        name: ROOT_NAME,
        email: ROOT_EMAIL,
        phone: ROOT_PHONE,
        password,
    });
    return await user.save();
}

export async function createBranchMaster(rootUserId: string) {
    const branchMaster = new Branch({
        sid: SID_START_AT,
        name: BRANCH_MASTER_NAME,
        isMaster: true,
        createBy: rootUserId
    });
    await branchMaster.save();
    return await SetRoleInBranchService.set(rootUserId, branchMaster._id, [Role.ADMIN, Role.DIRECTOR]);
}

export async function createService(userId: string) {
    await CreateService.create(userId, { name: 'Chụp Phim Quanh Chóp KTS', suggestedRetailerPrice: 50000, unit: 'phim' });
    await CreateService.create(userId, { name: 'Cạo Vôi Răng & Đánh Bóng 2 Hàm', suggestedRetailerPrice: 200000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Cạo Vôi Răng nặng', suggestedRetailerPrice: 500000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Điều trị nha chu', suggestedRetailerPrice: 200000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Nhổ Răng Sữa', suggestedRetailerPrice: 20000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Nhổ Răng Vĩnh Viễn', suggestedRetailerPrice: 500000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Tiểu Phẫu Răng Khôn, Nạo Cắt Chóp', suggestedRetailerPrice: 1000000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Tẩy Trắng Răng tại Nhà', suggestedRetailerPrice: 900000, unit: 'bộ' });
    await CreateService.create(userId, { name: 'Tẩy Trắng Răng tại Phòng Khám', suggestedRetailerPrice: 1600000, unit: '2 hàm' });
    await CreateService.create(userId, { name: 'Trám Răng Sữa', suggestedRetailerPrice: 150000, unit: 'xoang' });
    await CreateService.create(userId, { name: 'Trám Răng Composite', suggestedRetailerPrice: 300000, unit: 'xoang' });
    await CreateService.create(userId, { name: 'Trám Răng Mẻ Góc', suggestedRetailerPrice: 200000, unit: 'xoang' });
    await CreateService.create(userId, { name: 'Đắp Mặt Răng - Đóng Kẽ Răng', suggestedRetailerPrice: 300000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Điều Trị Tủy', suggestedRetailerPrice: 700000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Cắm Chốt Kim Loại', suggestedRetailerPrice: 500000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Cắm Chốt Sợi trám composite', suggestedRetailerPrice: 1000000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Răng Sứ Kim Loại', suggestedRetailerPrice: 1000000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Răng Sứ Titan', suggestedRetailerPrice: 1600000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Inlay/onlay Sứ Ép', suggestedRetailerPrice: 2500000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Răng Sứ Zirconia', suggestedRetailerPrice: 3200000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Răng Sứ Khối Argen', suggestedRetailerPrice: 4000000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Răng Sứ cercon HT', suggestedRetailerPrice: 5000000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Mặt Dán Sứ veneer Emax', suggestedRetailerPrice: 6000000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Mặt Dán Sứ Nano', suggestedRetailerPrice: 7000000, unit: 'răng' });
    await CreateService.create(userId, { name: 'Răng Sứ LaVa Plus USA', suggestedRetailerPrice: 7000000, unit: 'răng' });
}

export async function createProduct(userId: string) {
    await CreateProductService.create(userId, { name: 'Khẩu trang y tế', suggestedRetailerPrice: 10000, origin: 'VN', unit: 'gói' });
    await CreateProductService.create(userId, { name: 'Máy vệ sinh nướu tại nhà', suggestedRetailerPrice: 7000000, origin: 'VN', unit: 'máy' });
    await CreateProductService.create(userId, { name: 'Efferalgan - thuốc giảm đau', suggestedRetailerPrice: 7000, origin: 'VN', unit: 'viên' });
}