import { type Page, type AddAnotherPage } from '@model/formTypes'
import { GDSSummaryList, GDSSummaryRow, GDSSummaryQuestion, GDSSummaryAnswer, GDSSummaryActions } from '@gds/GDSSummary'
import GDSDefaultPageSummaryRows from './GDSDefaultPageSummaryRows'
import GDSMoJAddAnotherSummaryRow from './GDSMoJAddAnotherSummaryRow'

export default function GDSSummaryComponent({ formId, pages }: { formId: string, pages: Page[] }) {    
    return (
        <GDSSummaryList>            
            {pages.map((page) => {
                switch (page.pageType) {
                    case 'default':
                        return <GDSDefaultPageSummaryRows key={page.pageId} formId={formId} page={page} />;
                    case 'mojAddAnother':
                        return <GDSMoJAddAnotherSummaryRow key={page.pageId} formId={formId} page={page as AddAnotherPage} />;
                    case 'summary':
                    case 'stop':
                        return null;
                    default:
                        return (   
                            <GDSSummaryRow key={page.pageId} name={page.pageId}>
                                <GDSSummaryQuestion text={page.pageId} />
                                <GDSSummaryAnswer>Page type {page.pageType} not supported in summary.</GDSSummaryAnswer>
                                <GDSSummaryActions>
                                    <span className="govuk-tag govuk-tag--blue">Unsupported</span>
                                </GDSSummaryActions>
                            </GDSSummaryRow>
                        );
                }
            })}
        </GDSSummaryList>
    )
}