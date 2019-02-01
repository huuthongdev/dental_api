"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ticketSchema = new mongoose_1.Schema({
    sid: { type: Number, required: true, unique: true },
    // Personal Related
    client: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Client', required: true },
    staffCustomerCase: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    dentistResponsible: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    branchRegister: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Branch', required: true },
    status: { type: String, enum: ['WORKING', 'DONE', 'PENDING'], default: 'WORKING' },
    // Ticket Information
    items: [{
            service: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Service' },
            qty: { type: Number }
        }],
    totalAmount: { type: Number, default: 0 },
    receiptVoucher: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'ReceiptVoucher' }],
    calendars: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'CalendarDentist' }],
    // Client Feedback 
    feedback: {
        message: { type: String, trim: true },
        stars: { type: Number }
    },
    //  Create Related
    createAt: { type: Number, default: Date.now() },
    // Modifield
    modifieds: [{
            updateAt: { type: Number },
            updateBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            dataBackup: { type: String },
            message: { type: String }
        }]
});
const TicketModel = mongoose_1.model('Ticket', ticketSchema);
class Ticket extends TicketModel {
}
exports.Ticket = Ticket;
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["WORKING"] = "WORKING";
    TicketStatus["DONE"] = "DONE";
    TicketStatus["PENDING"] = "PENDING";
})(TicketStatus = exports.TicketStatus || (exports.TicketStatus = {}));
