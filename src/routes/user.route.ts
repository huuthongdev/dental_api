import { Router } from "express";
import { CreateUserService, LoginService, ChangePasswordService, mustBeUser, SetRoleInBranchService } from "../refs";

export const userRouter = Router();

// Login
userRouter.post('/log-in', (req, res: any) => {
    const { email, phone, password } = req.body;
    LoginService.login(phone, email, password)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

userRouter.use(mustBeUser);

// Create new user
userRouter.post('/', (req, res: any) => {
    const { name, email, phone, password, birthday, city, district, address, homeTown, branchWorkId, branchRole } = req.body;
    CreateUserService.create(req.query.userId, name, email, phone, password, birthday, city, district, address, homeTown, branchWorkId, branchRole)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Change password
userRouter.post('/change-password', (req, res: any) => {
    const { oldPassword, newPassword } = req.body;
    ChangePasswordService.change(req.query.userId, oldPassword, newPassword)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Set role in branch
userRouter.put('/set-role-in-branch', (req, res: any) => {
    const { roles, userId, branchId } = req.body;
    SetRoleInBranchService.set(userId, branchId, roles)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
