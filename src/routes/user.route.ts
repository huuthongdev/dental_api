import { Router } from "express";
import { CreateUserService, LoginService, ChangePasswordService, mustBeUser, SetRoleInBranchService, CheckTokenUserService, GetAllEmployeesService, GetUserDetailDataService } from "../refs";

export const userRouter = Router();

// Check user
userRouter.get('/check', (req, res: any) => {
    CheckTokenUserService.check(req.headers.token as string)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Login
userRouter.post('/log-in', (req, res: any) => {
    const { loginInfo, password } = req.body;
    LoginService.login(loginInfo, password)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

userRouter.use(mustBeUser);

// Get all employees
userRouter.get('/employees', (req, res: any) => {
    GetAllEmployeesService.getAll(req.query.userId, req.query.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Get user detail data
userRouter.get('/detail/:_id', (req, res: any) => {
    GetUserDetailDataService.get(req.params._id)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

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



