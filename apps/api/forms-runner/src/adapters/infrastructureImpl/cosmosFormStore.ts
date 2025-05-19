import { injectable } from 'inversify';
import { FormStore } from '@/usecase/shared/infrastructure/formStore';
import { Form } from '@model/formTypes';
import { CosmosClient } from '@azure/cosmos';

@injectable()
export class CosmosFormStore implements FormStore {
    private client: CosmosClient;
    private databaseId: string;
    private containerId: string;

    constructor() {

        if (!process.env.COSMOS_DB_ENDPOINT) {
            throw new Error("COSMOS_DB_ENDPOINT environment variable is not defined.");
        }
        if (!process.env.COSMOS_DB_KEY) {
            throw new Error("COSMOS_DB_KEY environment variable is not defined.");
        }
        if (!process.env.COSMOS_DB_NAME) {
            throw new Error("COSMOS_DB_NAME environment variable is not defined.");
        }
        if (!process.env.COSMOS_DB_CONTAINER_NAME) {
            throw new Error("COSMOS_DB_CONTAINER_NAME environment variable is not defined.");
        }

        const endpoint = process.env.COSMOS_DB_ENDPOINT;
        const key = process.env.COSMOS_DB_KEY;
        this.databaseId = process.env.COSMOS_DB_NAME;
        this.containerId = process.env.COSMOS_DB_CONTAINER_NAME;

        this.client = new CosmosClient({
            endpoint,
            key
        });

        this.initializeDatabaseAndContainer();
    }

    private async initializeDatabaseAndContainer() {
        try {
            // Ensure the database exists
            const { database } = await this.client.databases.createIfNotExists({ id: this.databaseId });
            console.log(`Database '${this.databaseId}' is ready.`);

            // Ensure the container exists
            const { container } = await database.containers.createIfNotExists({
                id: this.containerId,
                partitionKey: { paths: ["/id"] },
            });
            console.log(`Container '${this.containerId}' is ready.`);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error initializing database or container: ${error.message}`);
            } else {
                throw new Error("Error initializing database or container: Unknown error occurred.");
            }
        }
    }

    private getContainer() {
        return this.client.database(this.databaseId).container(this.containerId);
    }

    async getForm(formId: string): Promise<Form | null> {
        try {
            const { resource } = await this.getContainer().item(formId, formId).read<Form>();
            return resource || null;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error fetching form with ID ${formId}: ${error.message}`);
            } else {
                throw new Error(`Error fetching form with ID ${formId}: Unknown error occurred.`);
            }
        }
    }
}