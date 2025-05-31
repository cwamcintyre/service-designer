import { injectable } from 'inversify';
import { FormStore } from '@/usecase/shared/infrastructure/formStore';
import { Form } from '@model/formTypes';
import { DynamoDBClient, CreateTableCommand, GetItemCommand, PutItemCommand, DeleteItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

@injectable()
export class DynamoDBFormStore implements FormStore {
    private client: DynamoDBClient;
    private tableName: string;

    constructor() {
        if (!process.env.DYNAMODB_TABLE_NAME) {
            throw new Error("DYNAMODB_TABLE_NAME environment variable is not defined.");
        }
        if (!process.env.AWS_REGION) {
            throw new Error("AWS_REGION environment variable is not defined.");
        }

        this.tableName = process.env.DYNAMODB_TABLE_NAME;

        this.client = new DynamoDBClient({
            region: process.env.AWS_REGION,
            endpoint: process.env.DYNAMODB_LOCAL === 'true' ? 'http://localhost:8000' : undefined, // Use local endpoint if in development
        });

        this.initializeTable();
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
                throw new Error(`Error initializing DynamoDB table: ${error.message}`);
            }
        }
    }

    private async getItem(formId: string): Promise<Form | null> {
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

    private async putItem(formId: string, form: Form): Promise<void> {
        try {
            const command = new PutItemCommand({
                TableName: this.tableName,
                Item: marshall({ id: formId, ...form }),
            });

            await this.client.send(command);
            console.log(`Form with ID '${formId}' saved successfully.`);
        } catch (error: any) {
            throw new Error(`Error saving form with ID ${formId}: ${error.message}`);
        }
    }

    private async deleteItem(formId: string): Promise<void> {
        try {
            const command = new DeleteItemCommand({
                TableName: this.tableName,
                Key: marshall({ id: formId }),
            });

            await this.client.send(command);
            console.log(`Form with ID '${formId}' deleted successfully.`);
        } catch (error: any) {
            throw new Error(`Error deleting form with ID ${formId}: ${error.message}`);
        }
    }

    private async scanItems(): Promise<Form[]> {
        try {
            const command = new ScanCommand({
                TableName: this.tableName,
            });

            const { Items } = await this.client.send(command);
            return Items ? Items.map((item) => unmarshall(item) as Form) : [];
        } catch (error: any) {
            throw new Error(`Error fetching forms: ${error.message}`);
        }
    }

    async getForm(formId: string): Promise<Form | null> {
        return this.getItem(formId);
    }

    async getForms(): Promise<Form[]> {
        return this.scanItems();
    }

    async saveForm(formId: string, form: Form): Promise<void> {
        await this.putItem(formId, form);
    }

    async deleteForm(formId: string): Promise<void> {
        await this.deleteItem(formId);
    }

    async updateForm(formId: string, form: Form): Promise<void> {
        console.log(JSON.stringify(form, null, 2));
        await this.putItem(formId, form); // Upsert behavior in DynamoDB
    }
}