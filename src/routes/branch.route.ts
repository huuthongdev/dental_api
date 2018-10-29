import { Router } from "express";
import { mustBeUser, CreateBranchService } from "../refs";

export const branchRouter = Router();

branchRouter.use(mustBeUser);

// Create new Branch
branchRouter.post('/', (req, res: any) => {
    const { name, email, phone, city, district, address } = req.body;
    CreateBranchService.create(req.query.userId, name, email, phone, city, district, address)
    .then(result => res.send({ success: true, result }))
    .catch(res.onError);
});