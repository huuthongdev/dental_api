import { Ticket, CheckMasterBranchService } from "../../../src/refs";

export class GetAllTicketService {
    static async getAll(branchId: string) {
        // Chỉ lấy hồ sơ tại chi nhánh nhân sự đang làm việc
        const checkMaster = await CheckMasterBranchService.check(branchId);
        let query = {};
        if (!checkMaster) query = { branchRegister: branchId };
        return Ticket.find(query).sort({ createAt: -1 })
            .select('sid client dentistResponsible status items totalAmount receiptVoucher')
            .populate('client', 'name email phone')
            .populate('dentistResponsible', 'name email phone')
            .populate('items.service', 'name unit')
            .populate('receiptVoucher')
    }
}