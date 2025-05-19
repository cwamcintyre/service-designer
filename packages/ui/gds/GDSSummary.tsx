export function GDSSummaryList({ children }: { children: React.ReactNode }) {
    return (
        <dl className="govuk-summary-list">
            {children}
        </dl>
    )
}

export function GDSSummaryRow({ children }: { children: React.ReactNode }) {
    return (
        <div className="govuk-summary-list__row">
            {children}
        </div>
    )
}

export function GDSSummaryQuestion({ text }: { text: string }) {
    return (
        <dt className="govuk-summary-list__key">
            {text}
        </dt>
    )
}

export function GDSSummaryAnswer({ children }: { children: React.ReactNode }) {
    return (
        <dd className="govuk-summary-list__value">
            {children}
        </dd>
    )
}

export function GDSSummaryActions({ children }: { children: React.ReactNode }) {
    return (
        <dd className="govuk-summary-list__actions">
            {children}
        </dd>
    )
}