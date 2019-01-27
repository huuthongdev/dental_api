"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const refs_1 = require("./refs");
exports.app = express_1.default();
exports.app.use(cors_1.default());
exports.app.use(body_parser_1.json());
exports.app.use(refs_1.onError);
// if (!process.env.NODE_ENV) app.use((req, res, next) => setTimeout(next, 200));
exports.app.get('/', (req, res) => res.send({ success: true, server: 'DENTAL_APPLICATION' }));
exports.app.use('/main', refs_1.mainRouter);
exports.app.use('/user', refs_1.userRouter);
exports.app.use('/branch', refs_1.branchRouter);
exports.app.use('/service', refs_1.serviceRouter);
exports.app.use('/product', refs_1.productRouter);
exports.app.use('/client', refs_1.clientRouter);
exports.app.use('/ticket', refs_1.ticketRouter);
exports.app.use('/receipt-voucher', refs_1.receiptVoucherRouter);
exports.app.use('/calendar-dentist', refs_1.calendarDentistRouter);
// Dev Router
exports.app.use('/dev', refs_1.devRouter);
exports.app.use((req, res) => res.status(404).send({ success: false, message: 'INVALID_ROUTE' }));
exports.app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send({ success: false, message: 'INTERNAL_SERVER_ERROR' });
});
