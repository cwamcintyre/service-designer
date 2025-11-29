import GDSSummaryComponent from '@gds/forms/GDSSummaryComponent';
import GDSButtonLink from '@gds/GDSButtonLink';
import type { Page } from '@model/formTypes';

export default function SummaryPreview({ selectedPage, pages }: { selectedPage: Page, pages: any[] }) {

    return (
        <>
            {selectedPage?.components && selectedPage?.components.map((component) => {
                switch (component.type) {
                    case 'summary':
                        return (
                            <GDSSummaryComponent formId={""} pages={pages} />
                        );
                    case 'html':
                        return (
                            <div key={component.questionId} dangerouslySetInnerHTML={{ __html: component.content ? component.content : "" }} />
                        );
                    default:
                        return null;
                }
            })}
            <GDSButtonLink href={"#"} text="Accept and send" />
        </>
    );
}