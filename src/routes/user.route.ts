import { Router } from "express";
import { CreateUserService, LoginService, ChangePasswordService, mustBeUser, SetRoleInBranchService, CheckTokenUserService, GetAllEmployeesService, GetUserDetailDataService, mustHaveRole, Role, UpdateProfileUserInput, UpdateProfileUserService, ForgotPasswordService } from "../refs";

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

// Support forgot password
userRouter.post('/forgot-password', (req, res: any) => {
    const { email } = req.body;
    ForgotPasswordService.suggest(email)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Validate code PIN for change password
userRouter.post('/change-password-check-pin', (req, res: any) => {
    const { pin } = req.body;
    ForgotPasswordService.validatePIN(pin)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
})

// Change password with PIN code
userRouter.post('/change-password-with-pin', (req, res: any) => {
    const { pin, newPassword } = req.body;
    ForgotPasswordService.changePasswordWithPIN(pin, newPassword)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
})

userRouter.use(mustBeUser);

// Get all employees
userRouter.get('/employees', (req, res: any) => {
    GetAllEmployeesService.getAll(req.query.userId, req.query.branchId, req.query.roles)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Fetch All Employee for Director
userRouter.get('/fetch', (req, res: any) => {
    GetAllEmployeesService.getFullForCreateEmployee()
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Get user detail data
userRouter.get('/:_id', (req, res: any) => {
    GetUserDetailDataService.get(req.params._id)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Create new user
userRouter.post('/', mustHaveRole([Role.DIRECTOR]), (req, res: any) => {
    const { name, email, phone, password, birthday, city, district, address, homeTown, branchWorkId, branchRoles } = req.body;
    const createUserInput = { name, email, phone, password, birthday, city, district, address, homeTown, branchWorkId, branchRoles };
    CreateUserService.create(req.query.userId, createUserInput)
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

// Update user profile
userRouter.put('/:userUpdateId', mustHaveRole([Role.DIRECTOR]), (req, res: any) => {
    const { name, email, phone, city, district, address, homeTown, birthday } = req.body;
    const updateProfileUserInput = { name, email, phone, city, district, address, homeTown, birthday } as UpdateProfileUserInput;
    UpdateProfileUserService.update(req.query.userId, req.params.userUpdateId, updateProfileUserInput)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});





