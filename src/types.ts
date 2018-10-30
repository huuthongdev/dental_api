export enum Role {
    // Chủ tịch
    CHAIRMAN = 'CHAIRMAN',
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
    dataBackup: string
}