import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { badRequest, error, internalServerError, required } from '../utils/httpError'

const cognitoClient = new CognitoIdentityProviderClient({})

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const { username, password, email } = JSON.parse(event.body ?? '{}')
        if (!username || !password || !email)
            return error(badRequest(required('username', 'password', 'email')), 'ERR_SIGNUP_BAD_REQUEST')

        const command = new SignUpCommand({
            ClientId: process.env.COGNITO_CLIENT_ID!,
            Username: username,
            Password: password,
            UserAttributes: [{ Name: 'email', Value: email }],
        })

        await cognitoClient.send(command)

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Signup successful, please check your email for confirmation.' }),
        }
    } catch (err) {
        return error(internalServerError((err as Error).message), 'ERR_SIGNUP_INTERNAL_SERVER_ERROR')
    }
}
