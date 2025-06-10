export default function GDSButtonLink({ text, href, className = "", target = "_self" }: { text: string, href: string, className?: string, target?: string }) {
    return (
        <a href={href} className={`govuk-button ${className}`} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}>
            {text}
        </a>
    )
}