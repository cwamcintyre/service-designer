import { cookies } from 'next/headers';
import { GetApplicationResponse, ProcessApplicationResponse, StartApplicationResponse } from '@model/runnerApiTypes';
import MoJAddAnotherPage from '../components/MoJAddAnotherPage';

const applicationService = {
    getApplicationId: async () => {
        const cookieStore = await cookies();
        return cookieStore.get('applicationId')?.value || "";
    },
    getApplicationTitle: async () => {
        const cookieStore = await cookies();
        return cookieStore.get('formTitle')?.value || "";
    },
    startApplication: async (applicantId: string, formId: string): Promise<StartApplicationResponse> => {
        const result = await fetch(`${process.env.FORM_API}/application/start`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                applicantId,
                formId,
            }),
        });

        if (result.status !== 201) {
            console.log(`StartApplication: ${result.status}`);
            throw new Error('Failed to start application');
        }
        else {
            const data = await result.json();
            return data;
        }
    },
    getApplication: async (applicationId: string, pageId: string, extraData: string, onlyCurrentPage?: boolean): Promise<GetApplicationResponse> => {
        let url = `${process.env.FORM_API}/application/${applicationId}/${pageId}/${onlyCurrentPage}`;
        if (extraData) {
            url += `/${extraData}`;
        }
        const result = await fetch(url, {
            method: 'GET',
        });

        if (result.status !== 200) {
            console.log(`GetApplication: ${result.status}`);
            throw new Error('Failed to get application');
        }

        const data = await result.json();
        return data;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processApplication: async (applicantId: string, pageId: string, formData: any): Promise<ProcessApplicationResponse> => {
        const result = await fetch(`${process.env.FORM_API}/application`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                applicantId,
                pageId,
                formData,
            }),
        });

        if (result.status !== 200) {
            console.log(`ProcessApplication: ${result.status}`);
            throw new Error('Failed to process application');
        }
        else {
            const data = await result.json();
            return data;
        }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processApplicationChange: async (applicantId: string, pageId: string, formData: any): Promise<ProcessApplicationResponse> => {
        const result = await fetch(`${process.env.FORM_API}/application`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                applicantId,
                pageId,
                formData,
            }),
        });

        if (result.status !== 200) {
            console.log(`ProcessApplicationChange: ${result.status}`);
            throw new Error('Failed to process application');
        }
        else {
            const data = await result.json();
            return data;
        }
    },
    moJAddAnother: async (applicantId: string, pageId: string, numberOfItems: number, formData: Record<string, any>) => {
        const result = await fetch(`${process.env.FORM_API}/application/moj-add-another`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                applicantId,
                pageId,
                numberOfItems,
                formData
            }),
        });

        if (result.status !== 200) {
            console.log(`MoJAddAnotherPage: ${result.status}`);
            throw new Error('Failed to process MoJ Add Another Page');
        }

        const data = await result.json();
        return data;
    },
    mojRemoveFromAddAnother: async (applicantId: string, pageId: string, itemIndex: number, formData: Record<string, any>) => {
        const result = await fetch(`${process.env.FORM_API}/application/moj-remove-from-add-another`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                applicantId,
                pageId,
                itemIndex,
                formData
            }),
        });

        if (result.status !== 200) {
            console.log(`MoJRemoveFromAddAnother: ${result.status}`);
            throw new Error('Failed to process MoJ Remove From Add Another');
        }

        const data = await result.json();
        return data;
    }
}

export default applicationService;