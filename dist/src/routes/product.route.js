"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refs_1 = require("../../src/refs");
exports.productRouter = express_1.Router();
exports.productRouter.use(refs_1.mustBeUser);
// Get product
exports.productRouter.get('/', (req, res) => {
    refs_1.GetAllProductService.get()
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Create product
exports.productRouter.post('/', (req, res) => {
    const { name, suggestedRetailerPrice, origin, unit, cost } = req.body;
    refs_1.CreateProductService.create(req.query.userId, { name, suggestedRetailerPrice, origin, unit, cost })
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Update product
exports.productRouter.put('/:productId', (req, res) => {
    const { name, suggestedRetailerPrice, origin, unit, cost } = req.body;
    refs_1.UpdateProductService.update(req.params.productId, req.query.userId, { name, suggestedRetailerPrice, origin, unit, cost })
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Disable product
exports.productRouter.put('/disable/:productId', (req, res) => {
    refs_1.RemoveProductService.disable(req.params.productId, req.query.userId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Enable product
exports.productRouter.put('/enable/:productId', (req, res) => {
    refs_1.RemoveProductService.enable(req.params.productId, req.query.userId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Remove product
exports.productRouter.delete('/:productId', (req, res) => {
    refs_1.RemoveProductService.remove(req.params.productId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
