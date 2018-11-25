import { Router } from "express";
import { CreateProductService, UpdateProductService, RemoveProductService, mustBeUser, GetAllProductService } from "../../src/refs";

export const productRouter = Router();

productRouter.use(mustBeUser);

// Get product
productRouter.get('/', (req, res: any) => {
    GetAllProductService.get()
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Create product
productRouter.post('/', (req, res: any) => {
    const { name, suggestedRetailerPrice, origin, unit, cost } = req.body;
    CreateProductService.create(req.query.userId, { name, suggestedRetailerPrice, origin, unit, cost })
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Update product
productRouter.put('/:productId', (req, res: any) => {
    const { name, suggestedRetailerPrice, origin, unit, cost } = req.body;
    UpdateProductService.update(req.params.productId, req.query.userId, { name, suggestedRetailerPrice, origin, unit, cost })
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Disable product
productRouter.put('/disable/:productId', (req, res: any) => {
    RemoveProductService.disable(req.params.productId, req.query.userId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Enable product
productRouter.put('/enable/:productId', (req, res: any) => {
    RemoveProductService.enable(req.params.productId, req.query.userId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

// Remove product
productRouter.delete('/:productId', (req, res: any) => {
    RemoveProductService.remove(req.params.productId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});

