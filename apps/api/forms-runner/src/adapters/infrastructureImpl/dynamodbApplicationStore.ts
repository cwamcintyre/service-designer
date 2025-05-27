import { injectable } from 'inversify';
import { ApplicationStore } from '@/usecase/shared/infrastructure/applicationStore';
import { Application } from '@model/formTypes';
import { DynamoDBClient, CreateTableCommand, GetItemCommand, PutItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

@injectable()
export class DynamoDBApplicationStore implements ApplicationStore {
    private client: DynamoDBClient;
    private tableName: string;

    constructor() {
        if (!process.env.DYNAMODB_APPLICATION_TABLE_NAME) {
            throw new Error("DYNAMODB_APPLICATION_TABLE_NAME environment variable is not defined.");
        }
        if (!process.env.AWS_REGION) {
            throw new Error("AWS_REGION environment variable is not defined.");
        }

        this.tableName = process.env.DYNAMODB_APPLICATION_TABLE_NAME;

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

    private async getItem(applicantId: string): Promise<Application | null> {
        try {
            const command = new GetItemCommand({
                TableName: this.tableName,
                Key: marshall({ id: applicantId }),
            });

            const { Item } = await this.client.send(command);
            return Item ? (unmarshall(Item) as Application) : null;
        } catch (error: any) {
            if (error.name === "ResourceNotFoundException") {
                return null; // Return null if the application is not found
            } else {
                throw new Error(`Error fetching application with ID ${applicantId}: ${error.message}`);
            }
        }
    }

    private async putItem(application: Application): Promise<void> {
        try {

            const applicationData = {
                ...application,
                createdAt: application.createdAt instanceof Date ? application.createdAt.toISOString() : application.createdAt,
                updatedAt: application.updatedAt instanceof Date ? application.updatedAt.toISOString() : application.updatedAt,
            };

            const command = new PutItemCommand({
                TableName: this.tableName,
                Item: marshall({ ...applicationData, id: application.applicantId }),
            });

            await this.client.send(command);
            console.log(`Application with ID '${application.applicantId}' has been saved.`);
        } catch (error: any) {
            throw new Error(`Error saving application with ID ${application.applicantId}: ${error.message}`);
        }
    }

    private async deleteItem(applicantId: string): Promise<void> {
        try {
            const command = new DeleteItemCommand({
                TableName: this.tableName,
                Key: marshall({ id: applicantId }),
            });

            await this.client.send(command);
            console.log(`Application with ID '${applicantId}' has been deleted.`);
        } catch (error: any) {
            if (error.name === "ResourceNotFoundException") {
                console.log(`Application with ID '${applicantId}' does not exist.`);
            } else {
                throw new Error(`Error deleting application with ID ${applicantId}: ${error.message}`);
            }
        }
    }

    async getApplication(applicantId: string): Promise<Application | null> {
        return this.getItem(applicantId);
    }

    async updateApplication(application: Application): Promise<void> {
        application.updatedAt = new Date(Date.now());
        await this.putItem(application);
    }

    async deleteApplication(applicantId: string): Promise<void> {
        await this.deleteItem(applicantId);
    }
}