import GDSButton from '../src/GDSButton'; // Ensure GDSButton is imported as a value
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect'; // Ensure jest-axe matchers are extended
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

describe('GDSButton Component', () => {
    it('renders without crashing', () => {
        render(<GDSButton text="Click Me" />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });
    
    it('renders the button with the correct class', () => {
        render(<GDSButton text="Click Me" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('govuk-button');
    });

    it('renders the button with the correct text', () => {
        render(<GDSButton text="Click Me" />);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
    });

    it('renders the button with the default type "button"', () => {
        render(<GDSButton text="Click Me" />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'button');
    });

    it('renders the button with type "submit" when specified', () => {
        render(<GDSButton text="Submit" type="submit" />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'submit');
    });

    it('renders the button with preventDoubleClick set to false by default', () => {
        render(<GDSButton text="Click Me" />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('data-prevent-double-click', 'false');
    });

    it('renders the button with preventDoubleClick set to true when specified', () => {
        render(<GDSButton text="Click Me" preventDoubleClick={true} />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('data-prevent-double-click', 'true');
    });

    it('ensures the button has accessible attributes', () => {
        render(<GDSButton text="Accessible Button" />);
        const button = screen.getByRole('button', { name: /accessible button/i });
        expect(button).toHaveAccessibleName('Accessible Button');
    });

    it('should not have any accessibility violations', async () => {
        const { container } = render(<GDSButton text="Accessible Button" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('renders the button with the correct name and value attributes', () => {
        render(<GDSButton text="Click Me" name="testName" value="testValue" />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('name', 'testName');
        expect(button).toHaveAttribute('value', 'testValue');
    });

    it('applies additional class names correctly', () => {
        render(<GDSButton text="Click Me" additionalClassNames="extra-class" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('extra-class');
    });
});