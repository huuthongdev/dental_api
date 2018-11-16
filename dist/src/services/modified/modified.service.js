"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const refs_1 = require("../../../src/refs");
class ModifiedService {
    static user(userId, updateBy, dataBackup) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(dataBackup).toString();
            const updateAt = Date.now();
            return yield refs_1.User.findByIdAndUpdate(userId, { $addToSet: { modifieds: { updateAt, updateBy, dataBackup: data } } }, { new: true });
        });
    }
    static branch(branchId, updateBy, dataBackup) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(dataBackup).toString();
            const updateAt = Date.now();
            return yield refs_1.Branch.findByIdAndUpdate(branchId, { $addToSet: { modifieds: { updateAt, updateBy, dataBackup: data } } }, { new: true });
        });
    }
    static service(serviceId, updateBy, dataBackup) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(dataBackup).toString();
            const updateAt = Date.now();
            return yield refs_1.Service.findByIdAndUpdate(serviceId, { $addToSet: { modifieds: { updateAt, updateBy, dataBackup: data } } }, { new: true });
        });
    }
    static product(productId, updateBy, dataBackup) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(dataBackup).toString();
            const updateAt = Date.now();
            return yield refs_1.Product.findByIdAndUpdate(productId, { $addToSet: { modifieds: { updateAt, updateBy, dataBackup: data } } }, { new: true });
        });
    }
    static client(clientId, updateBy, dataBackup) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(dataBackup).toString();
            const updateAt = Date.now();
            return yield refs_1.Client.findByIdAndUpdate(clientId, { $addToSet: { modifieds: { updateAt, updateBy, dataBackup: data } } }, { new: true });
        });
    }
    static ticket(ticketId, updateBy, dataBackup, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(dataBackup).toString();
            const updateAt = Date.now();
            yield refs_1.Ticket.findByIdAndUpdate(ticketId, { $addToSet: { modifieds: { updateAt, updateBy, dataBackup: data, message } } }, { new: true });
            return yield refs_1.TicketService.getTicketInfo(ticketId);
        });
    }
    static calendarDentist(calendarDentistId, updateBy, dataBackup) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(dataBackup).toString();
            const updateAt = Date.now();
            return yield refs_1.CalendarDentist.findByIdAndUpdate(calendarDentistId, { $addToSet: { modifieds: { updateAt, updateBy, dataBackup: data } } }, { new: true });
        });
    }
}
exports.ModifiedService = ModifiedService;
