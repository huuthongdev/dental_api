import { Schema, model } from "mongoose";
import { Client, Branch, User, Ticket, Product, ProductItem } from "../../src/refs";

const { ObjectId } = Schema.Types;

const receiptVoucherSchema = new Schema({
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

const ReceiptVoucherModel = model('ReceiptVoucher', receiptVoucherSchema);

export class ReceiptVoucher extends ReceiptVoucherModel {
    sid: number;
    type: ReceiptVoucherType;
    // General Info
    client: string | Client;
    branchTransaction: string | Branch;
    cashier: string | User;
    totalPayment: number;
    // ======================= TYPE: FOR TICKET =======================
    ticket: string | Ticket
    content: string;
    // ======================= TYPE: BY PRODUCT =======================
    items: ProductItem[];
}

export enum ReceiptVoucherType {
    FOR_TICKET = 'FOR_TICKET',
    BUY_PRODUCT = 'BUY_PRODUCT'
}

