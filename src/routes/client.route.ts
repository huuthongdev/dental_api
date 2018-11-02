import { Router } from "express";
import { mustBeUser, CreateClientService, UpdateClientService, RemoveClientService } from "../../src/refs";

export const clientRouter = Router();

clientRouter.use(mustBeUser);

// Create client
clientRouter.post('/', (req, res: any) => {
    const { name, phone, email, birthday, medicalHistory, city, district, address, homeTown } = req.body;
    CreateClientService.create(req.query.userId, name, phone, email, birthday, medicalHistory, city, district, address, homeTown)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Update client
clientRouter.put('/:clientId', (req, res: any) => {
    const { name, phone, email, birthday, medicalHistory, city, district, address, homeTown } = req.body;
    UpdateClientService.update(req.params.clientId, req.query.userId, name, phone, email, birthday, medicalHistory, city, district, address, homeTown)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Disable client
clientRouter.put('/disable/:clientId', (req, res: any) => {
    RemoveClientService.disable(req.query.userId, req.params.clientId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Enable client
clientRouter.put('/enable/:clientId', (req, res: any) => {
    RemoveClientService.enable(req.query.userId, req.params.clientId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Remove client
clientRouter.delete('/:clientId', (req, res: any) => {
    RemoveClientService.remove(req.params.clientId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

