import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider'
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
    const { username, password } = JSON.parse(event.body)

    try {
        const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: await getCognitoClientId(),
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password,
            },
        })

        const result = await cognitoClient.send(command)

        return {
            statusCode: 200,
            body: JSON.stringify({
                accessToken: result.AuthenticationResult.AccessToken,
                idToken: result.AuthenticationResult.IdToken,
                refreshToken: result.AuthenticationResult.RefreshToken,
            }),
        }
    } catch (err) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: err.message }),
        }
    }
}
