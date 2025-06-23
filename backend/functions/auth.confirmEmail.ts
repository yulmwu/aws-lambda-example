import {
    CognitoIdentityProviderClient,
    ConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { badRequest, error, internalServerError, required } from '../utils/httpError'

const cognitoClient = new CognitoIdentityProviderClient({})

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const { username, code } = JSON.parse(event.body ?? '{}')
        if (!username || !code) return error(badRequest(required('username', 'code')))

        const command = new ConfirmSignUpCommand({
            ClientId: process.env.COGNITO_CLIENT_ID!,
            Username: username,
            ConfirmationCode: code,
        })

        await cognitoClient.send(command)

        return {
            statusCode: 200,
            body: JSON.stringify({ message: '이메일 인증이 완료되었습니다.' }),
        }
    } catch (err) {
        return error(internalServerError((err as Error).message))
    }
}
