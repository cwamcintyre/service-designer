const { DynamoDBClient, CreateTableCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const path = require('path');
const fs = require('fs');

async function seedData() {
    const tableName = process.env.DYNAMODB_TABLE_NAME;
    const dynamoDBEndpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
    const region = process.env.AWS_REGION || 'eu-west-2';

    if (!tableName) {
        throw new Error('DYNAMODB_TABLE_NAME environment variable is not defined.');
    }

    // Initialize DynamoDB client
    const client = new DynamoDBClient({
        region,
        endpoint: dynamoDBEndpoint,
    });

    // Step 1: Ensure the table exists
    console.log(`Ensuring table '${tableName}' exists...`);
    try {
        const createTableCommand = new CreateTableCommand({
            TableName: tableName,
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' }, // Partition key
            ],
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'S' }, // String type
            ],
            BillingMode: 'PAY_PER_REQUEST', // On-Demand Capacity Mode
        });

        await client.send(createTableCommand);
        console.log(`Table '${tableName}' created successfully.`);
    } catch (error) {
        if (error.name === 'ResourceInUseException') {
            console.log(`Table '${tableName}' already exists.`);
        } else {
            console.error('Error creating table:', error.message);
            process.exit(1);
        }
    }

    // Step 2: Seed data into the table
    console.log('Seeding data into the table...');
    const dataDir = path.resolve('./e2e/setup/data');
    const files = fs.readdirSync(dataDir).filter((file) => file.endsWith('.json'));

    console.log(`Found ${files.length} JSON files in ${dataDir}.`);

    for (const file of files) {
        const filePath = path.join(dataDir, file);

        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const jsonData = JSON.parse(fileContent);

            const command = new PutItemCommand({
                TableName: tableName,
                Item: marshall(jsonData)
            });

            await client.send(command);
            console.log(`Inserted item from ${file} into table '${tableName}'.`);

        } catch (error) {
            throw new Error(`Error processing file ${file}: ${error.message}`);
        }
    }

    console.log('Data seeding completed.');
}

module.exports = { seedData };