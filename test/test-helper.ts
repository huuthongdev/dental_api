import { connectDatabase, User, Branch, Service, Product, RoleInBranch, Client, Ticket, ReceiptVoucher, CalendarDentist } from '../src/refs';
import { prepareDataInit } from '../src/database/init-database';

before(async () => await connectDatabase())

beforeEach(async () => {
    await User.remove({});
    await Branch.remove({});
    await Service.remove({});
    await Product.remove({});
    await RoleInBranch.remove({});
    await Client.remove({});
    await ReceiptVoucher.remove({});
    await Ticket.remove({});
    await CalendarDentist.remove({});
    await prepareDataInit();
});
