"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const serviceMetaSchema = new mongoose_1.Schema({
    service: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Service' },
    price: { type: Number },
    branch: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Branch' }
});
const ServiceMetaModel = mongoose_1.model('ServiceMeta', serviceMetaSchema);
class ServiceMeta extends ServiceMetaModel {
}
exports.ServiceMeta = ServiceMeta;
