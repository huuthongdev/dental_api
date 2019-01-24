import { model, Schema } from "mongoose";
import { Ticket, User, Branch } from "../../src/refs";
import { Modifield } from "../../src/types";

const { ObjectId } = Schema.Types;

const calendarDentistSchema = new Schema({
    sid: { type: Number, required: true },

    dentist: { type: ObjectId, ref: 'User', required: true },
    branch: { type: ObjectId, ref: 'Branch', required: true },

    ticket: { type: ObjectId, ref: 'Ticket' },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'WORKING', 'DONE', 'OUT_OF_DATE'], default: 'PENDING' },
    content: { type: String, trim: true, required: true },
    //  Create Related
    createAt: { type: Number, default: Date.now() },
    createBy: { type: ObjectId, ref: 'User', required: true },
    // Modifield
    modifieds: [{
        updateAt: { type: Number },
        updateBy: { type: ObjectId, ref: 'User' },
        dataBackup: { type: String }
    }]
});

const CalendarDentistModel = model('CalendarDentist', calendarDentistSchema);

export class CalendarDentist extends CalendarDentistModel {
    sid: number;
    dentist: string | User;
    branch: string | Branch;
    ticket: Ticket;
    startTime: number;
    endTime: number;
    status: CalendarStatus;
    content: string;
    //  Create Related
    createAt: number;
    createBy: string | User;
    // Modifield
    modifieds: Modifield[];
}

export enum CalendarStatus {
    PENDING = 'PENDING',
    WORKING = 'WORKING',
    DONE = 'DONE',
    OUT_OF_DATE = 'OUT_OF_DATE'
}