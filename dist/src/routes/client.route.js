"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refs_1 = require("../../src/refs");
exports.clientRouter = express_1.Router();
exports.clientRouter.use(refs_1.mustBeUser);
// Get all clients
exports.clientRouter.get('/', (req, res) => {
    refs_1.GetAllClientsService.get()
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Create client
exports.clientRouter.post('/', (req, res) => {
    const { name, phone, email, birthday, medicalHistory, city, district, address, homeTown, gender } = req.body;
    const input = { name, phone, email, birthday, medicalHistory, city, district, address, homeTown, gender };
    refs_1.CreateClientService.create(req.query.userId, input)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Update client
exports.clientRouter.put('/:clientId', (req, res) => {
    const { name, phone, email, birthday, medicalHistory, city, district, address, homeTown, gender } = req.body;
    const updateClientInput = { name, email, phone, birthday, medicalHistory, gender, city, district, address, homeTown };
    refs_1.UpdateClientService.update(req.params.clientId, req.query.userId, updateClientInput)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Disable client
exports.clientRouter.put('/disable/:clientId', (req, res) => {
    refs_1.RemoveClientService.disable(req.query.userId, req.params.clientId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Enable client
exports.clientRouter.put('/enable/:clientId', (req, res) => {
    refs_1.RemoveClientService.enable(req.query.userId, req.params.clientId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Remove client
exports.clientRouter.delete('/:clientId', (req, res) => {
    refs_1.RemoveClientService.remove(req.params.clientId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
