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
class TicketService {
    static getTicketInfo(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield refs_1.Ticket.findById(ticketId)
                .populate({
                path: 'client',
                select: 'sid name email phone'
            })
                .populate({
                path: 'staffCustomerCase',
                select: 'name email phone'
            })
                .populate({
                path: 'dentistResponsible',
                select: 'sid name email phone'
            })
                .populate({
                path: 'branchRegister',
                select: 'name email phone'
            })
                .populate({
                path: 'items.service',
                select: 'name sid unit'
            })
                .populate({
                path: 'receiptVoucher',
                select: 'sid totalPayment'
            });
        });
    }
}
exports.TicketService = TicketService;
