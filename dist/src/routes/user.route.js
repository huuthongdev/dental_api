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
exports.userRouter.use(refs_1.mustBeUser);
// Create new user
exports.userRouter.post('/', (req, res) => {
    const { name, email, phone, password, birthday, city, district, address, homeTown, branchWorkId, branchRole } = req.body;
    refs_1.CreateUserService.create(req.query.userId, name, email, phone, password, birthday, city, district, address, homeTown, branchWorkId, branchRole)
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
exports.userRouter.get('/employees', (req, res) => {
    refs_1.GetAllEmployeesService.getAll(req.query.userId, req.query.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
