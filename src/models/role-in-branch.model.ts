import { Schema, model } from "mongoose";
import { Role } from "../../src/types";

const roleInBranchSchema = new Schema({
    branch: { type: Schema.Types.ObjectId, ref: 'Branch' },
    roles: [{ type: String }]
});

const RoleInBranchModel = model('RoleInBranch', roleInBranchSchema);

export class RoleInBranch extends RoleInBranchModel {
    branch: any;
    roles: Role[];
}