"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const branchSchema = new mongoose_1.Schema({
    sid: { type: Number, required: true },
    // Information
    name: { type: String, required: true, trim: true, unique: true, sparse: true },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    phone: { type: String, trim: true, unique: true, sparse: true },
    isMaster: { type: Boolean, default: false },
    // Address
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    address: { type: String, trim: true },
    //  Create Related
    createAt: { type: Number, default: Date.now() },
    createBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    // Modifield
    modifieds: [{
            updateAt: { type: Number },
            updateBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            dataBackup: { type: String }
        }],
    // Status
    isActive: { type: Boolean, default: true }
});
const BranchModel = mongoose_1.model('Branch', branchSchema);
class Branch extends BranchModel {
}
exports.Branch = Branch;
