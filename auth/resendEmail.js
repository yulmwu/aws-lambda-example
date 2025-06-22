import { ResendConfirmationCodeCommand } from '@aws-sdk/client-cognito-identity-provider'
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'

const cognitoClient = new CognitoIdentityProviderClient()
const ssm = new SSMClient()

const getCognitoClientId = async () =>
    await ssm.send(
        new GetParameterCommand({
            Name: '/test/post/cognito_client_id',
        })
    ).Parameter?.Value

export const handler = async (event) => {
    const { username } = JSON.parse(event.body)

    try {
        const command = new ResendConfirmationCodeCommand({
            ClientId: await getCognitoClientId(),
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
