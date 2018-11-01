import { model, Schema } from "mongoose";
import { Branch } from "../../src/refs";

const serviceMetaSchema = new Schema({
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    price: { type: Number },
    branch: { type: Schema.Types.ObjectId, ref: 'Branch' }
});

const ServiceMetaModel = model('ServiceMeta', serviceMetaSchema);

export class ServiceMeta extends ServiceMetaModel {
    price: number;
    branch: string | Branch;
}