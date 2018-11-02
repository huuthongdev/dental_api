import { mustBeObjectId, mustExist, ClientError, Client, makeSure, validateEmail, SID_START_AT } from "../../../src/refs";

export class CreateClientService {
    static async validate(userId: string, name: string, phone: string, email?: string, birthday?: number, medicalHistory?: string[], city?: string, district?: string, address?: string, homeTown?: string) {
        mustBeObjectId(userId);
        // Must Exist
        mustExist(name, ClientError.NAME_MUST_BE_PROVIDED);
        mustExist(phone, ClientError.PHONE_MUST_BE_PROVIDED);
        // Validate Email
        if (email) makeSure(validateEmail(email), ClientError.EMAIL_INCORRECT);
        // Must Unique
        const checkEmail = await Client.count({ email });
        makeSure(checkEmail === 0, ClientError.EMAIL_IS_EXISTED);
        const checkPhone = await Client.count({ phone });
        makeSure(checkPhone === 0, ClientError.PHONE_IS_EXISTED);
    }

    static async create(userId: string, name: string, phone: string, email?: string, birthday?: number, medicalHistory?: string[], city?: string, district?: string, address?: string, homeTown?: string) {
        await this.validate(userId, name, phone, email, birthday, medicalHistory, city, district, address, homeTown);
        const sid = await this.getSid();
        const client = new Client({ sid, createBy: userId, name, phone, email, birthday, medicalHistory, city, district, address, homeTown });
        return await client.save();
    }

    static async getSid() {
        const maxSid = await Client.find({}).sort({ sid: -1 }).limit(1) as Client[];
        if (maxSid.length === 0) return SID_START_AT;
        return maxSid[0].sid + 1;
    }
}