import { model, Schema } from "mongoose";
import { User, Gender } from "../../src/refs";

const clientSchema = new Schema({
    sid: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, unique: true },
    phone: { type: String, trim: true, unique: true, required: true },
    birthday: { type: Number },
    medicalHistory: [{ type: String, trim: true }],
    gender: { type: String, enum: ['FEMALE', 'MALE', 'OTHER'], default: 'OTHER' },
    // Address
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    address: { type: String, trim: true },
    homeTown: { type: String, trim: true },
    //  Create Related
    isActive: { type: Boolean, default: true },
    createAt: { type: Number, default: Date.now() },
    createBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Modifield
    modifieds: [{
        updateAt: { type: Number },
        updateBy: { type: Schema.Types.ObjectId, ref: 'User' },
        dataBackup: { type: String }
    }],
    // Service related
    // tickets: [{ type: Schema.Types.ObjectId, ref: 'Ticket' }],
    // receiptVoucher: [{ type: Schema.Types.ObjectId, ref: 'ReceiptVoucher' }]
});

const ClientModel = model('Client', clientSchema);

export class Client extends ClientModel {
    sid: number;
    name: string;
    email: string;
    phone: string;
    birthday: number;
    medicalHistory: string[];
    gender: Gender;
    // Address
    city: string;
    district: string;
    address: string;
    homeTown: string;
    //  Create Related
    isActive: boolean;
    createAt: number;
    createBy: User;
    // Modifield
    modifieds: [{
        updateAt: number,
        updateBy: string | User,
        dataBackup: string
    }]
}