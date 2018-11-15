import { GetAllEmployeesService, Branch } from "../../../src/refs";

export class GetBranchDetailDataService {
    static async get(branchId: string) {
        const employees = await GetAllEmployeesService.getEmployeeInOneBranch(branchId);
        return { employees };
    }
}