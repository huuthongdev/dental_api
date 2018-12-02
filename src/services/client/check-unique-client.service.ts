import { Client, makeSure, ClientError } from "../../../src/refs";

export class CheckUniqueClientService {
    static async email(email: string) {
        const count = await Client.count({ email });
        makeSure(count === 0, ClientError.EMAIL_IS_EXISTED);
        return true;
    }

    static async phone(phone: string) {
        const count = await Client.count({ phone });
        makeSure(count === 0, ClientError.PHONE_IS_EXISTED);
        return true;
    }
}