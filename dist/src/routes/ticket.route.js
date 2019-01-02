"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refs_1 = require("../../src/refs");
exports.ticketRouter = express_1.Router();
exports.ticketRouter.use(refs_1.mustBeUser);
// Get all ticket 
exports.ticketRouter.get('/', (req, res) => {
    refs_1.GetAllTicketService.getAll()
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Create ticket
exports.ticketRouter.post('/', (req, res) => {
    const { clientId, dentistId, items } = req.body;
    refs_1.CreateTicketService.create(req.query.userId, { clientId, dentistId, branchId: req.query.branchId, items })
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Update Item ticket
exports.ticketRouter.put('/items/:ticketId', (req, res) => {
    const { items } = req.body;
    refs_1.UpdateTicketService.items(req.params.ticketId, req.query.userId, req.query.branchId, items)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Update Dentist Reponsible
exports.ticketRouter.put('/dentist-responsible/:ticketId', (req, res) => {
    const { dentistId } = req.body;
    refs_1.UpdateTicketService.dentistResponsible(req.params.ticketId, req.query.userId, req.query.branchId, dentistId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
