"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refs_1 = require("../refs");
exports.userRouter = express_1.Router();
// Check user
exports.userRouter.get('/check', (req, res) => {
    refs_1.CheckTokenUserService.check(req.headers.token)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Login
exports.userRouter.post('/log-in', (req, res) => {
    const { loginInfo, password } = req.body;
    refs_1.LoginService.login(loginInfo, password)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Support forgot password
exports.userRouter.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    refs_1.ForgotPasswordService.suggest(email)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Validate code PIN for change password
exports.userRouter.post('/change-password-check-pin', (req, res) => {
    const { pin } = req.body;
    refs_1.ForgotPasswordService.validatePIN(pin)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Change password with PIN code
exports.userRouter.post('/change-password-with-pin', (req, res) => {
    const { pin, newPassword } = req.body;
    refs_1.ForgotPasswordService.changePasswordWithPIN(pin, newPassword)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
exports.userRouter.use(refs_1.mustBeUser);
// Get all employees
exports.userRouter.get('/employees', (req, res) => {
    refs_1.GetAllEmployeesService.getAll(req.query.userId, req.query.branchId, req.query.roles)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Fetch All Employee for Director
exports.userRouter.get('/fetch', (req, res) => {
    refs_1.GetAllEmployeesService.getFullForCreateEmployee()
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Get user detail data
exports.userRouter.get('/:_id', (req, res) => {
    refs_1.GetUserDetailDataService.get(req.params._id)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Create new user
exports.userRouter.post('/', refs_1.mustHaveRole([refs_1.Role.DIRECTOR]), (req, res) => {
    const { name, email, phone, password, birthday, city, district, address, homeTown, branchWorkId, branchRoles } = req.body;
    const createUserInput = { name, email, phone, password, birthday, city, district, address, homeTown, branchWorkId, branchRoles };
    refs_1.CreateUserService.create(req.query.userId, createUserInput)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Change password
exports.userRouter.post('/change-password', (req, res) => {
    const { oldPassword, newPassword } = req.body;
    refs_1.ChangePasswordService.change(req.query.userId, oldPassword, newPassword)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Set role in branch
exports.userRouter.put('/set-role-in-branch', (req, res) => {
    const { roles, userId, branchId } = req.body;
    refs_1.SetRoleInBranchService.set(userId, branchId, roles)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Update user profile
exports.userRouter.put('/:userUpdateId', refs_1.mustHaveRole([refs_1.Role.DIRECTOR]), (req, res) => {
    const { name, email, phone, city, district, address, homeTown, birthday } = req.body;
    const updateProfileUserInput = { name, email, phone, city, district, address, homeTown, birthday };
    refs_1.UpdateProfileUserService.update(req.query.userId, req.params.userUpdateId, updateProfileUserInput)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
