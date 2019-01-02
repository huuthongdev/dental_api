import { Branch } from "../../../src/refs";

export class GetAllBranchService {
    static async get() {
        return await Branch.find({}).sort({ createAt: -1 });
    }
}