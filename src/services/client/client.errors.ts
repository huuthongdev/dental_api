export enum ClientError {
    NAME_MUST_BE_PROVIDED = 'NAME_MUST_BE_PROVIDED',
    PHONE_MUST_BE_PROVIDED = 'PHONE_MUST_BE_PROVIDED',
    // NAME_IS_EXISTED = 'NAME_IS_EXISTED',
    PHONE_IS_EXISTED = 'PHONE_IS_EXISTED',
    EMAIL_IS_EXISTED = 'EMAIL_IS_EXISTED',
    EMAIL_INCORRECT = 'EMAIL_INCORRECT',
    CANNOT_FIND_CLIENT = 'CANNOT_FIND_CLIENT'
}