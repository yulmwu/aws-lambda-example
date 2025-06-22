import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider'

const cognitoClient = new CognitoIdentityProviderClient()

export const handler = async (event) => {
    const { username, password } = JSON.parse(event.body)
    const isProd = process.env.NODE_ENV === 'production'

    try {
        const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: process.env.COGNITO_CLIENT_ID,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password,
            },
        })

        const result = await cognitoClient.send(command)

        const accessToken = result.AuthenticationResult.AccessToken
        const idToken = result.AuthenticationResult.IdToken
        const refreshToken = result.AuthenticationResult.RefreshToken

        const cookie = `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax${isProd ? '; Secure' : ''}`

        return {
            statusCode: 200,
            headers: {
                'Set-Cookie': cookie,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': process.env.FRONTEND_ORIGIN || '*',
                'Access-Control-Allow-Credentials': 'true',
            },
            body: JSON.stringify({
                accessToken,
                idToken,
            }),
        }
    } catch (err) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': process.env.FRONTEND_ORIGIN || '*',
                'Access-Control-Allow-Credentials': 'true',
            },
            body: JSON.stringify({ error: err.message }),
        }
    }
}
