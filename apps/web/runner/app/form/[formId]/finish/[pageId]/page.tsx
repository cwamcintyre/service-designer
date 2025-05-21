'use server';

import { LogHandler } from '@/app/utils/logging/logHandler';
import { setSharedState } from '@/app/utils/sharedState';
import applicationService from '@/app/services/applicationService';
import GDSSummaryComponent from '@/app/components/GDSSummaryComponent';
import GDSButtonLink from '@gds/GDSButtonLink';

export default async function FormPage({ params, searchParams }: { params: Promise<{ formId: string, pageId: string }>, searchParams: Promise<Record<string, string>> }) {
        
    // Access the dynamic route parameter
    const { formId, pageId } = await params;

    // Access query parameters
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const step = await searchParams;

    const applicationId = await applicationService.getApplicationId();
    if (!applicationId) {
        LogHandler.log("Application ID not found", {});
        return new Response("Application ID not found", { status: 400 });
    }

    const applicationResponse = await applicationService.getApplication(applicationId, pageId, "");
    if (!applicationResponse) {
        LogHandler.log("Application not found", {});
        return new Response("Application not found", { status: 404 });
    }

    const summaryPage = applicationResponse.application.pages.find((page) => page.pageId === pageId);

    if (!summaryPage) {
        LogHandler.log("Summary page not found", { applicationId, pageId });
        return new Response("Summary page not found", { status: 404 });
    }

    const backLink = applicationResponse.previousExtraData ? `/form/${formId}/${applicationResponse.previousPageId}/${applicationResponse.previousExtraData}` : 
                                                          applicationResponse.previousPageId ? `/form/${formId}/${applicationResponse.previousPageId}` : "";

    setSharedState({ serviceTitle: applicationResponse.application.title });

    return (
        <>
            { backLink ? <a href={backLink} className="govuk-back-link">Back</a> : null }
            
            <h1 className="govuk-heading-l">{summaryPage?.title}</h1>
            
            {summaryPage?.components && summaryPage?.components.map((component) => {
                switch (component.type) {
                    case 'summary':
                        return (
                            <GDSSummaryComponent formId={applicationResponse.application.formId} pages={applicationResponse.application.pages} />
                        );
                    case 'html':
                        return (
                            <div key={component.questionId} dangerouslySetInnerHTML={{ __html: component.content ? component.content : "" }} />
                        );
                    default:
                        return null;
                }
            })}

            <GDSButtonLink href={`/api/form/submit/${applicationResponse.application.formId}/${applicationId}`} className="govuk-button" text={"Accept and send"} />
        </>
    );
}