"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    sid: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true, unique: true },
    suggestedRetailerPrice: { type: Number, required: true },
    origin: { type: String, trim: true },
    productMetaes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'ProductMeta' }],
    cost: { type: Number, default: 0 },
    unit: { type: String, trim: true, required: true },
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
const ProductModel = mongoose_1.model('Product', productSchema);
class Product extends ProductModel {
}
exports.Product = Product;
