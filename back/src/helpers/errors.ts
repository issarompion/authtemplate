import {IHttpError} from "../models/responses"

export const noAuthorizationHeaderError : IHttpError = {
    body : "No authorization header",
    status : 401
}

export const credentialsError : IHttpError = {
    body : "No email or password specified",
    status : 400
}

export const createAlreadyExistsError : IHttpError = {
    body : "Email already exists",
    status : 409
}

export const createBodyError : IHttpError = {
    body : "No email or password specified",
    status : 400
}

export const loginCredentialsFailError : IHttpError = {
    body : "Login failed! Check authentication credentials",
    status :  401
}

export const jwtError : IHttpError = {
    body : "Authorization token malformed",
    status :  401
}

export const notAuthorizedError : IHttpError = {
    body : "Not authorized to access this resource",
    status : 401
}

export const forgotEmailError : IHttpError = {
    body : "No account with that email address exists",
    status : 401
}

export const resetTokenError : IHttpError = {
    body : "Password reset token is invalid or has expired",
    status : 401
}