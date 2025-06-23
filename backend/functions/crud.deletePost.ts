import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyResultV2 } from 'aws-lambda'
import { badRequest, error, forbidden, internalServerError, notFound, unauthorized } from '../utils/httpError'

const dynamoDB = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler = async (
    event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> => {
    try {
        const id = event.pathParameters?.id
        if (!id) return error(badRequest('Missing id parameter'))

        const user = event.requestContext.authorizer?.jwt?.claims
        if (!user || !user.sub || !user.username) return error(unauthorized('Unauthorized'))

        const getCommand = new GetCommand({
            TableName: 'Posts',
            Key: { id },
        })

        const result = await dynamoDB.send(getCommand)
        if (!result.Item) return error(notFound('게시글이 없습니다'))

        if (result.Item.userId !== user.sub) return error(forbidden('삭제 권한이 없습니다'))

        const deleteCommand = new DeleteCommand({
            TableName: 'Posts',
            Key: { id },
        })

        await dynamoDB.send(deleteCommand)

        return {
            statusCode: 200,
            body: JSON.stringify({ message: '삭제 완료' }),
        }
    } catch (err) {
        return error(internalServerError((err as Error).message))
    }
}
