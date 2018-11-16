"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const serviceSchema = new mongoose_1.Schema({
    sid: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true, unique: true },
    suggestedRetailerPrice: { type: Number, required: true },
    basicProcedure: [{ type: String, trim: true }],
    unit: { type: String, trim: true, required: true },
    accessories: [{
            product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' },
            qty: { type: Number }
        }],
    serviceMetaes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'ServiceMeta' }],
    //  Create Related
    isActive: { type: Boolean, default: true },
    createAt: { type: Number, default: Date.now() },
    createBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    // Modifield
    modifieds: [{
            updateAt: { type: Number },
            updateBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            dataBackup: { type: String }
        }]
});
const ServiceModel = mongoose_1.model('Service', serviceSchema);
class Service extends ServiceModel {
}
exports.Service = Service;
