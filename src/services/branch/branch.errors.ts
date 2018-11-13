export enum BranchError {
    // Must Exist
    NAME_MUST_BE_PROVIDED = 'NAME_MUST_BE_PROVIDED',
    NAME_IS_EXISTED = 'NAME_IS_EXISTED',
    EMAIL_IS_EXISTED = 'EMAIL_IS_EXISTED',
    PHONE_IS_EXISTED = 'PHONE_IS_EXISTED',
    ONLY_ONE_MASTER_BRANCH = 'ONLY_ONE_MASTER_BRANCH',
    CANNOT_FIND_BRANCH = 'CANNOT_FIND_BRANCH',
    BRANCH_ID_MUST_BE_PROVIDED = 'BRANCH_ID_MUST_BE_PROVIDED',
    // Validate
    EMAIL_INCORRECT = 'EMAIL_INCORRECT',
    CANNOT_REMOVE_MASTER_BRANCH = 'CANNOT_REMOVE_MASTER_BRANCH',
    BRANCH_IS_DISABLED = 'BRANCH_IS_DISABLED'
}