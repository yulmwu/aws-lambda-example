import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb'

const db = DynamoDBDocumentClient.from(new DynamoDBClient())

export const handler = async (event) => {
    const id = parseInt(event.pathParameters.id)
    const { title, content } = JSON.parse(event.body)
    const user = event.requestContext.authorizer.jwt.claims

    try {
        const getCommand = new GetCommand({
            TableName: 'Posts',
            Key: { id },
        })
        const result = await db.send(getCommand)

        if (!result.Item) {
            return { statusCode: 404, body: JSON.stringify({ message: '게시글이 없습니다' }) }
        }
        if (result.Item.userId !== user.sub) {
            return { statusCode: 403, body: JSON.stringify({ message: '수정 권한이 없습니다' }) }
        }

        const updateCommand = new UpdateCommand({
            TableName: 'Posts',
            Key: { id },
            UpdateExpression: 'SET #t = :t, #c = :c',
            ExpressionAttributeNames: {
                '#t': 'title',
                '#c': 'content',
            },
            ExpressionAttributeValues: {
                ':t': title,
                ':c': content,
            },
            ReturnValues: 'ALL_NEW',
        })

        const updated = await db.send(updateCommand)

        return {
            statusCode: 200,
            body: JSON.stringify(updated.Attributes),
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        }
    }
}
