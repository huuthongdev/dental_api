import { Router } from "express";
import { mustBeUser, CreateClientService, UpdateClientService, RemoveClientService, GetAllClientsService, CheckUniqueClientService, GetClientDetailDataService } from "../../src/refs";

export const clientRouter = Router();

clientRouter.use(mustBeUser);

// Get all clients
clientRouter.get('/', (req, res: any) => {
    GetAllClientsService.get()
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Create client
clientRouter.post('/', (req, res: any) => {
    const { name, phone, email, birthday, medicalHistory, city, district, address, homeTown, gender } = req.body;
    const input = { name, phone, email, birthday, medicalHistory, city, district, address, homeTown, gender };
    CreateClientService.create(req.query.userId, input)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Update client
clientRouter.put('/:clientId', (req, res: any) => {
    const { name, phone, email, birthday, medicalHistory, city, district, address, homeTown, gender } = req.body;
    const updateClientInput = { name, email, phone, birthday, medicalHistory, gender, city, district, address, homeTown };
    UpdateClientService.update(req.params.clientId, req.query.userId, updateClientInput)
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

// Check Unique Client - Phone
clientRouter.post('/validate-phone', (req, res: any) => {
    const { phone } = req.body;
    CheckUniqueClientService.phone(phone)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Check Unique Client - Email
clientRouter.post('/validate-email', (req, res: any) => {
    const { email } = req.body;
    CheckUniqueClientService.email(email)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Get Client Detail
clientRouter.get('/detail/:clientId', (req, res: any) => {
    GetClientDetailDataService.get(req.params.clientId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

