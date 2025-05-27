To run DynamoDB locally with Docker, you can use the official Amazon DynamoDB Docker image. Here's how you can do it:

1. Pull the DynamoDB Docker Image
Run the following command to pull the official DynamoDB Docker image:

docker pull amazon/dynamodb-local

2. Run DynamoDB Locally
Start a DynamoDB container using the following command:

docker run -p 8000:8000 -d --name dynamodb-local amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb -dbPath .

-d: Runs the container in detached mode.
-p 8000:8000: Maps port 8000 on your local machine to port 8000 in the container.
--name dynamodb-local: Assigns the name dynamodb-local to the container.
-sharedDb: option that allows NoSQL workbench to be able to access the tables.

3. Verify DynamoDB is Running

You can verify that DynamoDB is running by listing the running containers:

docker ps

You should see the dynamodb-local container in the list.

4. Access DynamoDB Locally

You can interact with DynamoDB locally using the AWS CLI or SDKs. For example, to list tables:

aws dynamodb list-tables --endpoint-url http://localhost:8000

Make sure you have the AWS CLI installed and configured.