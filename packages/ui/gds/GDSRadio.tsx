import { type Option } from '../../store/formTypes';

export default function GDSRadio({ key, name, label, hint, labelIsPageTitle, options }:
    { key: string, name: string | undefined, label: string | undefined, hint: string | undefined, labelIsPageTitle: boolean | undefined, options: Option[] | undefined}) {
    return (
        <div className="govuk-form-group">
            <fieldset className="govuk-fieldset" aria-describedby={hint ? `${name}-hint` : undefined}>
                <legend className={`govuk-fieldset__legend ${labelIsPageTitle ? 'govuk-fieldset__legend--l' : 'govuk-fieldset__legend--m'}`}>
                    {labelIsPageTitle ? <h1 className="govuk-fieldset__heading">{label}</h1> : label}
                </legend>
                {hint ? <div id={`${name}-hint`} className="govuk-hint">{hint}</div> : null}
                <div className="govuk-radios" data-module="govuk-radios">
                    {options && options.map((option) => (
                        <div className="govuk-radios__item" key={option.value}>
                            <input className="govuk-radios__input" id={option.value} name={name} type="radio" value={option.value} />
                            <label className="govuk-label govuk-radios__label" htmlFor={option.value}>
                            {option.label}
                            </label>
                        </div>
                    ))}
                </div>
            </fieldset>
        </div>
    );
}