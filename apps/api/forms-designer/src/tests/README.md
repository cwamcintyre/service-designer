Note that there are no unit tests in this project because its pretty much a wrapper around the infrastructure CRUD layer. 
Controllers simply call the use case and the use case simply calls the respective CRUD function to retrieve from or affect the data store. 
This is tested via the e2e tests for the solution as a whole.