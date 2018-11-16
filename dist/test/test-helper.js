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
const refs_1 = require("../src/refs");
const init_database_1 = require("../src/database/init-database");
before(() => __awaiter(this, void 0, void 0, function* () { return yield refs_1.connectDatabase(); }));
beforeEach(() => __awaiter(this, void 0, void 0, function* () {
    yield refs_1.User.remove({});
    yield refs_1.Branch.remove({});
    yield refs_1.Service.remove({});
    yield refs_1.Product.remove({});
    yield refs_1.RoleInBranch.remove({});
    yield refs_1.Client.remove({});
    yield refs_1.ReceiptVoucher.remove({});
    yield refs_1.Ticket.remove({});
    yield refs_1.CalendarDentist.remove({});
    yield init_database_1.prepareDataInit();
}));
