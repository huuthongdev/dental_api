import { Router } from "express";
import { mustBeUser, CreateCalendarDentistService, ChangeStatusCalendarDentistService } from "../../src/refs";

export const calendarDentistRouter = Router();

calendarDentistRouter.use(mustBeUser);

// Create calendar dentist
calendarDentistRouter.post('/', (req, res: any) => {
    const { startTime, endTime, dentistId, ticketId, content } = req.body;
    CreateCalendarDentistService.create(req.query.userId, req.query.branchId, dentistId, startTime, endTime, content, ticketId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Change status calendar dentist
calendarDentistRouter.put('/change-status/:calendarDentistId', (req, res: any) => {
    const { status } = req.body;
    ChangeStatusCalendarDentistService.change(req.query.userId, req.params.calendarDentistId, status)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});