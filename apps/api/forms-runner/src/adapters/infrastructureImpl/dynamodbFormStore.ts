import { injectable } from 'inversify';
import { FormStore } from '@/usecase/shared/infrastructure/formStore';
import { Form } from '@model/formTypes';
import { DynamoDBClient, CreateTableCommand, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

@injectable()
export class DynamoDBFormStore implements FormStore {
    private client: DynamoDBClient;
    private tableName: string;
    private initialised: boolean = false;

    constructor() {
        if (!process.env.DYNAMODB_FORM_TABLE_NAME) {
            throw new Error("DYNAMODB_FORM_TABLE_NAME environment variable is not defined.");
        }
        if (!process.env.AWS_REGION) {
            throw new Error("AWS_REGION environment variable is not defined.");
        }

        this.tableName = process.env.DYNAMODB_FORM_TABLE_NAME;

        this.client = new DynamoDBClient({
            region: process.env.AWS_REGION,
            endpoint: process.env.DYNAMODB_LOCAL === 'true' ? process.env.DYNAMODB_ENDPOINT : undefined, // Use local endpoint if in development
        });
    }

    private async initializeTable() {
        try {
            const command = new CreateTableCommand({
                TableName: this.tableName,
                KeySchema: [
                    { AttributeName: "id", KeyType: "HASH" }, // Partition key
                ],
                AttributeDefinitions: [
                    { AttributeName: "id", AttributeType: "S" }, // String type
                ],
                BillingMode: "PAY_PER_REQUEST", // On-Demand Capacity Mode
            });

            await this.client.send(command);
            console.log(`Table '${this.tableName}' is ready.`);
        } catch (error: any) {
            if (error.name === "ResourceInUseException") {
                console.log(`Table '${this.tableName}' already exists.`);
            } else {
                throw new Error(`Error initializing DynamoDB table: ${JSON.stringify(error, null, 2)}`);
            }
        }
        finally {
            this.initialised = true;
        }
    }

    private async getItem(formId: string): Promise<Form | null> {
        if (!this.initialised) {
            await this.initializeTable();
        }

        try {
            const command = new GetItemCommand({
                TableName: this.tableName,
                Key: marshall({ id: formId }),
            });

            const { Item } = await this.client.send(command);
            return Item ? (unmarshall(Item) as Form) : null;
        } catch (error: any) {
            throw new Error(`Error fetching form with ID ${formId}: ${error.message}`);
        }
    }

    async getForm(formId: string): Promise<Form | null> {
        return await this.getItem(formId);
    }
}