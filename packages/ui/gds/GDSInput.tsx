export default function GDSInput({key, name, label, hint, labelIsPageTitle, autocomplete = "off", inputmode = "text" }: 
    {key: string, name: string | undefined, label: string | undefined, hint: string | undefined, labelIsPageTitle: boolean, autocomplete?: string , 
        inputmode?: "text" | "search" | "email" | "tel" | "url" | "none" | "numeric" | "decimal" | undefined }) {
    return (
        <div className="govuk-form-group" key={key}>
            {labelIsPageTitle ? 
            <h1 className="govuk-label-wrapper">
                <label className="govuk-label govuk-label--l" htmlFor={name}>
                    {label}
                </label>
            </h1> 
            : 
            <label className="govuk-label govuk-label--m" htmlFor={name}>
                {label}
            </label>}
            {hint ? 
            <div id={`${name}-hint`} className="govuk-hint">
                {hint}
            </div> : null}
            <input className="govuk-input" id={name} name={name} type="text" autoComplete={autocomplete} inputMode={inputmode} />
        </div>
    );
}