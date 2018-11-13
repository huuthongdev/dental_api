import { Product } from "./refs";

export enum Role {
    // Chủ tịch
    ADMIN = 'ADMIN',
    // Giám đốc điều hành chi nhánh
    DIRECTOR = 'DIRECTOR',
    // Chăm sóc khách hàng
    CUSTOMER_CARE_MANAGER = 'CUSTOMER_CARE_MANAGER',
    CUSTOMER_CARE = 'CUSTOMER_CARE',
    // Tài chính kế toán
    ACCOUNTING_MANAGER = 'ACCOUNTING_MANAGER',
    ACCOUNTANT = 'ACCOUNTANT',
    // X Ray
    X_RAY = 'X_RAY',
    // Nha sĩ
    DENTISTS_MANAGER = 'DENTISTS_MANAGER',
    DENTIST = 'DENTIST',
}

export interface Modifield {
    _id: string,
    updateAt: number,
    dataBackup: string,
    message: string
}

export interface AccessorieItem {
    product: string | Product;
    qty: number;
}

export enum ModifieldTicketMessage {
    PAYMENT = 'PAYMENT',
    UPDATE_ITEMS = 'UPDATE_ITEMS',
    CHANGE_DENTIST_RESPONSIBLE = 'CHANGE_DENTIST_RESPONSIBLE'
}