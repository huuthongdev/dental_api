"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const refs_1 = require("../refs");
mongoose_1.default.Promise = global.Promise;
function connectDatabase() {
    return mongoose_1.default.connect(refs_1.DATABASE_URI, { useMongoClient: true, promiseLibrary: global.Promise })
        .then(() => console.log(`DATABASE CONNECTED SUCCESSFULLY TO ${refs_1.DATABASE_URI}.`))
        .catch(error => (console.log(error), process.exit(1)));
}
exports.connectDatabase = connectDatabase;
