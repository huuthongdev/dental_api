"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refs_1 = require("../../src/refs");
exports.receiptVoucherRouter = express_1.Router();
exports.receiptVoucherRouter.use(refs_1.mustBeUser);
// Create Ticket Receipt Voucher
exports.receiptVoucherRouter.post('/ticket', (req, res) => {
    const { clientId, totalPayment, content, ticketId } = req.body;
    refs_1.CreateTicketReceiptVoucherService.create(req.query.userId, req.query.branchId, clientId, totalPayment, ticketId, content)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Get all ticket in branch
exports.receiptVoucherRouter.get('/', (req, res) => {
    refs_1.GetReceiptVoucherService.currentBranch(req.query.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
