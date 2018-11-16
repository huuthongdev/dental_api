"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const refs_1 = require("./refs");
refs_1.connectDatabase();
refs_1.initDatabase();
const port = process.env.PORT || 4000;
refs_1.app.listen(port, () => console.log('SERVER STARTED SUCCESSFULLY!'));
