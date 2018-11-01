import { model, Schema } from "mongoose";
import { Modifield } from "../../src/types";
import { RoleInBranch } from "../../src/refs";

const userSchema = new Schema({
    sid: { type: Number, required: true, trim: true, unique: true },
    // Personal Information
    name: { type: String, required: true, trim: true },
    birthday: { type: Number, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    passwordVersion: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    // Address
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    address: { type: String, trim: true },
    homeTown: { type: String, trim: true },
    // Role In Branch
    roleInBranchs: [{ type: Schema.Types.ObjectId, ref: 'RoleInBranch' }],
    //  Create Related
    createAt: { type: Number, default: Date.now() },
    createBy: { type: Schema.Types.ObjectId, ref: 'User' },
    // Modifield
    modifieds: [{
        updateAt: { type: Number },
        updateBy: { type: Schema.Types.ObjectId, ref: 'User' },
        dataBackup: { type: String }
    }]
});

const UserModel = model('User', userSchema);

export class User extends UserModel {
    sid: number;
    // Personal Information
    name: string;
    birthday: number;
    email: string
    phone: string;
    password: string;
    passwordVersion: number;
    token: string;
    // Address
    city: string;
    district: string;
    address: string;
    homeTown: string;
    // Role In Branch
    roleInBranchs: RoleInBranch[];
    //  Create Related
    createAt: number;
    createBy: User;
    // Modifield
    modifieds: Modifield[];
}