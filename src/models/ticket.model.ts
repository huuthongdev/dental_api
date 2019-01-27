import { model, Schema } from "mongoose";
import { Client, User, Branch, Service, ReceiptVoucher, CalendarDentist } from "../../src/refs";
import { Modifield } from "../../src/types";

const ticketSchema = new Schema({ 
    sid: { type: Number, required: true, unique: true },
    // Personal Related
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    staffCustomerCase: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dentistResponsible: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    branchRegister: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    status: { type: String, enum: ['WORKING', 'DONE', 'PENDING'], default: 'WORKING' },
    // Ticket Information
    items: [{
        service: { type: Schema.Types.ObjectId, ref: 'Service' },
        qty: { type: Number }
    }],
    totalAmount: { type: Number, default: 0 },
    receiptVoucher: [{ type: Schema.Types.ObjectId, ref: 'ReceiptVoucher' }],
    calendars: [{ type: Schema.Types.ObjectId, ref: 'CalendarDentist' }],
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
        updateBy: { type: Schema.Types.ObjectId, ref: 'User' },
        dataBackup: { type: String },
        message: { type: String }
    }]
});

const TicketModel = model('Ticket', ticketSchema);

export class Ticket extends TicketModel {
    sid: number;
    // Personal Related
    client: string | Client;
    staffCustomerCase: string | User;
    dentistResponsible: string | User;
    branchRegister: string | Branch;
    status: TicketStatus;
    // Ticket Information
    items: TicketItem[];
    totalAmount: number;
    receiptVoucher: string | ReceiptVoucher;
    calendars: CalendarDentist[];
    // Client Feedback 
    feedback: {
        message: string;
        stars: number;
    }
    //  Create Related
    createAt: number;
    // Modifield
    modifieds: Modifield[];
}

export enum TicketStatus {
    WORKING = 'WORKING',
    DONE = 'DONE',
    PENDING = 'PENDING'
}

export interface TicketItem {
    service: string | Service;
    qty: number;
}