import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import GDSTextarea from '../src/GDSTextarea';

describe('GDSTextarea Component', () => {
    it('renders the textarea with the correct label', () => {
        render(<GDSTextarea name="textarea" label="Enter your comments" hint={undefined} labelIsPageTitle={false} />);
        const label = screen.getByText(/enter your comments/i);
        expect(label).toBeInTheDocument();
    });

    it('renders the textarea with the correct hint', () => {
        render(
            <GDSTextarea
                name="textarea"
                label="Enter your comments"
                hint="Please provide detailed comments"
                labelIsPageTitle={false}
            />
        );
        const hint = screen.getByText(/please provide detailed comments/i);
        expect(hint).toBeInTheDocument();
    });

    it('renders the textarea with error message when errors are passed', () => {
        render(
            <GDSTextarea
                name="textarea"
                label="Enter your comments"
                hint={undefined}
                errors={["Comments are required"]}
                labelIsPageTitle={false}
            />
        );
        const errorMessage = screen.getByText(/comments are required/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it('renders the textarea with the correct default value', () => {
        render(
            <GDSTextarea
                name="textarea"
                label="Enter your comments"
                hint={undefined}
                answer="This is a test comment"
                labelIsPageTitle={false}
            />
        );
        const textarea = screen.getByDisplayValue(/this is a test comment/i);
        expect(textarea).toBeInTheDocument();
    });

    it('renders the textarea with the correct label style when labelIsPageTitle is true', () => {
        render(<GDSTextarea name="textarea" label="Enter your comments" hint={undefined} labelIsPageTitle={true} />);
        const label = screen.getByRole('heading', { level: 1 });
        expect(label).toHaveTextContent(/enter your comments/i);
    });

    it('should not have any accessibility violations', async () => {
        let renderResult = render(
            <GDSTextarea
                name="textarea"
                label="Enter your comments"
                hint="Please provide detailed comments"
                labelIsPageTitle={false}
            />
        );
        const results = await axe(renderResult.container);
        expect(results).toHaveNoViolations();

        renderResult = render(
            <GDSTextarea
                name="textarea"
                label="Enter your comments"
                hint={undefined}
                labelIsPageTitle={false}
            />
        );
        const results2 = await axe(renderResult.container);
        expect(results2).toHaveNoViolations();

        renderResult = render(
            <GDSTextarea
                name="textarea"
                label="Enter your comments"
                hint={undefined}
                labelIsPageTitle={true}
            />
        );
        const results3 = await axe(renderResult.container);
        expect(results3).toHaveNoViolations();
    });
});
