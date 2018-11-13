import { Router } from "express";
import { mustBeUser } from "../../src/refs";

// TODO: Test middleware
export const devRouter = Router();

devRouter.post('/middleware/must-be-user', mustBeUser ,(req, res: any) => {
    res.send({ success: true });
});