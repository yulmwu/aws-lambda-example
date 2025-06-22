import { CognitoIdentityProviderClient, GlobalSignOutCommand } from '@aws-sdk/client-cognito-identity-provider'

const cognitoClient = new CognitoIdentityProviderClient()

export const handler = async (event) => {
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
                'Set-Cookie': `refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure`, 
            },
            body: JSON.stringify({ message: 'Logged out successfully' }),
        }
    } catch (error) {
        console.error('Logout error:', error)

        return {
            statusCode: error.name === 'NotAuthorizedException' ? 401 : 500,
            body: JSON.stringify({ message: error.message || 'Logout failed' }),
        }
    }
}
