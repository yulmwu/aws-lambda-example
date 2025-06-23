import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'

const cognitoClient = new CognitoIdentityProviderClient({})

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const { username, code }: { username: string; code: string } = JSON.parse(event.body || '{}')

        const command = new ConfirmSignUpCommand({
            ClientId: process.env.COGNITO_CLIENT_ID!,
            Username: username,
            ConfirmationCode: code,
        })

        await cognitoClient.send(command)

        return {
            statusCode: 200,
            body: JSON.stringify({ message: '이메일 인증 완료' }),
        }
    } catch (err) {
        const error = err as Error
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        }
    }
}
