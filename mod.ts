import type { Middleware } from "https://deno.land/x/oak@v11.1.0/mod.ts"
import { Status } from "https://deno.land/x/oak@v11.1.0/mod.ts"
import { createHttpError } from "https://deno.land/std@0.165.0/http/http_errors.ts"
import secureCompare from "https://deno.land/x/secure_compare@1.0.0/mod.ts";

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
// TODO: create version for router // RouterMiddleware

type Username = string
type Password = string
type Users = Record<Username, Password>

const unauthorizedError = createHttpError(Status.Unauthorized, "Unauthorized", {
    headers: {
        "WWW-Authenticate": "Basic"
    }
})

export default (users: Users): Middleware => {
    return async (context, next) => {
        const authHeader = context.request.headers.get("Authorization")
        if (authHeader === null) throw unauthorizedError
        const authHeaderMatch = authHeader.match(/^Basic (.+)/)
        const credentials = authHeaderMatch?.[1]
        if (credentials) {
            const decodedCredentials = atob(credentials)
            const separatorIndex = decodedCredentials.indexOf(":")
            const name = decodedCredentials.slice(0, separatorIndex)
            const password = decodedCredentials.slice(separatorIndex+1, decodedCredentials.length)
            if (secureCompare(users[name], password)) {
                await next()
            } else {
                throw unauthorizedError
            }
        } else {
            throw unauthorizedError
        }
    }
}
