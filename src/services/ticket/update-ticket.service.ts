import { TicketError, TicketItem, mustBeObjectId, Ticket, modifiedSelect, mustExist, makeSure, TicketStatus, Service, ServiceError, ServiceMeta, ModifiedService, CheckRoleInBranchService, Role, ModifieldTicketMessage } from "../../../src/refs";

export class UpdateTicketService {
    static async validateUpdateItems(ticketId: string, userId: string, branchId: string, items: TicketItem[]) {
        mustBeObjectId(ticketId, userId);
        // Must exist
        const oldTicket = await Ticket.findById(ticketId).select(modifiedSelect) as Ticket;
        mustExist(oldTicket, TicketError.CANNOT_FIND_TICKET);
        // Make sure
        makeSure(oldTicket.status !== TicketStatus.DONE, TicketError.TICKET_WAS_DONE);
        makeSure(items && items.length !== 0, TicketError.ITEMS_MUST_BE_PROVIDED);
        let totalAmount = 0;
        for (let i = 0; i < items.length; i++) {
            const service = await Service.findById(items[i].service).select('serviceMetaes suggestedRetailerPrice').populate('serviceMetaes') as Service;
            mustExist(service, ServiceError.CANNOT_FIND_SERVICE);
            const serviceMeta = await ServiceMeta.findOne({ branch: branchId, service: service._id }) as ServiceMeta;
            if (serviceMeta) totalAmount += +serviceMeta.price * items[i].qty;
            if (!serviceMeta) totalAmount += +service.suggestedRetailerPrice * items[i].qty;
        }
        return { totalAmount, oldTicket };
    }

    static async items(ticketId: string, userId: string, branchId: string, items: TicketItem[]) {
        const { oldTicket, totalAmount } = await this.validateUpdateItems(ticketId, userId, branchId, items);
        await Ticket.findByIdAndUpdate(ticketId, { items, totalAmount }, { new: true });
        return await ModifiedService.ticket(ticketId, userId, oldTicket, ModifieldTicketMessage.UPDATE_ITEMS);
    }

    static async validateUpdateDentistResponsible(ticketId: string, userId: string, branchId: string, dentistId: string) {
        mustBeObjectId(ticketId, userId, branchId, dentistId);
        const dentist = await CheckRoleInBranchService.check(dentistId, branchId, [Role.DENTIST, Role.DENTISTS_MANAGER]);
        mustExist(dentist, TicketError.DENTIST_INFO_INVALID);
        const oldTicket = await Ticket.findById(ticketId).select(modifiedSelect) as Ticket;
        mustExist(oldTicket, TicketError.CANNOT_FIND_TICKET);
        return oldTicket;
    }

    static async dentistResponsible(ticketId: string, userId: string, branchId: string, dentistId: string) {
        const oldTicket = await this.validateUpdateDentistResponsible(ticketId, userId, branchId, dentistId);
        await Ticket.findByIdAndUpdate(ticketId, { dentistResponsible: dentistId }, { new: true });
        return await ModifiedService.ticket(ticketId, userId, oldTicket, ModifieldTicketMessage.CHANGE_DENTIST_RESPONSIBLE);
    }
}