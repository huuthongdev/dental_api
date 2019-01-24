"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refs_1 = require("../../src/refs");
exports.mainRouter = express_1.Router();
exports.mainRouter.use(refs_1.mustBeUser);
exports.mainRouter.get('/dashboard-info', (req, res) => {
    refs_1.GetMainDashboardInfoService.get(req.query.branchId)
        .then(result => res.send({ success: true, result }))
        .catch(res.onError);
});
