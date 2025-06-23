import { CognitoIdentityProviderClient, ResendConfirmationCodeCommand } from '@aws-sdk/client-cognito-identity-provider'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'

const cognitoClient = new CognitoIdentityProviderClient({})

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const { username }: { username: string } = JSON.parse(event.body || '{}')

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
        const error = err as Error
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        }
    }
}
