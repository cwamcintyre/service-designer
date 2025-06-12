'use server';

import { LogHandler } from '@/app/utils/logging/logHandler';
import { setSharedState } from '@/app/utils/sharedState';
import GDSFormPage from '@/app/components/GDSFormPage';
import applicationService from '@/app/services/applicationService';
import GDSButton from '@gds/GDSButton';
import { Page } from '@model/formTypes';

export default async function FormPage({ params, searchParams }: { params: Promise<{ formId: string, pageId: string }>; searchParams: Promise<Record<string, string>> }) {
        
    // Access the dynamic route parameter
    const { formId, pageId } = await params;

    // Access query parameters
    const step = await searchParams;

    const applicationId = await applicationService.getApplicationId();
    if (!applicationId) {
        console.error("Application ID not found");
        return new Response("Application ID not found", { status: 400 });
    }

    console.log(`Application ID: ${applicationId}`);
    const applicationResponse = await applicationService.getApplication(applicationId, pageId, "", true);
    const page = applicationResponse.application.pages.find((page: Page) => page.pageId === pageId);

    if (!page || typeof page.pageType !== 'string') {
        console.error("Page or page type is invalid");
        return new Response("Page or page type is invalid", { status: 400 });
    }

    const backLink = applicationResponse.previousExtraData ? `/form/${formId}/${applicationResponse.previousPageId}/${applicationResponse.previousExtraData}` : 
                                                          applicationResponse.previousPageId ? `/form/${formId}/${applicationResponse.previousPageId}` : "";

    setSharedState({ serviceTitle: applicationResponse.application.title });
    LogHandler.debug("Form Title: ", applicationResponse.application.title);

    return (
        <>
            <form action={`/api/form`} method="POST" className="govuk-form-group">
                
                <input type="hidden" name="formId" value={formId} />
                <input type="hidden" name="pageId" value={pageId} />
                <input type="hidden" name="extraData" value={JSON.stringify({ step })} />

                <GDSFormPage page={page} backLink={backLink} />

                <div className="govuk-button-group">
                    <GDSButton type="submit" text="Continue" />
                </div>
            </form>
        </>
    );
}