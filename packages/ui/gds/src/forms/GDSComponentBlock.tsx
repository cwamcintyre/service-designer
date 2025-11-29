import { type Page, type Component } from '@model/formTypes';

import GDSInput from '../GDSInput';
import GDSTextarea from '../GDSTextarea';
import GDSRadio from '../GDSRadio';
import GDSSelect from '../GDSSelect';
import GDSCheckbox from '../GDSCheckbox';
import GDSYesNo from '../GDSYesNo';
import GDSUKAddress from '../GDSUKAddress';
import GDSDateParts from '../GDSDateParts';

export default function GDSComponentBlock({ components }: { components: Component[] }) {
    return (
        <>
            {components.map((component: Component) => {
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
                            <GDSYesNo key={component.questionId} name={component.name} label={component.label} hint={component.hint} labelIsPageTitle={component.labelIsPageTitle} answer={component.answer} errors={component.errors} />
                        );
                    case 'ukaddress': 
                        return (
                            <GDSUKAddress key={component.questionId} label={component.label} name={component.name} hint={component.hint} labelIsPageTitle={component.labelIsPageTitle} answer={component.answer} errors={component.errors} />
                        );
                    case 'dateParts':
                        return (
                            <GDSDateParts key={component.questionId} label={component.label} name={component.name} hint={component.hint} labelIsPageTitle={component.labelIsPageTitle} answer={component.answer} errors={component.errors} />
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