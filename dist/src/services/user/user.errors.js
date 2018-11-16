"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserError;
(function (UserError) {
    // Must Exist
    UserError["NAME_MUST_BE_PROVIDED"] = "NAME_MUST_BE_PROVIDED";
    UserError["EMAIL_MUST_BE_PROVIDED"] = "EMAIL_MUST_BE_PROVIDED";
    UserError["LOGIN_INFO_BE_PROVIDED"] = "LOGIN_INFO_BE_PROVIDED";
    UserError["PHONE_MUST_BE_PROVIDED"] = "PHONE_MUST_BE_PROVIDED";
    UserError["PASSWORD_MUST_BE_PROVIDED"] = "PASSWORD_MUST_BE_PROVIDED";
    UserError["CANNOT_FIND_USER"] = "CANNOT_FIND_USER";
    // Unique
    UserError["EMAIL_IS_EXISTED"] = "EMAIL_IS_EXISTED";
    UserError["PHONE_IS_EXISTED"] = "PHONE_IS_EXISTED";
    // Validate
    UserError["EMAIL_INCORRECT"] = "EMAIL_INCORRECT";
    UserError["INVALID_LOG_IN_INFO"] = "INVALID_LOG_IN_INFO";
    UserError["INVALID_USER_INFO"] = "INVALID_USER_INFO";
    // Change Password
    UserError["OLD_PASSWORD_MUST_BE_PROVIDED"] = "OLD_PASSWORD_MUST_BE_PROVIDED";
    UserError["NEW_PASSWORD_MUST_BE_PROVIDED"] = "NEW_PASSWORD_MUST_BE_PROVIDED";
    UserError["OLD_PASSWORD_INCORRECT"] = "OLD_PASSWORD_INCORRECT";
    // Role related
    UserError["PERMISSION_DENIED"] = "PERMISSION_DENIED";
    UserError["USER_INFO_EXPIRED"] = "USER_INFO_EXPIRED";
})(UserError = exports.UserError || (exports.UserError = {}));
