import { connectDatabase, User } from '../src/refs';
import { createRootAccount } from '../src/database/init-database';

before(async () => await connectDatabase())

beforeEach(async () => {
    await User.remove({});
    await createRootAccount();
});
