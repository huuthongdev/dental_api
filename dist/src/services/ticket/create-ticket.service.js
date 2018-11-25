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
class CreateTicketService {
    static validate(userId, createTicketInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clientId, dentistId, branchId, items } = createTicketInput;
            refs_1.mustBeObjectId(clientId, userId, dentistId);
            // Must exist
            const client = yield refs_1.Client.findById(clientId);
            refs_1.mustExist(client, refs_1.ClientError.CANNOT_FIND_CLIENT);
            const dentist = yield refs_1.CheckRoleInBranchService.check(dentistId, branchId, [refs_1.Role.DENTIST, refs_1.Role.DENTISTS_MANAGER]);
            refs_1.mustExist(dentist, refs_1.TicketError.DENTIST_INFO_INVALID);
            // Make Sure
            refs_1.makeSure(items && items.length !== 0, refs_1.TicketError.ITEMS_MUST_BE_PROVIDED);
            // Get total amount
            let totalAmount = 0;
            for (let i = 0; i < items.length; i++) {
                const service = yield refs_1.Service.findById(items[i].service).select('serviceMetaes suggestedRetailerPrice').populate('serviceMetaes');
                refs_1.mustExist(service, refs_1.ServiceError.CANNOT_FIND_SERVICE);
                const serviceMeta = yield refs_1.ServiceMeta.findOne({ branch: branchId, service: service._id });
                if (serviceMeta)
                    totalAmount += +serviceMeta.price * items[i].qty;
                if (!serviceMeta)
                    totalAmount += +service.suggestedRetailerPrice * items[i].qty;
            }
            return +totalAmount;
        });
    }
    static create(userId, createTicketInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clientId, dentistId, branchId, items } = createTicketInput;
            const totalAmount = yield this.validate(userId, createTicketInput);
            const sid = yield this.getSid();
            const ticket = new refs_1.Ticket({
                sid,
                client: clientId,
                staffCustomerCase: userId,
                dentistResponsible: dentistId,
                branchRegister: branchId,
                items,
                totalAmount
            });
            yield ticket.save();
            return yield refs_1.TicketService.getTicketInfo(ticket._id);
        });
    }
    static getSid() {
        return __awaiter(this, void 0, void 0, function* () {
            const maxSid = yield refs_1.Ticket.find({}).sort({ sid: -1 }).limit(1);
            if (maxSid.length === 0)
                return refs_1.SID_START_AT;
            return maxSid[0].sid + 1;
        });
    }
}
exports.CreateTicketService = CreateTicketService;
