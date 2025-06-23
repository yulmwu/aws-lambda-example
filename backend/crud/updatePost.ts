import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyResultV2 } from 'aws-lambda'

const dynamoDB = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler = async (event: APIGatewayProxyEventV2WithJWTAuthorizer): Promise<APIGatewayProxyResultV2> => {
    try {
        const id = event.pathParameters?.id
        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing id parameter' }),
            }
        }

        const { title, content }: { title: string; content: string } = JSON.parse(event.body || '{}')

        const user = event.requestContext.authorizer?.jwt?.claims as {
            sub: string
        }

        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Unauthorized' }),
            }
        }

        const getCommand = new GetCommand({
            TableName: 'Posts',
            Key: { id },
        })

        const result = await dynamoDB.send(getCommand)

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: '게시글이 없습니다' }),
            }
        }

        if (result.Item.userId !== user.sub) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: '수정 권한이 없습니다' }),
            }
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

        const updated = await dynamoDB.send(updateCommand)

        return {
            statusCode: 200,
            body: JSON.stringify(updated.Attributes),
        }
    } catch (err) {
        const error = err as Error
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        }
    }
}
