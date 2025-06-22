import { CognitoIdentityProviderClient, ResendConfirmationCodeCommand } from '@aws-sdk/client-cognito-identity-provider'

const cognitoClient = new CognitoIdentityProviderClient()

export const handler = async (event) => {
    const { username } = JSON.parse(event.body)

    try {
        const command = new ResendConfirmationCodeCommand({
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: username,
        })

        await cognitoClient.send(command)

        return {
            statusCode: 200,
            body: JSON.stringify({ message: '인증 코드 재전송 완료' }),
        }
    } catch (err) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: err.message }),
        }
    }
}
