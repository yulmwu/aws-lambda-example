import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'

const cognitoClient = new CognitoIdentityProviderClient({})

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const { username, password, email }: { username: string; password: string; email: string } = JSON.parse(event.body || '{}')

        const command = new SignUpCommand({
            ClientId: process.env.COGNITO_CLIENT_ID!,
            Username: username,
            Password: password,
            UserAttributes: [{ Name: 'email', Value: email }],
        })

        await cognitoClient.send(command)

        return {
            statusCode: 200,
            body: JSON.stringify({ message: '회원가입 성공' }),
        }
    } catch (err) {
        const error = err as Error
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        }
    }
}
