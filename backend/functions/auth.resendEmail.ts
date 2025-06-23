import {
    CognitoIdentityProviderClient,
    ResendConfirmationCodeCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { badRequest, error, internalServerError, required } from '../utils/httpError'

const cognitoClient = new CognitoIdentityProviderClient({})

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const { username } = JSON.parse(event.body ?? '{}')
        if (!username)
            return error(badRequest(required('username')))

        const command = new ResendConfirmationCodeCommand({
            ClientId: process.env.COGNITO_CLIENT_ID!,
            Username: username,
        })

        await cognitoClient.send(command)

        return {
            statusCode: 200,
            body: JSON.stringify({ message: '인증 코드 재전송 완료' }),
        }
    } catch (err) {
        return error(internalServerError((err as Error).message))
    }
}
