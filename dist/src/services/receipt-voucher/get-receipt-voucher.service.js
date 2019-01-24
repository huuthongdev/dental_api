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
class GetReceiptVoucherService {
    static currentBranch(branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(branchId);
            return yield refs_1.ReceiptVoucher.find({ branchTransaction: branchId })
                .populate('cashier', 'sid name')
                .populate({
                path: 'ticket',
                select: 'sid items sid totalAmount client',
                populate: {
                    path: 'items.service',
                    select: 'name suggestedRetailerPrice unit'
                }
            })
                .populate({
                path: 'ticket',
                select: 'sid items sid totalAmount client',
                populate: {
                    path: 'receiptVoucher',
                    select: 'totalPayment createAt'
                }
            })
                .populate('client', 'sid name phone email city district address');
        });
    }
}
exports.GetReceiptVoucherService = GetReceiptVoucherService;
