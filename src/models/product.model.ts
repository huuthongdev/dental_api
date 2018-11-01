import { model, Schema } from "mongoose";
import { ProductMeta, User } from "../../src/refs";

const productSchema = new Schema({
    sid: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true, unique: true },
    suggestedRetailerPrice: { type: Number, required: true },
    origin: { type: String, trim: true },
    productMetaes: [{ type: Schema.Types.ObjectId, ref: 'ProductMeta' }],
    cost: { type: Number, default: 0 },
    //  Create Related
    isActive: { type: Boolean, default: true },
    createAt: { type: Number, default: Date.now() },
    createBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Modifield
    modifieds: [{
        updateAt: { type: Number },
        updateBy: { type: Schema.Types.ObjectId, ref: 'User' },
        dataBackup: { type: String }
    }]
});

const ProductModel = model('Product', productSchema);

export class Product extends ProductModel {
    sid: number;
    name: string;
    suggestedRetailerPrice: number;
    origin: string;
    serial: string;
    productMetaes: ProductMeta[];
    cost: number;
    //  Create Related
    isActive: boolean;
    createAt: number;
    createBy: string | User;
    // Modifield
    modifieds: [{
        updateAt: number,
        updateBy: string | User,
        dataBackup: string
    }]
}