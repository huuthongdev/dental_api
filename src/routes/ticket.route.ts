import { Router } from "express";
import { mustBeUser, CreateTicketService, UpdateTicketService } from "../../src/refs";

export const ticketRouter = Router();

ticketRouter.use(mustBeUser);

// Create ticket
ticketRouter.post('/', (req, res: any) => {
    const { clientId, dentistId, items } = req.body;
    CreateTicketService.create(req.query.userId, { clientId, dentistId, branchId: req.query.branchId, items })
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Update Item ticket
ticketRouter.put('/items/:ticketId', (req, res: any) => {
    const { items } = req.body;
    UpdateTicketService.items(req.params.ticketId, req.query.userId, req.query.branchId, items)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Update Dentist Reponsible
ticketRouter.put('/dentist-responsible/:ticketId', (req, res: any) => {
    const { dentistId } = req.body;
    UpdateTicketService.dentistResponsible(req.params.ticketId, req.query.userId, req.query.branchId, dentistId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});