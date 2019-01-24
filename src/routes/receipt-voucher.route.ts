import { Router } from "express";
import { CreateTicketReceiptVoucherService, mustBeUser, GetReceiptVoucherService } from "../../src/refs";

export const receiptVoucherRouter = Router();

receiptVoucherRouter.use(mustBeUser);

// Create Ticket Receipt Voucher
receiptVoucherRouter.post('/ticket', (req, res: any) => {
    const { clientId, totalPayment, content, ticketId } = req.body;
    CreateTicketReceiptVoucherService.create(req.query.userId, req.query.branchId, clientId, totalPayment, ticketId, content)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Get all ticket in branch
receiptVoucherRouter.get('/', (req, res: any) => {
    GetReceiptVoucherService.currentBranch(req.query.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
})