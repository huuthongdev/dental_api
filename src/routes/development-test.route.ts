import { Router } from "express";
import { mustBeUser, mustHaveRole, Role } from "../../src/refs";

// TODO: Test middleware
export const devRouter = Router();

devRouter.post('/middleware/must-be-user', mustBeUser, (req, res: any) => {
    res.send({ success: true });
});

devRouter.get('/middleware/must-have-role', mustHaveRole([Role.DENTIST]), (req, res: any) => {
    res.send({ success: true });
});