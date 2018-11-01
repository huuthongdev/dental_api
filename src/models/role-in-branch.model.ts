import { Schema, model } from "mongoose";
import { Role } from "../../src/types";
import { User } from "../../src/refs";

const roleInBranchSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    roles: [{ type: String }]
});

const RoleInBranchModel = model('RoleInBranch', roleInBranchSchema);

export class RoleInBranch extends RoleInBranchModel {
    user: string | User;
    branch: any;
    roles: Role[];
}