import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'

const client = new CognitoIdentityProviderClient({ region: 'ap-northeast-2' })

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const cookies = event.cookies || []
        const refreshToken = cookies.find((c) => c.startsWith('refreshToken='))?.split('=')[1]

        if (!refreshToken) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'No refresh token found' }),
            }
        }

        const command = new InitiateAuthCommand({
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: process.env.COGNITO_CLIENT_ID!,
            AuthParameters: {
                REFRESH_TOKEN: refreshToken,
            },
        })

        const response = await client.send(command)

        return {
            statusCode: 200,
            body: JSON.stringify({
                accessToken: response.AuthenticationResult?.AccessToken,
                idToken: response.AuthenticationResult?.IdToken,
                expiresIn: response.AuthenticationResult?.ExpiresIn,
            }),
        }
    } catch (error) {
        const err = error as Error
        console.error('Token refresh failed:', err)

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Token refresh failed',
                error: err.message,
            }),
        }
    }
}
