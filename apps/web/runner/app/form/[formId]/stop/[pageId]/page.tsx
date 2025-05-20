'use server';

import { LogHandler } from '@/app/utils/logging/logHandler';
import { setSharedState } from '@/app/utils/sharedState';
import GDSFormPage from '@/app/components/GDSFormPage';
import applicationService from '@/app/services/applicationService';

export default async function FormPage({ params, searchParams }: { params: { formId: string, pageId: string }; searchParams: any }) {
        
    // Access the dynamic route parameter
    const { formId, pageId } = params;

    // Access query parameters
    const step = searchParams.step;

    const form = await applicationService.getApplication(await applicationService.getApplicationId(), pageId, step);
    const page = form.application.pages.find((page: any) => page.pageId === pageId);

    if (!page || typeof page.pageType !== 'string') {
        console.error("Page or page type is invalid");
        return new Response("Page or page type is invalid", { status: 400 });
    }

    const backLink = "";

    setSharedState({ serviceTitle: form.application.title });
    LogHandler.debug("Form Title: ", form.application.title);

    return (
        <>
            <GDSFormPage page={page} backLink={backLink} />
        </>
    );
}