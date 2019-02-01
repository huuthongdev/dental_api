"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const refs_1 = require("../../../src/refs");
class GetAllTicketService {
    static getAll(branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Chỉ lấy hồ sơ tại chi nhánh nhân sự đang làm việc
            const checkMaster = yield refs_1.CheckMasterBranchService.check(branchId);
            let query = {};
            if (!checkMaster)
                query = { branchRegister: branchId };
            return refs_1.Ticket.find(query).sort({ createAt: -1 })
                .select('sid client dentistResponsible status items totalAmount receiptVoucher')
                .populate('client', 'name email phone')
                .populate('dentistResponsible', 'name email phone')
                .populate('items.service', 'name unit')
                .populate('receiptVoucher');
        });
    }
}
exports.GetAllTicketService = GetAllTicketService;
