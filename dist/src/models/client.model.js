"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const clientSchema = new mongoose_1.Schema({
    sid: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, unique: true },
    phone: { type: String, trim: true, unique: true, required: true },
    birthday: { type: Number },
    medicalHistory: [{ type: String, trim: true }],
    // Address
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    address: { type: String, trim: true },
    homeTown: { type: String, trim: true },
    //  Create Related
    isActive: { type: Boolean, default: true },
    createAt: { type: Number, default: Date.now() },
    createBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    // Modifield
    modifieds: [{
            updateAt: { type: Number },
            updateBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            dataBackup: { type: String }
        }],
});
const ClientModel = mongoose_1.model('Client', clientSchema);
class Client extends ClientModel {
}
exports.Client = Client;
