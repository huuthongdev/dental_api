import { mustBeObjectId, mustExist, ClientError, validateEmail, makeSure, Client, modifiedSelect, ModifiedService, Gender } from "../../../src/refs";

export interface UpdateClientInput {
    name: string;
    email: string;
    phone: string;
    birthday?: number;
    medicalHistory?: string[];
    gender?: Gender;
    // Address
    city?: string;
    district?: string;
    address?: string;
    homeTown?: string;
}
export class UpdateClientService {
    static async validate(clientId: string, userId: string, updateClientInput: UpdateClientInput) {
        const { name, email, phone, birthday, medicalHistory, gender, city, district, address, homeTown } = updateClientInput;
        mustBeObjectId(userId, clientId);
        // Must Exist
        mustExist(name, ClientError.NAME_MUST_BE_PROVIDED);
        mustExist(phone, ClientError.PHONE_MUST_BE_PROVIDED);
        const oldClient = await Client.findById(clientId).select(modifiedSelect) as Client;
        mustExist(oldClient, ClientError.CANNOT_FIND_CLIENT);
        // Validate Email
        if (email) makeSure(validateEmail(email), ClientError.EMAIL_INCORRECT);
        // Must Unique
        const checkEmail = await Client.count({ email, _id: { $ne: clientId } });
        makeSure(checkEmail === 0, ClientError.EMAIL_IS_EXISTED);
        const checkPhone = await Client.count({ phone, _id: { $ne: clientId } });
        makeSure(checkPhone === 0, ClientError.PHONE_IS_EXISTED);
        return oldClient;
    }

    static async update(clientId: string, userId: string, updateClientInput: UpdateClientInput) {
        const { name, email, phone, birthday, medicalHistory, gender, city, district, address, homeTown } = updateClientInput;
        const oldClient = await this.validate(clientId, userId, updateClientInput);
        await Client.findByIdAndUpdate(clientId, { name, phone, email, birthday, medicalHistory, city, district, address, homeTown }, { new: true });
        return await ModifiedService.client(clientId, userId, oldClient);
    }
}