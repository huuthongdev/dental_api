import { model, Schema } from "mongoose";
import { Modifield } from "../../src/types";
import { RoleInBranch } from "../../src/refs";

const { ObjectId } = Schema.Types;

const userSchema = new Schema({
    sid: { type: Number, required: true, trim: true, unique: true },
    // Personal Information
    name: { type: String, required: true, trim: true },
    birthday: { type: Number, trim: true, sparse: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    passwordVersion: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    changePasswordPIN: { type: Number },
    // Address
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    address: { type: String, trim: true },
    homeTown: { type: String, trim: true },
    //  Create Related
    createAt: { type: Number, default: Date.now() },
    createBy: { type: ObjectId, ref: 'User' },
    // Modifield
    modifieds: [{
        updateAt: { type: Number },
        updateBy: { type: ObjectId, ref: 'User' },
        dataBackup: { type: String }
    }],
    // Role In Branch
    roleInBranchs: [{ type: ObjectId, ref: 'RoleInBranch' }]
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
    roleInBranchs: RoleInBranch[] | string[];
    //  Create Related
    createAt: number;
    createBy: User;
    // Modifield
    modifieds: Modifield[];
}