import { type Option } from '@model/formTypes';

export default function GDSCheckbox({ key, name, label, hint, labelIsPageTitle, options, answer }: {
    key: string, name: string | undefined, label: string | undefined, hint: string | undefined, labelIsPageTitle: boolean | undefined, options: Option[] | undefined, answer?: string
}) {
    return (
        <div className="govuk-form-group">
        <fieldset className="govuk-fieldset" aria-describedby={hint ? `${name}-hint` : undefined}>
        <legend className={`govuk-fieldset__legend ${labelIsPageTitle ? 'govuk-fieldset__legend--l' : 'govuk-fieldset__legend--m'}`}>
                    {labelIsPageTitle ? <h1 className="govuk-fieldset__heading">{label}</h1> : label}
                </legend>
                {hint ? <div id={`${name}-hint`} className="govuk-hint">{hint}</div> : null}
            <div className="govuk-checkboxes" data-module="govuk-checkboxes">
                {options && options.map((option) => (
                    <div className="govuk-checkboxes__item" key={option.value}>
                        <input 
                            className="govuk-checkboxes__input" 
                            id={option.value} 
                            name={name} 
                            type="checkbox" 
                            value={option.value} 
                            checked={option.value === answer} 
                        />
                        <label className="govuk-label govuk-checkboxes__label" htmlFor={option.value}>
                        {option.label}
                        </label>
                    </div>
                ))}
            </div>
        </fieldset>
        </div>
    );
}