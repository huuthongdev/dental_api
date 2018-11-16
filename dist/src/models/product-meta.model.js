"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productMetaSchema = new mongoose_1.Schema({
    branch: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Branch' },
    inventory: { type: Number, default: 0 }
});
const ProductMetaModel = mongoose_1.model('ProductMeta', productMetaSchema);
class ProductMeta extends ProductMetaModel {
}
exports.ProductMeta = ProductMeta;
