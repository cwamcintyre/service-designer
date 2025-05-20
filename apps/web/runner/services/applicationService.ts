import { cookies } from 'next/headers';
import { GetApplicationResponse } from '@model/runnerApiTypes';

const applicationService = {
    getApplicationId: async () => {
        const cookieStore = await cookies();
        return cookieStore.get('applicationId')?.value || "";
    },
    startApplication: async (applicantId: string, formId: string): Promise<string> => {
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
            return data.startPageId;
        }
    },
    getApplication: async (applicationId: string, pageId: string, extraData: string): Promise<GetApplicationResponse> => {
        let url = `${process.env.FORM_API}/application/${applicationId}/${pageId}`;
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
    processApplication: async (applicantId: string, pageId: string, formData: any): Promise<GetApplicationResponse> => {
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
}

export default applicationService;