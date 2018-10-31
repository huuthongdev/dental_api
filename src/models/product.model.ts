import { model, Schema } from "mongoose";
import { ProductMeta } from "../../src/refs";

const productSchema = new Schema({
    sid: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true, unique: true },
    suggestedRetailerPrice: { type: Number, required: true },
    origin: { type: String, trim: true },
    serial: { type: String, required: true, trim: true },
    productMetaes: [{ type: Schema.Types.ObjectId, ref: 'ProductMeta' }]
});

const ProductModel = model('Product', productSchema);

export class Product extends ProductModel {
    sid: number;
    name: string;
    suggestedRetailerPrice: number;
    origin: string;
    serial: string;
    productMetaes: ProductMeta[];
}