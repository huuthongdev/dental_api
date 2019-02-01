"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BranchError;
(function (BranchError) {
    // Must Exist
    BranchError["NAME_MUST_BE_PROVIDED"] = "NAME_MUST_BE_PROVIDED";
    BranchError["NAME_IS_EXISTED"] = "NAME_IS_EXISTED";
    BranchError["EMAIL_IS_EXISTED"] = "EMAIL_IS_EXISTED";
    BranchError["PHONE_IS_EXISTED"] = "PHONE_IS_EXISTED";
    BranchError["ONLY_ONE_MASTER_BRANCH"] = "ONLY_ONE_MASTER_BRANCH";
    BranchError["CANNOT_FIND_BRANCH"] = "CANNOT_FIND_BRANCH";
    BranchError["BRANCH_ID_MUST_BE_PROVIDED"] = "BRANCH_ID_MUST_BE_PROVIDED";
    // Validate
    BranchError["EMAIL_INCORRECT"] = "EMAIL_INCORRECT";
    BranchError["CANNOT_REMOVE_MASTER_BRANCH"] = "CANNOT_REMOVE_MASTER_BRANCH";
    BranchError["BRANCH_IS_DISABLED"] = "BRANCH_IS_DISABLED";
})(BranchError = exports.BranchError || (exports.BranchError = {}));
