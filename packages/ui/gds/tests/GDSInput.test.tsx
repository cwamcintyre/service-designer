import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect'; // Ensure jest-axe matchers are extended
import { axe } from 'jest-axe';
import GDSInput from '../src/GDSInput';

describe('GDSInput Component', () => {
    it('renders the input field with the correct label', () => {
        render(<GDSInput name="input" label="Enter your name" hint={undefined} labelIsPageTitle={false} value={undefined} />);
        const label = screen.getByText(/enter your name/i);
        expect(label).toBeInTheDocument();
    });

    it('renders the input field with the correct hint', () => {
        render(
            <GDSInput
                name="input"
                label="Enter your name"
                hint="Please provide your full name"
                labelIsPageTitle={false}
                value={undefined}
            />
        );
        const hint = screen.getByText(/please provide your full name/i);
        expect(hint).toBeInTheDocument();
    });

    it('renders the input field with error message when errors are passed', () => {
        render(
            <GDSInput
                name="input"
                label="Enter your name"
                hint={undefined}
                errors={["Name is required"]}
                labelIsPageTitle={false}
                value={undefined}
            />
        );
        const errorMessage = screen.getByText(/name is required/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it('renders the input field with the correct default value', () => {
        render(
            <GDSInput
                name="input"
                label="Enter your name"
                hint={undefined}
                value="John Doe"
                labelIsPageTitle={false}
            />
        );
        const input = screen.getByDisplayValue(/john doe/i);
        expect(input).toBeInTheDocument();
    });

    it('renders the input field with the correct label style when labelIsPageTitle is true', () => {
        render(<GDSInput name="input" label="Enter your name" hint={undefined} labelIsPageTitle={true} value={undefined} />);
        const label = screen.getByRole('heading', { level: 1 });
        expect(label).toHaveTextContent(/enter your name/i);
    });

it('should not have any accessibility violations', async () => {
        let renderResult = render(<GDSInput name="input" label="Enter your name" hint={"Please provide your full name"} labelIsPageTitle={true} value={undefined} />);
        const results = await axe(renderResult.container);
        expect(results).toHaveNoViolations();

        renderResult = render(<GDSInput name="input" label="Enter your name" hint={"Please provide your full name"} labelIsPageTitle={false} value={undefined}/>);
        const results2 = await axe(renderResult.container);
        expect(results2).toHaveNoViolations();

        renderResult = render(<GDSInput name="input" label="Enter your name" hint={undefined} labelIsPageTitle={true} value={undefined}/>);
        const results3 = await axe(renderResult.container);
        expect(results3).toHaveNoViolations();

        renderResult = render(<GDSInput name="input" label="Enter your name" hint={undefined} labelIsPageTitle={true} errors={['You must accept the terms']} value={undefined} />);
        const results4 = await axe(renderResult.container);
        expect(results4).toHaveNoViolations();        

        renderResult = render(<GDSInput name="input" label="Enter your name" hint={"Please read the terms carefully"} labelIsPageTitle={true} errors={['You must accept the terms']} value={undefined} />);
        const results5 = await axe(renderResult.container);
        expect(results5).toHaveNoViolations();        
    });        
});
