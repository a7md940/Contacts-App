export enum HttpStatusCode {
    NotFound = 404,
    BadRequest = 400,
    MethodNotAllowed = 405,
    Forbidden = 403,
    Unauthorized = 401,
    Conflict = 409,
    InternalError = 500,

    Created = 201,
    Ok = 200,
    NoContent = 204,
    Accepted = 202
}