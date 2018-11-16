"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refs_1 = require("../../src/refs");
exports.calendarDentistRouter = express_1.Router();
exports.calendarDentistRouter.use(refs_1.mustBeUser);
// Create calendar dentist
exports.calendarDentistRouter.post('/', (req, res) => {
    const { startTime, endTime, dentistId, ticketId, content } = req.body;
    refs_1.CreateCalendarDentistService.create(req.query.userId, req.query.branchId, dentistId, startTime, endTime, content, ticketId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
// Change status calendar dentist
exports.calendarDentistRouter.put('/change-status/:calendarDentistId', (req, res) => {
    const { status } = req.body;
    refs_1.ChangeStatusCalendarDentistService.change(req.query.userId, req.params.calendarDentistId, status)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
