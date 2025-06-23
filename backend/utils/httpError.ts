export type HTTPError = {
    statusCode: number
    message: string
}

export const badRequest = (message: string): HTTPError => ({
    statusCode: 400,
    message,
})

export const unauthorized = (message: string): HTTPError => ({
    statusCode: 401,
    message,
})

export const forbidden = (message: string): HTTPError => ({
    statusCode: 403,
    message,
})

export const notFound = (message: string): HTTPError => ({
    statusCode: 404,
    message,
})

export const internalServerError = (message: string): HTTPError => ({
    statusCode: 500,
    message,
})

export const error = (err: HTTPError) => ({
    statusCode: err.statusCode,
    body: JSON.stringify({ error: err.message }),
})

export const required = (...fields: string[]) => {
    if (fields.length === 1) return `${fields[0]} is required`

    const last = fields.pop()
    return `${fields.join(', ')} and ${last!} are required`
}
