import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect'; // Ensure jest-axe matchers are extended
import { axe } from 'jest-axe';
import GDSCheckbox from '../src/GDSCheckbox';

describe('GDSCheckbox Component', () => {
    it('renders the checkbox group with the correct label', () => {
        render(<GDSCheckbox name="terms" label="Accept Terms" hint={undefined} labelIsPageTitle={false} options={[]} />);
        const legend = screen.getByText(/accept terms/i);
        expect(legend).toBeInTheDocument();
    });

    it('renders the checkbox group with the correct hint', () => {
        render(
            <GDSCheckbox
                name="terms"
                label="Accept Terms"
                hint="Please read the terms carefully"
                labelIsPageTitle={false}
                options={[]}
            />
        );
        const hint = screen.getByText(/please read the terms carefully/i);
        expect(hint).toBeInTheDocument();
    });

    it('renders the checkbox group with error message when errors are passed', () => {
        render(
            <GDSCheckbox
                name="terms"
                label="Accept Terms"
                hint={undefined}
                errors={['You must accept the terms']}
                labelIsPageTitle={false}
                options={[]}
            />
        );
        const errorMessage = screen.getByText(/you must accept the terms/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it('renders the error message with correct aria attributes when errors are passed', () => {
        render(
            <GDSCheckbox
                name="terms"
                label="Accept Terms"
                hint={undefined}
                errors={['You must accept the terms']}
                labelIsPageTitle={false}
                options={[]}
            />
        );

        const errorMessage = screen.getByText(/you must accept the terms/i);
        expect(errorMessage).toBeInTheDocument();

        const fieldset = screen.getByRole('group');
        expect(fieldset).toHaveAttribute('aria-invalid', 'true');
        expect(fieldset).toHaveAttribute('aria-errormessage', 'terms-error');
    });

    it('renders the checkbox group with options', () => {
        const options = [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
        ];
        render(<GDSCheckbox name="terms" label="Accept Terms" hint={undefined} options={options} labelIsPageTitle={false} />);
        const option1 = screen.getByLabelText(/option 1/i);
        const option2 = screen.getByLabelText(/option 2/i);
        expect(option1).toBeInTheDocument();
        expect(option2).toBeInTheDocument();
    });

    it('renders the checkbox group with the correct default checked option', () => {
        const options = [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
        ];
        render(
            <GDSCheckbox
                name="terms"
                label="Accept Terms"
                hint={undefined}
                options={options}
                answer={{ value: 'option1' }}
                labelIsPageTitle={false}
            />
        );
        const option1 = screen.getByLabelText(/option 1/i);
        expect(option1).toBeChecked();
    });

    it('renders the checkbox group with the correct legend style when labelIsPageTitle is true', () => {
        render(<GDSCheckbox name="terms" label="Accept Terms" hint={undefined} labelIsPageTitle={true} options={[]} />);
        const legend = screen.getByRole('heading', { level: 1 });
        expect(legend).toHaveTextContent(/accept terms/i);
    });

    it('should not have any accessibility violations', async () => {
        const options = [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
        ];

        let renderResult = render(<GDSCheckbox name="terms" label="Accept Terms" hint={"Please read the terms carefully"} options={options} labelIsPageTitle={true} />);
        const results = await axe(renderResult.container);
        expect(results).toHaveNoViolations();

        renderResult = render(<GDSCheckbox name="terms" label="Accept Terms" hint={"Please read the terms carefully"} options={options} labelIsPageTitle={true} />);
        const results2 = await axe(renderResult.container);
        expect(results2).toHaveNoViolations();

        renderResult = render(<GDSCheckbox name="terms" label="Accept Terms" hint={undefined} options={options} labelIsPageTitle={true} />);
        const results3 = await axe(renderResult.container);
        expect(results3).toHaveNoViolations();

        renderResult = render(<GDSCheckbox name="terms" label="Accept Terms" hint={undefined} options={options} labelIsPageTitle={true} errors={['You must accept the terms']} />);
        const results4 = await axe(renderResult.container);
        expect(results4).toHaveNoViolations();        

        renderResult = render(<GDSCheckbox name="terms" label="Accept Terms" hint={"Please read the terms carefully"} options={options} labelIsPageTitle={true} errors={['You must accept the terms']} />);
        const results5 = await axe(renderResult.container);
        expect(results5).toHaveNoViolations();        
    });    
});