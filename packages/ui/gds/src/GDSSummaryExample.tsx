export default function GDSSummary() {
    return (
        <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">
                    Name
                </dt>
                <dd className="govuk-summary-list__value">
                    Sarah Philips
                </dd>
                <dd className="govuk-summary-list__actions">
                    <a className="govuk-link" href="#">Change<span className="govuk-visually-hidden"> name</span></a>
                </dd>
            </div>
            <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">
                    Date of birth
                </dt>
                <dd className="govuk-summary-list__value">
                    5 January 1978
                </dd>
                <dd className="govuk-summary-list__actions">
                    <a className="govuk-link" href="#">Change<span className="govuk-visually-hidden"> date of birth</span></a>
                </dd>
            </div>
            <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">
                    Address
                </dt>
                <dd className="govuk-summary-list__value">
                    72 Guild Street<br />London<br />SE23 6FH
                </dd>
                <dd className="govuk-summary-list__actions">
                    <a className="govuk-link" href="#">Change<span className="govuk-visually-hidden"> address</span></a>
                </dd>
            </div>
            <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">
                    Contact details
                </dt>
                <dd className="govuk-summary-list__value">
                    <p className="govuk-body">07700 900457</p>
                    <p className="govuk-body">sarah.phillips@example.com</p>
                </dd>
                <dd className="govuk-summary-list__actions">
                    <a className="govuk-link" href="#">Change<span className="govuk-visually-hidden"> contact details</span></a>
                </dd>
            </div>
        </dl>
    )
}