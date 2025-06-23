import { CognitoIdentityProviderClient, GlobalSignOutCommand } from '@aws-sdk/client-cognito-identity-provider'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'

const cognitoClient = new CognitoIdentityProviderClient({})

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const authHeader = event.headers?.Authorization || event.headers?.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Unauthorized: No Bearer token' }),
            }
        }

        const accessToken = authHeader.substring('Bearer '.length)

        const command = new GlobalSignOutCommand({ AccessToken: accessToken })
        await cognitoClient.send(command)

        return {
            statusCode: 200,
            headers: {
                'Set-Cookie': 'refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure',
            },
            body: JSON.stringify({ message: 'Logged out successfully' }),
        }
    } catch (error) {
        const err = error as { name?: string; message?: string }

        return {
            statusCode: err.name === 'NotAuthorizedException' ? 401 : 500,
            body: JSON.stringify({ message: err.message || 'Logout failed' }),
        }
    }
}
