import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider'

const client = new CognitoIdentityProviderClient({ region: 'ap-northeast-2' })

export const handler = async (event) => {
    const refreshToken = event.cookies?.find(c => c.startsWith('refreshToken='))?.split('=')[1]

    try {
        const command = new InitiateAuthCommand({
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: process.env.COGNITO_CLIENT_ID,
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
        console.error('Token refresh failed:', error)
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Token refresh failed', error: error.message }),
        }
    }
}
