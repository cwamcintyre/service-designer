import { type Page } from '@model/formTypes'
import { GDSSummaryList, GDSSummaryRow, GDSSummaryQuestion, GDSSummaryAnswer, GDSSummaryActions } from '@gds/GDSSummary'

export default function GDSSummaryComponent({ formId, pages }: { formId: string, pages: Page[] }) {
    return (
        <GDSSummaryList>            
            {pages.map((page) => {
                return (
                    <GDSSummaryRow>
                        {page.components && page.components.map((component) => {
                            switch (component.type) {
                                case 'text':
                                case 'email':
                                case 'number':
                                case 'phonenumber':
                                case 'multilineText':
                                case 'radio':
                                case 'checkbox':
                                case 'select':
                                case 'yesno':                                
                                    return (
                                        <>
                                            <GDSSummaryQuestion text={component.label || 'Untitled'} />
                                            <GDSSummaryAnswer>{component.answer || 'Not provided'}</GDSSummaryAnswer>
                                            <GDSSummaryActions>
                                                <a href={`/form/change/${formId}/${page.pageId}`} className="govuk-link">Change<span className="govuk-visually-hidden">{component.label}</span></a>
                                            </GDSSummaryActions>
                                        </>
                                    );
                            }
                        })}
                    </GDSSummaryRow>
                )
            })}
        </GDSSummaryList>
    )
}