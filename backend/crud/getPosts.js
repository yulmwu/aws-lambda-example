import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const dynamoDB = DynamoDBDocumentClient.from(new DynamoDBClient())

export const handler = async () => {
    try {
        const command = new ScanCommand({ TableName: 'Posts' })
        const result = await dynamoDB.send(command)

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        }
    }
}
