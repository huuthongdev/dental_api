"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roleInBranchSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    branch: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Branch', required: true },
    roles: [{ type: String }]
});
const RoleInBranchModel = mongoose_1.model('RoleInBranch', roleInBranchSchema);
class RoleInBranch extends RoleInBranchModel {
}
exports.RoleInBranch = RoleInBranch;
