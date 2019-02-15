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
class UpdateStatusTicketService {
    static validate(staffId, ticketId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(staffId, ticketId);
            const ticket = yield refs_1.Ticket.findById(ticketId);
            refs_1.mustExist(ticket, refs_1.TicketError.CANNOT_FIND_TICKET);
            const ticketStatusArr = [refs_1.TicketStatus.DONE, refs_1.TicketStatus.WORKING, refs_1.TicketStatus.PENDING];
            refs_1.mustExist(ticketStatusArr.find(v => v === status), refs_1.TicketError.INVALID_TICKET_STATUS);
            return ticket;
        });
    }
    static update(staffId, ticketId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(staffId, ticketId);
            const oldTicket = yield this.validate(staffId, ticketId, status);
            const newTicket = yield refs_1.Ticket.findByIdAndUpdate(ticketId, { status }, { new: true });
            refs_1.ModifiedService.ticket(ticketId, staffId, oldTicket, refs_1.ModifieldTicketMessage.UPDATE_TICKET_STATUS);
            return newTicket;
        });
    }
}
exports.UpdateStatusTicketService = UpdateStatusTicketService;
