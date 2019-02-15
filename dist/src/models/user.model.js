"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const { ObjectId } = mongoose_1.Schema.Types;
const userSchema = new mongoose_1.Schema({
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
const UserModel = mongoose_1.model('User', userSchema);
class User extends UserModel {
}
exports.User = User;
