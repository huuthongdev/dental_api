import { Branch } from "../../../src/refs";

export class CheckMasterBranchService {
    static async check(branchId: string) {
        return await Branch.findOne({ _id: branchId, isMaster: true });
    }
}