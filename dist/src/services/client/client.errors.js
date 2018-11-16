"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientError;
(function (ClientError) {
    ClientError["NAME_MUST_BE_PROVIDED"] = "NAME_MUST_BE_PROVIDED";
    ClientError["PHONE_MUST_BE_PROVIDED"] = "PHONE_MUST_BE_PROVIDED";
    // NAME_IS_EXISTED = 'NAME_IS_EXISTED',
    ClientError["PHONE_IS_EXISTED"] = "PHONE_IS_EXISTED";
    ClientError["EMAIL_IS_EXISTED"] = "EMAIL_IS_EXISTED";
    ClientError["EMAIL_INCORRECT"] = "EMAIL_INCORRECT";
    ClientError["CANNOT_FIND_CLIENT"] = "CANNOT_FIND_CLIENT";
})(ClientError = exports.ClientError || (exports.ClientError = {}));
