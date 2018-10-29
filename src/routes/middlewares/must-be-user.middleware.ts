import { Request, NextFunction } from 'express';
// import { Staff, verifyLogInToken, mustExist } from '../../refs';

export async function mustBeUser(req: Request, res: any, next: NextFunction) {
    // try {
    //     const { _id } = await verifyLogInToken(req.headers.token as string);
    //     const staff = await Staff.findById(_id);
    //     mustExist(staff, 'CANNOT_FIND_STAFF', 404);
    //     req.query.staffId = _id;
    //     next();
    // } catch (error) {
    //     res.onError(error);
    // }
    next();
}
