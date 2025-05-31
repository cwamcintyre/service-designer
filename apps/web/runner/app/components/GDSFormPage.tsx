'use server';

import { type Page, type Component } from '@model/formTypes';

import GDSInput from '@gds/GDSInput';
import GDSTextarea from '@gds/GDSTextarea';
import GDSRadio from '@gds/GDSRadio';
import GDSSelect from '@gds/GDSSelect';
import GDSCheckbox from '@gds/GDSCheckbox';
import GDSYesNo from '@gds/GDSYesNo';
import GDSUKAddress from '@gds/GDSUKAddress';

export default async function GDSFormPage({ page, backLink }: { page: Page, backLink: string }) {
    return (
        <>
            { backLink ? <a href={backLink} className="govuk-back-link">Back</a> : null }
            {page?.title ? <h1 className="govuk-heading-xl">{page?.title}</h1> : null }
            {page?.components && page?.components.map((component: Component) => {
                switch (component.type) {
                    case 'text':    
                        return (                        
                            <GDSInput key={component.questionId} label={component.label} name={component.name} hint={component.hint} labelIsPageTitle={component.labelIsPageTitle} errors={component.errors} value={component.answer} />
                        );
                    case 'email':
                        return (
                            <GDSInput key={component.questionId} label={component.label} name={component.name} hint={component.hint} labelIsPageTitle={component.labelIsPageTitle} autocomplete='email' errors={component.errors} value={component.answer} />
                        );
                    case 'number':
                        return (
                            <GDSInput key={component.questionId} label={component.label} name={component.name} hint={component.hint} labelIsPageTitle={component.labelIsPageTitle} inputmode='numeric' errors={component.errors} value={component.answer} />
                        );
                    case 'phonenumber':
                        return (
                            <GDSInput key={component.questionId} label={component.label} name={component.name} hint={component.hint} labelIsPageTitle={component.labelIsPageTitle} autocomplete='tel' errors={component.errors} value={component.answer} />
                        );
                    case 'multilineText':
                        return (
                            <GDSTextarea key={component.questionId} label={component.label} name={component.name} hint={component.hint} labelIsPageTitle={component.labelIsPageTitle} answer={component.answer} errors={component.errors} />
                        );
                    case 'radio':
                        return (
                            <GDSRadio key={component.questionId} label={component.label} name={component.name} hint={component.hint} labelIsPageTitle={component.labelIsPageTitle} options={component.options} answer={component.answer} errors={component.errors} />
                        );
                    case 'checkbox':
                        return (
                            <GDSCheckbox key={component.questionId} label={component.label} name={component.name} hint={component.hint} labelIsPageTitle={component.labelIsPageTitle} options={component.options} answer={component.answer} errors={component.errors} />
                        );
                    case 'select':
                        return (
                            <GDSSelect key={component.questionId} label={component.label} name={component.name} hint={component.hint} labelIsPageTitle={component.labelIsPageTitle} options={component.options} answer={component.answer} errors={component.errors} />
                        );
                    case 'yesno':
                        return (
                            <GDSYesNo key={component.questionId} name={component.name} label={component.label} hint={component.hint} labelIsPageTitle={component.labelIsPageTitle} answer={component.answer} />
                        );
                    case 'ukaddress': 
                        return (
                            <GDSUKAddress key={component.questionId} label={component.label} name={component.name} hint={component.hint} labelIsPageTitle={component.labelIsPageTitle} answer={component.answer} />
                        );
                    case 'html':
                        return (
                            <div key={component.questionId} dangerouslySetInnerHTML={{ __html: component.content ? component.content: "" }} />
                        );
                    default:
                        return <p key={component.questionId} className="govuk-body">Component type not supported</p>;
                }
            })}                                
        </>
    )
}