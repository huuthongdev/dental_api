import { Router } from "express";
import { mustBeUser, CreateService, UpdateService, RemoveService, GetAllService, CreateServiceMeta } from "../../src/refs";

export const serviceRouter = Router();


serviceRouter.use(mustBeUser);

// Create Service meta
serviceRouter.post('/service-meta/:serviceId', (req, res: any) => {
    const { price } = req.body;
    CreateServiceMeta.create(req.params.serviceId, price, req.query.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Create new Service
serviceRouter.post('/', (req, res: any) => {
    const { name, suggestedRetailerPrice, basicProcedure, accessories, unit } = req.body;
    CreateService.create(req.query.userId, name, suggestedRetailerPrice, basicProcedure, accessories, unit)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Update service
serviceRouter.put('/:serviceId', (req, res: any) => {
    const { name, suggestedRetailerPrice, basicProcedure, accessories, unit } = req.body;
    UpdateService.update(req.query.userId, req.params.serviceId, name, suggestedRetailerPrice, basicProcedure, accessories, unit)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Remove service
serviceRouter.delete('/:serviceId', (req, res: any) => {
    RemoveService.remove(req.params.serviceId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Disable service
serviceRouter.put('/disable/:serviceId', (req, res: any) => {
    RemoveService.disable(req.query.userId, req.params.serviceId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Enable service
serviceRouter.put('/enable/:serviceId', (req, res: any) => {
    RemoveService.enable(req.query.userId, req.params.serviceId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Get all services
serviceRouter.get('/', (req, res: any) => {
    GetAllService.get()
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

