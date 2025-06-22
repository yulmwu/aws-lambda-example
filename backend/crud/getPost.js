import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'

const dynamoDB = DynamoDBDocumentClient.from(new DynamoDBClient())

export const handler = async (event) => {
    const id = event.pathParameters.id

    try {
        const command = new GetCommand({
            TableName: 'Posts',
            Key: { id },
        })

        const result = await dynamoDB.send(command)

        if (!result.Item) {
            return { statusCode: 404, body: JSON.stringify({ message: '게시글을 찾을 수 없습니다' }) }
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        }
    }
}
