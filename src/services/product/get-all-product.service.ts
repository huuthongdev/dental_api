import { Product } from "../../../src/refs";

export class GetAllProductService {
    static async get() {
        return Product.find({}).sort({ createAt: -1 });
    }
}