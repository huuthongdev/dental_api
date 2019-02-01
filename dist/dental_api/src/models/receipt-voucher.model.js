"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const { ObjectId } = mongoose_1.Schema.Types;
const receiptVoucherSchema = new mongoose_1.Schema({
    sid: { type: Number, unique: true, required: true },
    type: { type: String, enum: ['FOR_TICKET', 'BUY_PRODUCT'], required: true, trim: true },
    // General Info
    client: { type: ObjectId, ref: 'Client', required: true },
    branchTransaction: { type: ObjectId, ref: 'Branch', required: true },
    cashier: { type: ObjectId, ref: 'User', required: true },
    createAt: { type: Number, default: Date.now() },
    totalPayment: { type: Number, required: true },
    // ======================= TYPE: FOR TICKET =======================
    ticket: { type: ObjectId, ref: 'Ticket' },
    content: { type: String, trim: true },
    // ======================= TYPE: BY PRODUCT =======================
    items: [{
            product: { type: ObjectId, ref: 'Product' },
            qty: { type: Number }
        }]
});
const ReceiptVoucherModel = mongoose_1.model('ReceiptVoucher', receiptVoucherSchema);
class ReceiptVoucher extends ReceiptVoucherModel {
}
exports.ReceiptVoucher = ReceiptVoucher;
var ReceiptVoucherType;
(function (ReceiptVoucherType) {
    ReceiptVoucherType["FOR_TICKET"] = "FOR_TICKET";
    ReceiptVoucherType["BUY_PRODUCT"] = "BUY_PRODUCT";
})(ReceiptVoucherType = exports.ReceiptVoucherType || (exports.ReceiptVoucherType = {}));
