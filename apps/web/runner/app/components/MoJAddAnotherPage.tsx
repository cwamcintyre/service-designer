'use server';

import { AddAnotherPage, type Component } from '@model/formTypes';

import GDSComponentBlock from './GDSComponentBlock';
import GDSButton from '@gds/GDSButton';

export default async function MoJAddAnotherPage({ page }: { page: AddAnotherPage }) {
    const sectionComponents: Component[][] = [];
    console.log(page.pageAnswer);
    console.log(page.pageErrors);
    for (let i = 0; i < page.numberOfItems; i++) {
        const components = JSON.parse(JSON.stringify(page.components)) as Component[];
        for (const component of components) {
            const iteratingComponentKey = `${i+1}-${component.name}`;
            if (component.name) {
                component.answer = page.pageAnswer?.[i]?.[component.name] || "";
                component.name = iteratingComponentKey;
                component.errors = page.pageErrors?.[iteratingComponentKey] || [];
            }
        }
        sectionComponents.push(components);
    }

    return (
        <>
            {page?.title ? <h1 className="govuk-heading-xl">{page?.title}</h1> : null }
            {Array.from({ length: page.numberOfItems }).map((_, i) => (
                <section key={`${page.answerKey}-${i}`} className="moj-repeat-section__item">
                    {page?.sectionTitle ? <h2 className="govuk-heading-m">{page.sectionTitle}</h2> : null }
                    <div className={"moj-repeat-section"}>
                        <GDSComponentBlock components={sectionComponents[i] || []} />
                    </div>
                    {page.numberOfItems > 1 && (
                        <GDSButton
                            type="submit"
                            name="mojRemove"
                            value={`${page.pageId}-${i}`}
                            text={"Remove"}
                            additionalClassNames="govuk-button--secondary moj-repeat-section__remove-button"
                        />
                    )}
                </section>
            ))}
            <GDSButton 
                type="submit"
                name="mojAdd" 
                value={`${page.pageId}-${page.numberOfItems+1}`} 
                text={page.addAnotherButtonLabel || "Add another"} 
                additionalClassNames="govuk-button--secondary"
            />
        </>
    )
}