"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Role;
(function (Role) {
    // Chủ tịch
    Role["ADMIN"] = "ADMIN";
    // Giám đốc điều hành chi nhánh
    Role["DIRECTOR"] = "DIRECTOR";
    // Chăm sóc khách hàng
    Role["CUSTOMER_CARE_MANAGER"] = "CUSTOMER_CARE_MANAGER";
    Role["CUSTOMER_CARE"] = "CUSTOMER_CARE";
    // Tài chính kế toán
    Role["ACCOUNTING_MANAGER"] = "ACCOUNTING_MANAGER";
    Role["ACCOUNTANT"] = "ACCOUNTANT";
    // X Ray
    Role["X_RAY"] = "X_RAY";
    // Nha sĩ
    Role["DENTISTS_MANAGER"] = "DENTISTS_MANAGER";
    Role["DENTIST"] = "DENTIST";
})(Role = exports.Role || (exports.Role = {}));
var ModifieldTicketMessage;
(function (ModifieldTicketMessage) {
    ModifieldTicketMessage["PAYMENT"] = "PAYMENT";
    ModifieldTicketMessage["UPDATE_ITEMS"] = "UPDATE_ITEMS";
    ModifieldTicketMessage["CHANGE_DENTIST_RESPONSIBLE"] = "CHANGE_DENTIST_RESPONSIBLE";
})(ModifieldTicketMessage = exports.ModifieldTicketMessage || (exports.ModifieldTicketMessage = {}));
