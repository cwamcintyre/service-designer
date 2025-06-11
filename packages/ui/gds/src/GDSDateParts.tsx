import { type DateError, type DateParts } from '@model/formTypes';

export default function GDSDateParts({ name, label, hint, labelIsPageTitle, answer, errors }:
    { name: string | undefined; label: string | undefined; hint: string | undefined; labelIsPageTitle: boolean, answer?: DateParts, errors?: string[] }) {

    const dateErrors: DateError[] = errors?.map(error => JSON.parse(error)) ?? [];

    const hasError = dateErrors.length > 0;
    const hasDayError = dateErrors.some(error => error.dayError);
    const hasMonthError = dateErrors.some(error => error.monthError);
    const hasYearError = dateErrors.some(error => error.yearError);
    const errorId = `${name}-error`;

    const ariaDescribedBy = [hint ? `${name}-hint` : null, hasError ? errorId : null]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={`govuk-form-group${hasError ? ' govuk-form-group--error' : ''}`}>
            <fieldset className="govuk-fieldset"
                aria-describedby={ariaDescribedBy}
                aria-invalid={hasError ? 'true' : undefined}
                aria-errormessage={hasError ? errorId : undefined}>
                {labelIsPageTitle ?
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                        <h1 className="govuk-fieldset__heading">
                            {label}
                        </h1>
                    </legend>
                : 
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                        {label}
                    </legend>
                }
                {hint && <div id={`${name}-hint`} className="govuk-hint">{hint}</div>}

                {(dateErrors ?? []).length > 0 ?
                <p id={`${name}-error`} className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {dateErrors.map((error, index) => (
                        <span key={index}>{error.errorMessage}</span>
                    ))}
                </p>
                : null}
                
                <div className="govuk-date-input" id={`${name}`}>
                    <div className={"govuk-date-input__item"}>
                        <div className={`govuk-form-group`}>
                            <label className="govuk-label govuk-date-input__label" htmlFor={`${name}-day`}>
                                Day
                            </label>
                            <input className={`govuk-date-input__input govuk-input--width-2 govuk-input${hasDayError ? ' govuk-input--error' : ''}`} id={`${name}-day`} data-testid={`${name}-day`} name={`${name}-day`} type="text" defaultValue={answer?.day} inputMode="numeric"/>
                        </div>
                    </div>
                    <div className={"govuk-date-input__item"}>
                        <div className={`govuk-form-group`}>
                            <label className="govuk-label govuk-date-input__label" htmlFor={`${name}-month`}>
                                Month
                            </label>
                            <input className={`govuk-date-input__input govuk-input--width-2 govuk-input${hasMonthError ? ' govuk-input--error' : ''}`} id={`${name}-month`} data-testid={`${name}-month`} name={`${name}-month`} type="text" defaultValue={answer?.month} inputMode="numeric" />
                        </div>
                    </div>
                    <div className={"govuk-date-input__item"}>
                        <div className={`govuk-form-group`}>
                            <label className="govuk-label govuk-date-input__label" htmlFor={`${name}-year`}>
                                Year
                            </label>
                            <input className={`govuk-date-input__input govuk-input--width-4 govuk-input${hasYearError ? ' govuk-input--error' : ''}`} id={`${name}-year`} data-testid={`${name}-year`} name={`${name}-year`} type="text" defaultValue={answer?.year} inputMode="numeric" />
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    );
}