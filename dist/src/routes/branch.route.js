"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refs_1 = require("../refs");
exports.branchRouter = express_1.Router();
exports.branchRouter.use(refs_1.mustBeUser);
// Get all branch
exports.branchRouter.get('/', (req, res) => {
    refs_1.GetAllBranchService.get()
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Get branch detail data
exports.branchRouter.get('/detail/:branchId', (req, res) => {
    refs_1.GetBranchDetailDataService.get(req.params.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Get user in current branch
exports.branchRouter.get('/user-in-current-branch', (req, res) => {
    refs_1.GetAllUSerInCurrentBranch.getAll(req.query.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Create new Branch
exports.branchRouter.post('/', (req, res) => {
    const { name, email, phone, city, district, address, isMaster } = req.body;
    refs_1.CreateBranchService.create(req.query.userId, { name, email, phone, city, district, address }, isMaster)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Update branch
exports.branchRouter.put('/:branchId', (req, res) => {
    const { name, email, phone, city, district, address } = req.body;
    refs_1.UpdateBranchService.update(req.query.userId, req.params.branchId, { name, email, phone, city, district, address })
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Disable branch
exports.branchRouter.put('/disable/:branchId', (req, res) => {
    refs_1.RemoveBranchService.disable(req.query.userId, req.params.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Enable branch
exports.branchRouter.put('/enable/:branchId', (req, res) => {
    refs_1.RemoveBranchService.enable(req.query.userId, req.params.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Remove branch
exports.branchRouter.delete('/:branchId', (req, res) => {
    refs_1.RemoveBranchService.remove(req.query.userId, req.params.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
