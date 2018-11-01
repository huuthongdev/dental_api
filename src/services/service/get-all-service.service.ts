import { Service } from "../../../src/refs";

export class GetAllService {
    static async get() {
        return await Service.find({});
    }
}