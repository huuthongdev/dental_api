"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const { ObjectId } = mongoose_1.Schema.Types;
const calendarDentistSchema = new mongoose_1.Schema({
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
const CalendarDentistModel = mongoose_1.model('CalendarDentist', calendarDentistSchema);
class CalendarDentist extends CalendarDentistModel {
}
exports.CalendarDentist = CalendarDentist;
var CalendarStatus;
(function (CalendarStatus) {
    CalendarStatus["PENDING"] = "PENDING";
    CalendarStatus["WORKING"] = "WORKING";
    CalendarStatus["DONE"] = "DONE";
    CalendarStatus["OUT_OF_DATE"] = "OUT_OF_DATE";
})(CalendarStatus = exports.CalendarStatus || (exports.CalendarStatus = {}));
