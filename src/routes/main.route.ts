import { Router } from "express";
import { mustBeUser, GetMainDashboardInfoService } from "../../src/refs";

export const mainRouter = Router();

mainRouter.use(mustBeUser);

mainRouter.get('/dashboard-info', (req, res: any) => {
    GetMainDashboardInfoService.get(req.query.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
})