import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyEventV2, APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyResultV2 } from 'aws-lambda'

const dynamoDB = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const getNextId = async (): Promise<number> => {
    const command = new UpdateCommand({
        TableName: 'Counter',
        Key: { name: 'post' },
        UpdateExpression: 'SET #v = if_not_exists(#v, :init) + :inc',
        ExpressionAttributeNames: { '#v': 'value' },
        ExpressionAttributeValues: {
            ':inc': 1,
            ':init': 0,
        },
        ReturnValues: 'UPDATED_NEW',
    })

    const result = await dynamoDB.send(command)
    return result.Attributes?.value
}

export const handler = async (event: APIGatewayProxyEventV2WithJWTAuthorizer): Promise<APIGatewayProxyResultV2> => {
    try {
        const { title, content }: { title: string; content: string } = JSON.parse(event.body || '{}')

        const user = event.requestContext.authorizer?.jwt?.claims
        if (!user || !user.sub || !user.username) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Unauthorized' }),
            }
        }

        const item = {
            id: String(await getNextId()),
            title,
            content,
            userId: user.sub,
            userName: user.username,
            createdAt: new Date().toISOString(),
        }

        const command = new PutCommand({
            TableName: 'Posts',
            Item: item,
        })

        await dynamoDB.send(command)

        return {
            statusCode: 201,
            body: JSON.stringify(item),
        }
    } catch (err) {
        const error = err as Error
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        }
    }
}
