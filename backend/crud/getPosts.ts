import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyResultV2 } from 'aws-lambda'

const dynamoDB = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler = async (): Promise<APIGatewayProxyResultV2> => {
    try {
        const command = new ScanCommand({ TableName: 'Posts' })
        const result = await dynamoDB.send(command)

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        }
    } catch (err) {
        const error = err as Error
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        }
    }
}
