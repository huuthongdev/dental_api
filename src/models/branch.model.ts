import { model, Schema } from "mongoose";
import { User } from "../refs";
import { Modifield } from "../../src/types";

const branchSchema = new Schema({
    sid: { type: Number, required: true },
    // Information
    name: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: Number, required: true, trim: true, unique: true },
    isMaster: { type: Boolean, default: false },
     // Address
     city: { type: String, trim: true },
     district: { type: String, trim: true },
     address: { type: String, trim: true },
    //  Create Related
    createAt: { type: Number, default: Date.now() },
    createBy: { type: Schema.Types.ObjectId, ref: 'User' },
    // Modifield
    modifieds: [{  
        updateAt: { type: Number },
        dataBackup: { type: String }
    }]
});

const BranchModel = model('Branch', branchSchema);

export class Branch extends BranchModel {
    sid: number;
    // Information
    name: string;
    email: string;
    phone: number;
    isMaster: boolean;
     // Address
     city: string;
     district: string;
     address: string;
    //  Create Related
    createAt: number;
    createBy: User;
    // Modifield
    modifieds: Modifield[];
}

