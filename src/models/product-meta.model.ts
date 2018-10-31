import { Schema, model } from "mongoose";
import { Branch } from "../../src/refs";

const productMetaSchema = new Schema({
    branch: { type: Schema.Types.ObjectId, ref: 'Branch' },
    inventory: { type: Number, default: 0 }
});

const ProductMetaModel = model('ProductMeta', productMetaSchema);

export class ProductMeta extends ProductMetaModel {
    branch: string | Branch;
    inventory: number;
}