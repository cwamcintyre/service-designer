import { type Page } from '@model/formTypes';

import GDSComponentBlock from './GDSComponentBlock';

export default function GDSFormPage({ page }: { page: Page }) {
    return (
        <>
            {page?.title ? <h1 className="govuk-heading-xl">{page?.title}</h1> : null }
            <GDSComponentBlock components={page?.components || []} />                              
        </>
    )
}