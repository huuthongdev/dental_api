"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refs_1 = require("../../src/refs");
exports.clientRouter = express_1.Router();
exports.clientRouter.use(refs_1.mustBeUser);
// Create client
exports.clientRouter.post('/', (req, res) => {
    const { name, phone, email, birthday, medicalHistory, city, district, address, homeTown } = req.body;
    refs_1.CreateClientService.create(req.query.userId, name, phone, email, birthday, medicalHistory, city, district, address, homeTown)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Update client
exports.clientRouter.put('/:clientId', (req, res) => {
    const { name, phone, email, birthday, medicalHistory, city, district, address, homeTown } = req.body;
    refs_1.UpdateClientService.update(req.params.clientId, req.query.userId, name, phone, email, birthday, medicalHistory, city, district, address, homeTown)
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
