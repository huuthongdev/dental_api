import { model, Schema } from "mongoose";
import { ServiceMeta, AccessorieItem } from "../../src/refs";

const serviceSchema = new Schema({
    sid: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true, unique: true },
    suggestedRetailerPrice: { type: Number, required: true },
    basicProcedure: [{ type: String, trim: true }],
    accessories: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        total: { type: Number }
    }],
    serviceMetaes: [{ type: Schema.Types.ObjectId, ref: 'ServiceMeta' }],
    //  Create Related
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
    sid: string;
    name: string;
    suggestedRetailerPrice: number;
    basicProcedure: string[];
    accessories: AccessorieItem[];
    metaBranch: ServiceMeta[];
}

