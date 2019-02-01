"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refs_1 = require("../../src/refs");
exports.serviceRouter = express_1.Router();
exports.serviceRouter.use(refs_1.mustBeUser);
// Create Service meta
exports.serviceRouter.post('/service-meta/:serviceId', (req, res) => {
    const { price } = req.body;
    refs_1.CreateServiceMeta.create(req.params.serviceId, price, req.query.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Create new Service
exports.serviceRouter.post('/', (req, res) => {
    const { name, suggestedRetailerPrice, basicProcedure, accessories, unit } = req.body;
    refs_1.CreateService.create(req.query.userId, { name, suggestedRetailerPrice, basicProcedure, accessories, unit })
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Update service
exports.serviceRouter.put('/:serviceId', (req, res) => {
    const { name, suggestedRetailerPrice, basicProcedure, accessories, unit } = req.body;
    refs_1.UpdateService.update(req.query.userId, req.params.serviceId, { name, suggestedRetailerPrice, basicProcedure, accessories, unit })
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Remove service
exports.serviceRouter.delete('/:serviceId', (req, res) => {
    refs_1.RemoveService.remove(req.params.serviceId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Disable service
exports.serviceRouter.put('/disable/:serviceId', (req, res) => {
    refs_1.RemoveService.disable(req.query.userId, req.params.serviceId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Enable service
exports.serviceRouter.put('/enable/:serviceId', (req, res) => {
    refs_1.RemoveService.enable(req.query.userId, req.params.serviceId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Get all services
exports.serviceRouter.get('/', (req, res) => {
    refs_1.GetAllService.get()
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
