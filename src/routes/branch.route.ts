import { Router } from "express";
import { mustBeUser, CreateBranchService, UpdateBranchService, DisableAndRemoveBranchService } from "../refs";

export const branchRouter = Router();

branchRouter.use(mustBeUser);

// Create new Branch
branchRouter.post('/', (req, res: any) => {
    const { name, email, phone, city, district, address, isMaster } = req.body;
    CreateBranchService.create(req.query.userId, name, email, phone, city, district, address, isMaster)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Update branch
branchRouter.put('/:branchId', (req, res: any) => {
    const { name, email, phone, city, district, address } = req.body;
    UpdateBranchService.update(req.query.userId, req.params.branchId, name, email, phone, city, district, address)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Disable branch
branchRouter.put('/disable/:branchId', (req, res: any) => {
    DisableAndRemoveBranchService.disable(req.query.userId, req.params.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Enable branch
branchRouter.put('/enable/:branchId', (req, res: any) => {
    DisableAndRemoveBranchService.enable(req.query.userId, req.params.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Remove branch
branchRouter.delete('/remove/:branchId', (req, res: any) => {
    DisableAndRemoveBranchService.remove(req.query.userId, req.params.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});