import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider'
import { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyResultV2 } from 'aws-lambda'
import { error, internalServerError, unAuthorized } from '../../utils/httpError'

const cognitoClient = new CognitoIdentityProviderClient({})

export const handler = async (event: APIGatewayProxyEventV2WithJWTAuthorizer): Promise<APIGatewayProxyResultV2> => {
    try {
        const authHeader = event.headers.authorization || event.headers.Authorization
        if (!authHeader) return error(unAuthorized(), 'ERR_GET_USER_NO_AUTH_HEADER')

        const token = authHeader.split(' ')[1] // 'Bearer xxx'
        if (!token) return error(unAuthorized(), 'ERR_GET_USER_NO_TOKEN')

        const getUserCommand = new GetUserCommand({ AccessToken: token })
        const response = await cognitoClient.send(getUserCommand)

        const userAttributes = Object.fromEntries(
            (response.UserAttributes || []).map((attr) => [attr.Name, attr.Value])
        )

        return {
            statusCode: 200,
            body: JSON.stringify({
                username: response.Username,
                ...userAttributes,
            }),
        }
    } catch (err) {
        return error(internalServerError((err as Error).message), 'ERR_GET_USER_INTERNAL_SERVER_ERROR')
    }
}
