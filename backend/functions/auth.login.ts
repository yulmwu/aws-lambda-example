import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { badRequest, error, internalServerError, required } from '../utils/httpError'

const cognitoClient = new CognitoIdentityProviderClient({})

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const { username, password } = event.queryStringParameters ?? {}
        if (!username || !password) return error(badRequest(required('username', 'password')))

        const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: process.env.COGNITO_CLIENT_ID!,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password,
            },
        })

        const result = await cognitoClient.send(command)

        const accessToken = result.AuthenticationResult?.AccessToken
        const idToken = result.AuthenticationResult?.IdToken
        const refreshToken = result.AuthenticationResult?.RefreshToken

        return {
            statusCode: 200,
            headers: {
                'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${
                    30 * 24 * 60 * 60
                }; SameSite=None; Secure`,
            },
            body: JSON.stringify({
                accessToken,
                idToken,
            }),
        }
    } catch (err) {
        return error(internalServerError((err as Error).message))
    }
}
