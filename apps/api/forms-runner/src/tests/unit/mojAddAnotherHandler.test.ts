// this tests for error handling. functionality is mainly covered by the usecase tests.
import { PageHandlerFactory } from '@/utils/pageHandler/pageHandlerFactory';
import { PageHandler } from '@/utils/pageHandler/interfaces';
import { PageTypes, type AddAnotherPage, type Application } from '@model/formTypes';

describe('DefaultPageHandler', () => {
    let defaultPageHandler: PageHandler;
    
    beforeEach(() => {
        defaultPageHandler = PageHandlerFactory.For(PageTypes.MoJAddAnother);
    });

    describe('Process', () => {
        it('should throw an error if the page is not found', async () => {
            const application = { pages: [] } as any; // Mock application with no pages
            await expect(defaultPageHandler.Process(application, 'non-existent-page', {})).rejects.toThrow('Page with ID non-existent-page not found.');
        });

        it('should throw an error if the component does not have a name', async () => {
            const application: Application = { 
                pages: [{ 
                    pageId: 'page1', 
                    components: [{ questionId: 'unknown-component', type: "text", name: undefined }], 
                    numberOfItems: 1, 
                    numberOfItemsToStartWith: 0, 
                    addAnotherButtonLabel: 'Add Another', 
                } as AddAnotherPage], 
                id: 'mock-id',
                applicantId: 'mock-applicant-id',
                status: 'mock-status',
                createdAt: new Date(),
                updatedAt: new Date(),
                formId: 'mock-form-id',
                title: 'Mock Title',
                description: 'Mock Description',
                startPage: 'mock-start-page',
                submission: {
                    method: 'mock-method',
                    endpoint: 'mock-endpoint'
                },
                isCreated: true // Add a mock isCreated flag
            }; // Mock application with all required properties
            await expect(defaultPageHandler.Process(application, 'page1', {})).rejects.toThrow('Component name is undefined for component ID unknown-component.');
        });  

        it('should throw an error if the component does not have a type', async () => {
            const application: Application = { 
                pages: [{ 
                    pageId: 'page1', 
                    components: [{ questionId: 'unknown-component', name: 'mock-name' }], 
                    numberOfItems: 1, 
                    numberOfItemsToStartWith: 0, 
                    addAnotherButtonLabel: 'Add Another', 
                } as AddAnotherPage], 
                id: 'mock-id',
                applicantId: 'mock-applicant-id',
                status: 'mock-status',
                createdAt: new Date(),
                updatedAt: new Date(),
                formId: 'mock-form-id',
                title: 'Mock Title',
                description: 'Mock Description',
                startPage: 'mock-start-page',
                submission: {
                    method: 'mock-method',
                    endpoint: 'mock-endpoint'
                },
                isCreated: true // Add a mock isCreated flag
            }; // Mock application with all required properties
            await expect(defaultPageHandler.Process(application, 'page1', {})).rejects.toThrow('Component type is undefined for component ID unknown-component.');
        });  

        it('should throw an error if the component does not have a handler', async () => {
            const application: Application = { 
                pages: [{ 
                    pageId: 'page1', 
                    components: [{ questionId: 'unknown-component', type: "unknown", name: "mock-name" }], 
                    numberOfItems: 1, 
                    numberOfItemsToStartWith: 0, 
                    addAnotherButtonLabel: 'Add Another', 
                } as AddAnotherPage], 
                id: 'mock-id',
                applicantId: 'mock-applicant-id',
                status: 'mock-status',
                createdAt: new Date(),
                updatedAt: new Date(),
                formId: 'mock-form-id',
                title: 'Mock Title',
                description: 'Mock Description',
                startPage: 'mock-start-page',
                submission: {
                    method: 'mock-method',
                    endpoint: 'mock-endpoint'
                },
                isCreated: true // Add a mock isCreated flag
            }; // Mock application with all required properties
            await expect(defaultPageHandler.Process(application, 'page1', {})).rejects.toThrow('No handler found for component type unknown.');
        });  
    });

    describe('WalkToNextInvalidOrUnfilledPage', () => {
        it('should throw an error if the page is not found', async () => {
            const application = { pages: [] } as any; // Mock application with no pages
            await expect(defaultPageHandler.WalkToNextInvalidOrUnfilledPage(application, 'non-existent-page', '')).rejects.toThrow('Page with ID non-existent-page not found.');
        });

        it('should throw an error if the component does not have a type', async () => {
            const application: Application = { 
                pages: [{ 
                    pageId: 'page1', 
                    components: [{ questionId: 'unknown-component', name: 'mock-name' }], 
                    numberOfItems: 1, 
                    numberOfItemsToStartWith: 0, 
                    addAnotherButtonLabel: 'Add Another', 
                } as AddAnotherPage], 
                id: 'mock-id',
                applicantId: 'mock-applicant-id',
                status: 'mock-status',
                createdAt: new Date(),
                updatedAt: new Date(),
                formId: 'mock-form-id',
                title: 'Mock Title',
                description: 'Mock Description',
                startPage: 'mock-start-page',
                submission: {
                    method: 'mock-method',
                    endpoint: 'mock-endpoint'
                },
                isCreated: true // Add a mock isCreated flag
            }; // Mock application with all required properties
            await expect(defaultPageHandler.WalkToNextInvalidOrUnfilledPage(application, 'page1', '')).rejects.toThrow('Component type is undefined for component ID unknown-component.');
        });  

        it('should throw an error if the component does not have a handler', async () => {
            const application: Application = { 
                pages: [{ 
                    pageId: 'page1', 
                    components: [{ questionId: 'unknown-component', type: "unknown", name: "mock-name", answer: "blah" }], 
                    numberOfItems: 1, 
                    numberOfItemsToStartWith: 0, 
                    addAnotherButtonLabel: 'Add Another', 
                } as AddAnotherPage], 
                id: 'mock-id',
                applicantId: 'mock-applicant-id',
                status: 'mock-status',
                createdAt: new Date(),
                updatedAt: new Date(),
                formId: 'mock-form-id',
                title: 'Mock Title',
                description: 'Mock Description',
                startPage: 'mock-start-page',
                submission: {
                    method: 'mock-method',
                    endpoint: 'mock-endpoint'
                },
                isCreated: true // Add a mock isCreated flag
            }; // Mock application with all required properties
            await expect(defaultPageHandler.WalkToNextInvalidOrUnfilledPage(application, 'page1', '')).rejects.toThrow('No handler found for component type unknown.');
        });        
    });
});