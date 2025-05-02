import { type Option } from '../../store/formTypes';

export default function GDSSelect({ key, name, label, hint, labelIsPageTitle, options }: 
    { key: string, name: string | undefined, label: string | undefined, hint: string | undefined, labelIsPageTitle: boolean | undefined, options: Option[] | undefined}) {
    return (
        <div className="govuk-form-group">
            {labelIsPageTitle ?
                <h1 className="govuk-label-wrapper" key={key}>
                    <label className="govuk-label govuk-label--l" htmlFor="select-example">
                        {label || 'Select an option'}
                    </label>
                </h1>
            : <label className="govuk-label govuk-label--m" htmlFor="select-example">
                {label || 'Select an option'}
            </label>}
            {hint && <div id={`${name}-hint`} className="govuk-hint">{hint}</div>}
            <select className="govuk-select" id={name} name={name} aria-describedby={`${name}-hint`}>
                {options && options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}