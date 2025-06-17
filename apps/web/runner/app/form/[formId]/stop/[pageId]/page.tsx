'use server';

import { LogHandler } from '@/app/utils/logging/logHandler';
import { setSharedState } from '@/app/utils/sharedState';
import GDSFormPage from '@gds/forms/GDSFormPage';
import applicationService from '@/app/services/applicationService';
import { Page } from '@model/formTypes';

export default async function FormPage({ params, searchParams }: { params: Promise<{ formId: string, pageId: string }>, searchParams: Promise<Record<string, string>> }) {
        
    // Access the dynamic route parameter
    const { pageId } = await params;

    // Access query parameters
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const step = await searchParams;

    const form = await applicationService.getApplication(await applicationService.getApplicationId(), pageId, "");
    const page = form.application.pages.find((page: Page) => page.pageId === pageId);

    if (!page || typeof page.pageType !== 'string') {
        console.error("Page or page type is invalid");
        return new Response("Page or page type is invalid", { status: 400 });
    }

    const backLink = "";

    return (
        <>
            <GDSFormPage page={page} />
        </>
    );
}