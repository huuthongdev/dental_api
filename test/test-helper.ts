import { connectDatabase, User, Branch, Service, Product, RoleInBranch } from '../src/refs';
import { prepareDataInit } from '../src/database/init-database';

before(async () => await connectDatabase())

beforeEach(async () => {
    await User.remove({});
    await Branch.remove({});
    await Service.remove({});
    await Product.remove({});
    await RoleInBranch.remove({});
    await prepareDataInit();
});
