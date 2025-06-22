import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb'

const db = DynamoDBDocumentClient.from(new DynamoDBClient())

export const handler = async (event) => {
    const id = parseInt(event.pathParameters.id)
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
            return { statusCode: 403, body: JSON.stringify({ message: '삭제 권한이 없습니다' }) }
        }

        const deleteCommand = new DeleteCommand({
            TableName: 'Posts',
            Key: { id },
        })
        await db.send(deleteCommand)

        return {
            statusCode: 200,
            body: JSON.stringify({ message: '삭제 완료' }),
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        }
    }
}
