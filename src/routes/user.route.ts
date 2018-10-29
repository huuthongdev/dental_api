import { Router } from "express";
import { CreateUserService, LoginService } from "../refs";
import { mustBeUser } from "./middlewares/must-be-user.middleware";

export const userRouter = Router();

userRouter.use(mustBeUser);

// Create new user
userRouter.post('/', (req, res: any) => {
    const { name, email, phone, password, birthday, city, district, address, homeTown, roleInBranchs } = req.body;
    CreateUserService.create(req.query.userId, name, email, phone, password, birthday, city, district, address, homeTown, roleInBranchs)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Login
userRouter.post('/log-in', (req, res: any) => {
    const { email, phone, password } = req.body;
    LoginService.login(phone, email, password)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});