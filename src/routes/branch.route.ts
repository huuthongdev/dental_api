import { Router } from "express";
import { CreateBranchService, UpdateBranchService, RemoveBranchService, mustBeChairman, GetAllUSerInCurrentBranch, mustBeDirector } from "../refs";

export const branchRouter = Router();

branchRouter.get('/user-in-current-branch', mustBeDirector , (req, res: any) => {
    GetAllUSerInCurrentBranch.getAll(req.query.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

branchRouter.use(mustBeChairman);

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
    RemoveBranchService.disable(req.query.userId, req.params.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Enable branch
branchRouter.put('/enable/:branchId', (req, res: any) => {
    RemoveBranchService.enable(req.query.userId, req.params.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Remove branch
branchRouter.delete('/:branchId', (req, res: any) => {
    RemoveBranchService.remove(req.query.userId, req.params.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});