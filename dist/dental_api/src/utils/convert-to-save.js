"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertToSave(value, valueToSaveIfYes = value, valueToSaveIfNo) {
    return value ? valueToSaveIfYes : valueToSaveIfNo;
}
exports.convertToSave = convertToSave;
