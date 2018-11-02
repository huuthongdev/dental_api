import { Router } from "express";
import { CreateTicketReceipVoucher, mustBeUser } from "../../src/refs";

export const receiptVoucherRouter = Router();

receiptVoucherRouter.use(mustBeUser);

// Create Ticket Receipt Voucher
receiptVoucherRouter.post('/ticket/:ticketId', (req, res: any) => {
    const { clientId, totalPayment, content } = req.body;
    CreateTicketReceipVoucher.create(req.query.userId, req.query.branchId, clientId, totalPayment, req.params.ticketId, content)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});