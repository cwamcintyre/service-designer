import { type Page, PageTypes, type AddAnotherPage } from '@model/formTypes';
import GDSFormPage from '@gds/forms/GDSFormPage';
import GDSButton from '@gds/GDSButton';
import MoJAddAnotherPage from '@gds/forms/MoJAddAnotherPage';

export default function ComponentsPreview({ page }: { page: Page }) {
    if (!page || typeof page.pageType !== 'string') {
        return <div className="govuk-error-message">Invalid page or page type.</div>;
    }

    return (
        <form className="govuk-form-group">
            <input type="hidden" name="formId" value="previewForm" />
            <input type="hidden" name="pageId" value={page.pageId} />
            
            {page.pageType === PageTypes.MoJAddAnother ? (
                <MoJAddAnotherPage page={page as AddAnotherPage} />
            ) : (
                <GDSFormPage page={page} />
            )}

            <div className="govuk-button-group">
                <GDSButton type="submit" text="Continue" />
            </div>
        </form>
    );
}