import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyResultV2 } from 'aws-lambda'
import { badRequest, error, forbidden, internalServerError, notFound, required, unauthorized } from '../utils/httpError'

const dynamoDB = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler = async (
    event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> => {
    try {
        const id = event.pathParameters?.id
        if (!id) return error(badRequest('Missing id parameter'))

        const { title, content } = JSON.parse(event.body ?? '{}')
        if (!title || !content) return error(badRequest(required('title', 'content')))

        const user = event.requestContext.authorizer?.jwt?.claims
        if (!user) return error(unauthorized('Unauthorized'))

        const getCommand = new GetCommand({
            TableName: 'Posts',
            Key: { id },
        })

        const result = await dynamoDB.send(getCommand)
        if (!result.Item) return error(notFound('게시글이 없습니다'))

        if (result.Item.userId !== user.sub) return error(forbidden('수정 권한이 없습니다'))

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
        return error(internalServerError((err as Error).message))
    }
}
