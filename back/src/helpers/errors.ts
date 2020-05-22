import {httpError} from "../models/responses"

export const noAuthorizationHeaderError : httpError = {
    body : "No authorization header",
    status : 401
}

export const credentialsError : httpError = {
    body : "No email or password specified",
    status : 400
}

export const createAlreadyExistsError : httpError = {
    body : "Email already exists",
    status : 409
}

export const createBodyError : httpError = {
    body : "No email or password specified",
    status : 400
}

export const loginCredentialsFailError : httpError = {
    body : "Login failed! Check authentication credentials",
    status :  401
}

export const jwtError : httpError = {
    body : "Authorization token malformed",
    status :  401
}

export const notAuthorizedError : httpError = {
    body : "Not authorized to access this resource",
    status : 401
}

export const forgotEmailError : httpError = {
    body : "No account with that email address exists",
    status : 401
}

export const resetTokenError : httpError = {
    body : "Password reset token is invalid or has expired",
    status : 401
}