import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { badRequest, error, internalServerError, required } from '../utils/httpError'

const cognitoClient = new CognitoIdentityProviderClient({})

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const { username, code } = JSON.parse(event.body ?? '{}')
        if (!username || !code) return error(badRequest(required('username', 'code')), 'ERR_CONFIRM_EMAIL_BAD_REQUEST')

        const command = new ConfirmSignUpCommand({
            ClientId: process.env.COGNITO_CLIENT_ID!,
            Username: username,
            ConfirmationCode: code,
        })

        await cognitoClient.send(command)

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email confirmation successful' }),
        }
    } catch (err) {
        return error(internalServerError((err as Error).message), 'ERR_CONFIRM_EMAIL_INTERNAL_SERVER_ERROR')
    }
}
