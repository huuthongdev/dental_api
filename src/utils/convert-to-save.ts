export function convertToSave(value: any, valueToSaveIfYes = value, valueToSaveIfNo?: any) {
    return value ? valueToSaveIfYes: valueToSaveIfNo;
}
