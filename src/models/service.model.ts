import { model, Schema } from "mongoose";
import { ServiceMeta, AccessorieItem, User } from "../../src/refs";

const serviceSchema = new Schema({
    sid: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true, unique: true },
    suggestedRetailerPrice: { type: Number, required: true },
    basicProcedure: [{ type: String, trim: true }],
    unit: { type: String, trim: true, required: true },
    accessories: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        qty: { type: Number }
    }],
    serviceMetaes: [{ type: Schema.Types.ObjectId, ref: 'ServiceMeta' }],
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

const ServiceModel = model('Service', serviceSchema);

export class Service extends ServiceModel {
    sid: number;
    name: string;
    suggestedRetailerPrice: number;
    basicProcedure: string[];
    unit: string;
    accessories: AccessorieItem[];
    serviceMetaes: ServiceMeta[];
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

