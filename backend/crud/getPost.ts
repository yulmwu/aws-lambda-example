import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'

const dynamoDB = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const id = event.pathParameters?.id
        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing id parameter' }),
            }
        }

        const command = new GetCommand({
            TableName: 'Posts',
            Key: { id },
        })

        const result = await dynamoDB.send(command)

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: '게시글을 찾을 수 없습니다' }),
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        }
    } catch (err) {
        const error = err as Error
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        }
    }
}
