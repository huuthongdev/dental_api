import { Router } from "express";
import { mustBeUser, CreateService } from "../../src/refs";

export const serviceRouter = Router();

serviceRouter.use(mustBeUser);

// Create new Service
serviceRouter.post('/', (req, res: any) => {
    const { name, suggestedRetailerPrice, basicProcedure, accessories } = req.body;
    CreateService.create(req.query.userId, name, suggestedRetailerPrice, basicProcedure, accessories)
    .then(result => res.send({ success: true, result }))
    .catch(res.onError);
});