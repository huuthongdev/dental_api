import { ServiceError, TicketItem, mustBeObjectId, Client, mustExist, ClientError, User, RoleInBranch, Role, TicketError, Branch, makeSure, Ticket, Service, TicketService, SID_START_AT, CheckRoleInBranchService, ServiceMeta } from "../../../src/refs";

export class CreateTicketService {
    static async validate(clientId: string, userId: string, dentistId: string, branchId: string, items: TicketItem[]) {
        mustBeObjectId(clientId, userId, dentistId);
        // Must exist
        const client = await Client.findById(clientId);
        mustExist(client, ClientError.CANNOT_FIND_CLIENT);
        const dentist = await CheckRoleInBranchService.check(dentistId, branchId, [Role.DENTIST, Role.DENTISTS_MANAGER]);
        mustExist(dentist, TicketError.DENTIST_INFO_INVALID);
        // Make Sure
        makeSure(items && items.length !== 0, TicketError.ITEMS_MUST_BE_PROVIDED);
        // Get total amount
        let totalAmount = 0;
        for (let i = 0; i < items.length; i++) {
            const service = await Service.findById(items[i].service).select('serviceMetaes suggestedRetailerPrice').populate('serviceMetaes') as Service;
            mustExist(service, ServiceError.CANNOT_FIND_SERVICE);
            const serviceMeta = await ServiceMeta.findOne({ branch: branchId, service: service._id }) as ServiceMeta;
            if (serviceMeta) totalAmount += +serviceMeta.price * items[i].qty;
            if (!serviceMeta) totalAmount += +service.suggestedRetailerPrice * items[i].qty;
        }
        return +totalAmount;
    }

    static async create(clientId: string, userId: string, dentistId: string, branchId: string, items: TicketItem[]) {
        const totalAmount = await this.validate(clientId, userId, dentistId, branchId, items);
        const sid = await this.getSid();
        const ticket = new Ticket({ sid, client: clientId, staffCustomerCase: userId, dentistResponsible: dentistId, branchRegister: branchId, items, totalAmount });
        await ticket.save();
        return await TicketService.getTicketInfo(ticket._id);
    }

    static async getSid() {
        const maxSid = await Ticket.find({}).sort({ sid: -1 }).limit(1) as Ticket[];
        if (maxSid.length === 0) return SID_START_AT;
        return maxSid[0].sid + 1;
    }
}