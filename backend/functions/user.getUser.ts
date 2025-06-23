import { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyResultV2 } from 'aws-lambda'
import { error, internalServerError, unauthorized } from '../utils/httpError'

export const handler = async (
    event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> => {
    try {
        const claims = event.requestContext.authorizer?.jwt?.claims
        if (!claims) return error(unauthorized('Unauthorized'))

        const userInfo = {
            // username: claims['cognito:username'],
            // email: claims.email,
            // sub: claims.sub,
            // email_verified: claims.email_verified,
            ...claims,
        }

        return {
            statusCode: 200,
            body: JSON.stringify(userInfo),
        }
    } catch (err) {
        return error(internalServerError((err as Error).message))
    }
}
