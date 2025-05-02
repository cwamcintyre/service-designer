import os
from azure.cosmos import CosmosClient, PartitionKey

class CosmosFormStore:
    def __init__(self):
        # Load environment variables
        self.COSMOS_ENDPOINT = os.getenv('COSMOS_ENDPOINT')
        self.COSMOS_KEY = os.getenv('COSMOS_KEY')
        self.COSMOS_DATABASE = os.getenv('COSMOS_DATABASE')
        self.COSMOS_CONTAINER = os.getenv('COSMOS_CONTAINER')
        self.COSMOS_VERIFY_SSL = os.getenv('COSMOS_VERIFY_SSL', 'true').lower() == 'true'
        # Initialize Cosmos client
        self.client = CosmosClient(self.COSMOS_ENDPOINT, self.COSMOS_KEY, connection_verify=self.COSMOS_VERIFY_SSL)

        # Create database if it doesn't exist
        try:
            self.database = self.client.create_database_if_not_exists(self.COSMOS_DATABASE)
        except Exception as e:
            raise Exception(f"Failed to create or access database: {str(e)}")

        # Create container if it doesn't exist
        try:
            self.container = self.database.create_container_if_not_exists(
                id=self.COSMOS_CONTAINER,
                partition_key=PartitionKey(path='/formId')
            )
        except Exception as e:
            raise Exception(f"Failed to create or access container: {str(e)}")
        
    def read_config(self, form_id):
        """Read a graph by its ID from the Cosmos DB container."""
        try:
            return self.container.read_item(item=form_id, partition_key=form_id)
        except Exception as e:
            return str(e)