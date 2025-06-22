import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
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
    const { username, code } = JSON.parse(event.body)

    try {
        const command = new ConfirmSignUpCommand({
            ClientId: await getCognitoClientId(),
            Username: username,
            ConfirmationCode: code,
        })

        await cognitoClient.send(command)

        return {
            statusCode: 200,
            body: JSON.stringify({ message: '이메일 인증 완료' }),
        }
    } catch (err) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: err.message }),
        }
    }
}
