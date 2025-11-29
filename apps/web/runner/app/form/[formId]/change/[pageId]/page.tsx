'use server';

import { LogHandler } from '@/app/utils/logging/logHandler';
import GDSFormPage from '@gds/forms/GDSFormPage';
import applicationService from '@/app/services/applicationService';
import GDSButton from '@gds/GDSButton';
import { Page, PageTypes, AddAnotherPage } from '@model/formTypes';
import MoJAddAnotherPage from '@gds/forms/MoJAddAnotherPage';

export default async function FormChangePage({ params, searchParams }: { params: Promise<{ formId: string, pageId: string }>, searchParams: Promise<Record<string, string>> }) {
        
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

    // back link is always empty for the change page.
    const backLink = ""

    return (
        <>
            { backLink ? <a href={backLink} className="govuk-back-link">Back</a> : null }
            <form action={`/api/formChange`} method="POST" className="govuk-form-group">
                
                <input type="hidden" name="formId" value={formId} />
                <input type="hidden" name="pageId" value={pageId} />
                <input type="hidden" name="extraData" value={JSON.stringify({ step })} />

                {page.pageType === PageTypes.MoJAddAnother ? (
                    <MoJAddAnotherPage page={page as AddAnotherPage} />
                ) : (
                    <GDSFormPage page={page} />
                )}

                <div className="govuk-button-group">
                    <GDSButton type="submit" text="Change" />
                </div>
            </form>
        </>
    );
}