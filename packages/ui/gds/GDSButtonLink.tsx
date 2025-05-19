export default function GDSButtonLink({ text, href, className = "" }: { text: string, href: string, className?: string }) {
    return (
        <a href={href} className={`govuk-button ${className}`}>
            {text}
        </a>
    )
}