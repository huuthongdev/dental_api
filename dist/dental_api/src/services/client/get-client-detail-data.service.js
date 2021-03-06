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
class GetClientDetailDataService {
    static getDetailRelated(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Ticket
            const tickets = yield refs_1.Ticket.find({ client: clientId });
            return { tickets };
        });
    }
    static get(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(clientId);
            const clientInfo = yield refs_1.Client.findById(clientId);
            refs_1.mustExist(clientInfo, refs_1.ClientError.CANNOT_FIND_CLIENT);
            const detail = yield this.getDetailRelated(clientId);
            let client = clientInfo.toObject();
            return Object.assign({}, client, detail);
        });
    }
}
exports.GetClientDetailDataService = GetClientDetailDataService;
