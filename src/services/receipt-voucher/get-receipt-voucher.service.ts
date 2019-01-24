import { mustBeObjectId, ReceiptVoucher } from "../../../src/refs";

export class GetReceiptVoucherService {
    static async currentBranch(branchId: string) {
        mustBeObjectId(branchId);
        return await ReceiptVoucher.find({ branchTransaction: branchId })
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
            .populate('client', 'sid name phone email city district address')
    }
}