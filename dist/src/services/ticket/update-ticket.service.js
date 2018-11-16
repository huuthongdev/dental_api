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
const refs_1 = require("../../../src/refs");
class UpdateTicketService {
    static validateUpdateItems(ticketId, userId, branchId, items) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(ticketId, userId);
            // Must exist
            const oldTicket = yield refs_1.Ticket.findById(ticketId).select(refs_1.modifiedSelect);
            refs_1.mustExist(oldTicket, refs_1.TicketError.CANNOT_FIND_TICKET);
            // Make sure
            refs_1.makeSure(oldTicket.status !== refs_1.TicketStatus.DONE, refs_1.TicketError.TICKET_WAS_DONE);
            refs_1.makeSure(items && items.length !== 0, refs_1.TicketError.ITEMS_MUST_BE_PROVIDED);
            let totalAmount = 0;
            for (let i = 0; i < items.length; i++) {
                const service = yield refs_1.Service.findById(items[i].service).select('serviceMetaes suggestedRetailerPrice').populate('serviceMetaes');
                refs_1.mustExist(service, refs_1.ServiceError.CANNOT_FIND_SERVICE);
                const serviceMeta = yield refs_1.ServiceMeta.findOne({ branch: branchId, service: service._id });
                if (serviceMeta)
                    totalAmount += +serviceMeta.price * items[i].qty;
                if (!serviceMeta)
                    totalAmount += +service.suggestedRetailerPrice * items[i].qty;
            }
            return { totalAmount, oldTicket };
        });
    }
    static items(ticketId, userId, branchId, items) {
        return __awaiter(this, void 0, void 0, function* () {
            const { oldTicket, totalAmount } = yield this.validateUpdateItems(ticketId, userId, branchId, items);
            yield refs_1.Ticket.findByIdAndUpdate(ticketId, { items, totalAmount }, { new: true });
            return yield refs_1.ModifiedService.ticket(ticketId, userId, oldTicket, refs_1.ModifieldTicketMessage.UPDATE_ITEMS);
        });
    }
    static validateUpdateDentistResponsible(ticketId, userId, branchId, dentistId) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(ticketId, userId, branchId, dentistId);
            const dentist = yield refs_1.CheckRoleInBranchService.check(dentistId, branchId, [refs_1.Role.DENTIST, refs_1.Role.DENTISTS_MANAGER]);
            refs_1.mustExist(dentist, refs_1.TicketError.DENTIST_INFO_INVALID);
            const oldTicket = yield refs_1.Ticket.findById(ticketId).select(refs_1.modifiedSelect);
            refs_1.mustExist(oldTicket, refs_1.TicketError.CANNOT_FIND_TICKET);
            return oldTicket;
        });
    }
    static dentistResponsible(ticketId, userId, branchId, dentistId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldTicket = yield this.validateUpdateDentistResponsible(ticketId, userId, branchId, dentistId);
            yield refs_1.Ticket.findByIdAndUpdate(ticketId, { dentistResponsible: dentistId }, { new: true });
            return yield refs_1.ModifiedService.ticket(ticketId, userId, oldTicket, refs_1.ModifieldTicketMessage.CHANGE_DENTIST_RESPONSIBLE);
        });
    }
}
exports.UpdateTicketService = UpdateTicketService;
