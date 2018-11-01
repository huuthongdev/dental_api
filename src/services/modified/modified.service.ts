import { User, Branch, Service, Product } from "../../../src/refs";

export class ModifiedService {

    static async user(userId: string, updateBy: string, dataBackup: User) {
        const data = JSON.stringify(dataBackup).toString();
        const updateAt = Date.now();
        return await User.findByIdAndUpdate(userId, { $addToSet: { modifieds: { updateAt, updateBy, dataBackup: data } } }, { new: true });
    }

    static async branch(branchId: string, updateBy: string, dataBackup: Branch) {
        const data = JSON.stringify(dataBackup).toString();
        const updateAt = Date.now();
        return await Branch.findByIdAndUpdate(branchId, { $addToSet: { modifieds: { updateAt, updateBy, dataBackup: data } } }, { new: true });
    }

    static async service(serviceId: string, updateBy: string, dataBackup: Service) {
        const data = JSON.stringify(dataBackup).toString();
        const updateAt = Date.now();
        return await Service.findByIdAndUpdate(serviceId, { $addToSet: { modifieds: { updateAt, updateBy, dataBackup: data } } }, { new: true });
    }

    static async product(productId: string, updateBy: string, dataBackup: Product) {
        const data = JSON.stringify(dataBackup).toString();
        const updateAt = Date.now();
        return await Product.findByIdAndUpdate(productId, { $addToSet: { modifieds: { updateAt, updateBy, dataBackup: data } } }, { new: true });
    }
}