'use server';

import { LogHandler } from '@/app/utils/logging/logHandler';
import { setSharedState } from '@/app/utils/sharedState';
import applicationService from '@/services/applicationService';
import GDSSummaryComponent from '@/components/GDSSummaryComponent';
import GDSButtonLink from '@gds/GDSButtonLink';

export default async function FormPage({ params, searchParams }: { params: { formId: string, pageId: string }; searchParams: any }) {
        
    // Access the dynamic route parameter
    const { formId, pageId } = params;

    // Access query parameters
    const step = searchParams.step;

    const applicationId = await applicationService.getApplicationId();
    if (!applicationId) {
        console.error("Application ID not found");
        return new Response("Application ID not found", { status: 400 });
    }

    const applicationResponse = await applicationService.getApplication(applicationId, pageId, step);
    if (!applicationResponse) {
        console.error("Application not found");
        return new Response("Application not found", { status: 404 });
    }

    const summaryPage = applicationResponse.application.pages.find((page) => page.pageId === pageId);

    if (!summaryPage) {
        console.error("Summary page not found");
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