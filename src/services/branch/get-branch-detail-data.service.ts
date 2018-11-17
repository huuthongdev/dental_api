import { GetAllEmployeesService, Branch } from "../../../src/refs";

export class GetBranchDetailDataService {
    static async get(branchId: string) {
        const branchDb = await Branch.findById(branchId);
        let branch = branchDb.toObject();
        // Get Employees
        let employees = await GetAllEmployeesService.getEmployeeInOneBranch(branchId);
        employees = employees ? employees : [];
        branch.detail = { employees };
        return branch;
    }
}