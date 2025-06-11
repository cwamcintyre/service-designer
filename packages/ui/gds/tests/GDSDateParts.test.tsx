import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import GDSDateParts from '../src/GDSDateParts';

describe('GDSDateParts Component', () => {
    it('renders the date parts with the correct label', () => {
        render(<GDSDateParts name="date" label="Enter your date of birth" hint={undefined} labelIsPageTitle={false} />);
        const label = screen.getByText(/enter your date of birth/i);
        expect(label).toBeInTheDocument();
    });

    it('renders the date parts with the correct hint', () => {
        render(
            <GDSDateParts
                name="date"
                label="Enter your date of birth"
                hint="Please provide your date of birth"
                labelIsPageTitle={false}
            />
        );
        const hint = screen.getByText(/please provide your date of birth/i);
        expect(hint).toBeInTheDocument();
    });

    it('renders the date parts with error message when errors are passed', () => {
        const errors = [
            JSON.stringify({ errorMessage: "Day is required", dayError: true }),
            JSON.stringify({ errorMessage: "Month is required", monthError: true }),
            JSON.stringify({ errorMessage: "Year is required", yearError: true })
        ];
        render(
            <GDSDateParts
                name="date"
                label="Enter your date of birth"
                hint={undefined}
                errors={errors}
                labelIsPageTitle={false}
            />
        );
        const dayError = screen.getByText(/day is required/i);
        const monthError = screen.getByText(/month is required/i);
        const yearError = screen.getByText(/year is required/i);
        expect(dayError).toBeInTheDocument();
        expect(monthError).toBeInTheDocument();
        expect(yearError).toBeInTheDocument();
    });

    it('renders the date parts with the correct default values', () => {
        render(
            <GDSDateParts
                name="date"
                label="Enter your date of birth"
                hint={undefined}
                answer={{ day: "01", month: "02", year: "2000" }}
                labelIsPageTitle={false}
            />
        );
        const dayInput = screen.getByDisplayValue(/01/i);
        const monthInput = screen.getByDisplayValue(/02/i);
        const yearInput = screen.getByDisplayValue(/2000/i);
        expect(dayInput).toBeInTheDocument();
        expect(monthInput).toBeInTheDocument();
        expect(yearInput).toBeInTheDocument();
    });

    it('renders the date parts with the correct label style when labelIsPageTitle is true', () => {
        render(<GDSDateParts name="date" label="Enter your date of birth" hint={undefined} labelIsPageTitle={true} />);
        const label = screen.getByRole('heading', { level: 1 });
        expect(label).toHaveTextContent(/enter your date of birth/i);
    });

    it('should not have any accessibility violations', async () => {
        let renderResult = render(
            <GDSDateParts
                name="textarea"
                label="Enter your comments"
                hint="Please provide detailed comments"
                labelIsPageTitle={false}
            />
        );
        const results = await axe(renderResult.container);
        expect(results).toHaveNoViolations();

        renderResult = render(
            <GDSDateParts
                name="textarea"
                label="Enter your comments"
                hint={undefined}
                labelIsPageTitle={false}
            />
        );
        const results2 = await axe(renderResult.container);
        expect(results2).toHaveNoViolations();

        renderResult = render(
            <GDSDateParts
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
