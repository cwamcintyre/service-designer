import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect'; // Ensure jest-axe matchers are extended
import { axe } from 'jest-axe';
import GDSLink from '../src/GDSLink';

describe('GDSLink Component', () => {
    it('renders the link with the correct text', () => {
        render(<GDSLink children={<>Click me</>} href="/example" />);
        const link = screen.getByRole('link', { name: /click me/i });
        expect(link).toBeInTheDocument();
    });

    it('renders the link with the correct href', () => {
        render(<GDSLink children={<>Change<span className="govuk-visually-hidden">this</span></>} href="/example" />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/example');
    });

    it('renders the link with the default target as self', () => {
        render(<GDSLink children={<>Change<span className="govuk-visually-hidden">this</span></>} href="/example" />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('target', '_self');
    });

    it('renders the link with target="_blank" when specified', () => {
        render(<GDSLink children={<>Change<span className="govuk-visually-hidden">this</span></>} href="/example" target="_blank" />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('ensures the link has accessible attributes', () => {
        render(<GDSLink children={<>Accessible Link</>} href="/example" />);
        const link = screen.getByRole('link', { name: /accessible link/i });
        expect(link).toHaveAccessibleName('Accessible Link');
    });

    it('renders the link with additional classes when specified', () => {
        render(<GDSLink children={<>Styled Link</>} href="/example" className="custom-class" />);
        const link = screen.getByRole('link');
        expect(link).toHaveClass('custom-class');
    });

    it('should not have any accessibility violations', async () => {
        const { container } = render(<GDSLink children={<>Accessible Button</>} href="/example" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});