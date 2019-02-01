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
class CreateTicketReceiptVoucherService {
    static validate(userId, branchId, clientId, totalPayment, ticketId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(userId, branchId, clientId, ticketId);
            // Must Exist
            const ticket = yield refs_1.Ticket.findById(ticketId).select(refs_1.modifiedSelect);
            refs_1.mustExist(ticket, refs_1.TicketError.CANNOT_FIND_TICKET);
            const client = yield refs_1.Client.findById(clientId);
            refs_1.mustExist(client, refs_1.ClientError.CANNOT_FIND_CLIENT);
            // Make Sure
            refs_1.makeSure(totalPayment > 0, refs_1.ReceiptVoucherError.TOTAL_PAYMENT_IS_ZERO);
            // Check Ticket  
            refs_1.makeSure(totalPayment <= ticket.totalAmount, refs_1.ReceiptVoucherError.OVER_PAYMENT_LIMIT);
            const checkReceiptVoucherThisTicket = yield refs_1.ReceiptVoucher.find({ ticket: ticketId }).select('totalPayment');
            if (!checkReceiptVoucherThisTicket || checkReceiptVoucherThisTicket.length === 0)
                return ticket;
            let totalPaymented = 0;
            for (let i = 0; i < checkReceiptVoucherThisTicket.length; i++) {
                totalPaymented += +checkReceiptVoucherThisTicket[i].totalPayment;
            }
            refs_1.makeSure(totalPaymented < ticket.totalAmount, refs_1.ReceiptVoucherError.OVER_PAYMENT_LIMIT);
            return ticket;
        });
    }
    static create(userId, branchId, clientId, totalPayment, ticketId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldTicket = yield this.validate(userId, branchId, clientId, totalPayment, ticketId, content);
            const sid = yield this.getSid();
            const receiptVoucher = new refs_1.ReceiptVoucher({
                sid, type: refs_1.ReceiptVoucherType.FOR_TICKET,
                client: clientId,
                branchTransaction: branchId,
                cashier: userId,
                totalPayment,
                content,
                ticket: ticketId,
                createAt: Date.now()
            });
            yield receiptVoucher.save();
            yield refs_1.Ticket.findByIdAndUpdate(ticketId, { $addToSet: { receiptVoucher: receiptVoucher._id } }, { new: true });
            return yield refs_1.ModifiedService.ticket(ticketId, userId, oldTicket, refs_1.ModifieldTicketMessage.PAYMENT);
        });
    }
    static getSid() {
        return __awaiter(this, void 0, void 0, function* () {
            const maxSid = yield refs_1.ReceiptVoucher.find({}).sort({ sid: -1 }).limit(1);
            if (maxSid.length === 0)
                return refs_1.SID_START_AT;
            return maxSid[0].sid + 1;
        });
    }
}
exports.CreateTicketReceiptVoucherService = CreateTicketReceiptVoucherService;
