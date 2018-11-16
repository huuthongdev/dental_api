"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refs_1 = require("../../src/refs");
exports.receiptVoucherRouter = express_1.Router();
exports.receiptVoucherRouter.use(refs_1.mustBeUser);
// Create Ticket Receipt Voucher
exports.receiptVoucherRouter.post('/ticket/:ticketId', (req, res) => {
    const { clientId, totalPayment, content } = req.body;
    refs_1.CreateTicketReceiptVoucherService.create(req.query.userId, req.query.branchId, clientId, totalPayment, req.params.ticketId, content)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
