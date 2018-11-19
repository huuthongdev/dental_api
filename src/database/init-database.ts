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
    await CreateService.create(userId, 'Chụp Phim Quanh Chóp KTS', 50000, [], [], 'phim');
    await CreateService.create(userId, 'Cạo Vôi Răng & Đánh Bóng 2 Hàm', 200000, [], [], 'răng');
    await CreateService.create(userId, 'Cạo Vôi Răng nặng', 500000, [], [], 'răng');
    await CreateService.create(userId, 'Điều trị nha chu', 200000, [], [], 'răng');
    await CreateService.create(userId, 'Nhổ Răng Sữa', 20000, [], [], 'răng');
    await CreateService.create(userId, 'Nhổ Răng Vĩnh Viễn', 500000, [], [], 'răng');
    await CreateService.create(userId, 'Tiểu Phẫu Răng Khôn, Nạo Cắt Chóp', 1000000, [], [], 'răng');
    await CreateService.create(userId, 'Tẩy Trắng Răng tại Nhà', 900000, [], [], 'bộ');
    await CreateService.create(userId, 'Tẩy Trắng Răng tại Phòng Khám', 1600000, [], [], '2 hàm');
    await CreateService.create(userId, 'Trám Răng Sữa', 150000, [], [], 'xoang');
    await CreateService.create(userId, 'Trám Răng Composite', 300000, [], [], 'xoang');
    await CreateService.create(userId, 'Trám Răng Mẻ Góc', 200000, [], [], 'xoang');
    await CreateService.create(userId, 'Đắp Mặt Răng - Đóng Kẽ Răng', 300000, [], [], 'răng');
    await CreateService.create(userId, 'Điều Trị Tủy', 700000, [], [], 'răng');
    await CreateService.create(userId, 'Cắm Chốt Kim Loại', 500000, [], [], 'răng');
    await CreateService.create(userId, 'Cắm Chốt Sợi trám composite', 1000000, [], [], 'răng');
    await CreateService.create(userId, 'Răng Sứ Kim Loại', 1000000, [], [], 'răng');
    await CreateService.create(userId, 'Răng Sứ Titan', 1600000, [], [], 'răng');
    await CreateService.create(userId, 'Inlay/onlay Sứ Ép', 2500000, [], [], 'răng');
    await CreateService.create(userId, 'Răng Sứ Zirconia', 3200000, [], [], 'răng');
    await CreateService.create(userId, 'Răng Sứ Khối Argen', 4000000, [], [], 'răng');
    await CreateService.create(userId, 'Răng Sứ cercon HT', 5000000, [], [], 'răng');
    await CreateService.create(userId, 'Mặt Dán Sứ veneer Emax', 6000000, [], [], 'răng');
    await CreateService.create(userId, 'Mặt Dán Sứ Nano', 7000000, [], [], 'răng');
    await CreateService.create(userId, 'Răng Sứ LaVa Plus USA', 7000000, [], [], 'răng');
}

export async function createProduct(userId: string) {
    await CreateProductService.create(userId, 'Khẩu trang y tế', 10000, 'VN', 'gói');
    await CreateProductService.create(userId, 'Máy vệ sinh nướu tại nhà', 7000000, 'VN', 'máy');
    await CreateProductService.create(userId, 'Efferalgan - thuốc giảm đau', 7000, 'VN', 'viên');
}