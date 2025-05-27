import { inject, injectable } from 'inversify';
import { FormStore } from '@/usecase/shared/infrastructure/formStore';
import { ApplicationStore } from '@/usecase/shared/infrastructure/applicationStore';
import { Form } from '@model/formTypes';
import { Application } from '@model/formTypes';
import { CosmosClient } from '@azure/cosmos';
import { AppTypes } from '~/ioc/appTypes';

@injectable()
export class CosmosApplicationStore implements ApplicationStore {
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
        if (!process.env.COSMOS_DB_DATA_CONTAINER_NAME) {
            throw new Error("COSMOS_DB_DATA_CONTAINER_NAME environment variable is not defined.");
        }

        const endpoint = process.env.COSMOS_DB_ENDPOINT;
        const key = process.env.COSMOS_DB_KEY;
        this.databaseId = process.env.COSMOS_DB_NAME;
        this.containerId = process.env.COSMOS_DB_DATA_CONTAINER_NAME;

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

     async getApplication(applicantId: string): Promise<Application | null> {
        try {
            const { resource } = await this.getContainer().item(applicantId, applicantId).read<Application>();
            return resource || null;
        } catch (error) {
            if (error instanceof Error && error.message.includes("NotFound")) {
                return null; // Return null if the application is not found
            } else if (error instanceof Error) {
                throw new Error(`Error fetching application with ID ${applicantId}: ${error.message}`);
            } else {
                throw new Error(`Error fetching application with ID ${applicantId}: Unknown error occurred.`);
            }
        }
    }

    async updateApplication(application: Application): Promise<void> {
        try {
            application.updatedAt = new Date(Date.now());
            await this.getContainer().items.upsert({ ...application, id: application.applicantId });
            console.log(`Application with ID ${application.applicantId} has been updated.`);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error updating application with ID ${application.applicantId}: ${error.message}`);
            } else {
                throw new Error(`Error updating application with ID ${application.applicantId}: Unknown error occurred.`);
            }
        }
    }

    async deleteApplication(formId: string): Promise<void> {
        try {
            await this.getContainer().item(formId, formId).delete();
            console.log(`Application with ID ${formId} has been deleted.`);
        } catch (error) {
            if (error instanceof Error && error.message.includes("NotFound")) {
                console.log(`Application with ID ${formId} does not exist.`);
            } else if (error instanceof Error) {
                throw new Error(`Error deleting application with ID ${formId}: ${error.message}`);
            } else {
                throw new Error(`Error deleting application with ID ${formId}: Unknown error occurred.`);
            }
        }
    }
}