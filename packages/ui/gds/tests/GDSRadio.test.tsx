import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect'; // Ensure jest-axe matchers are extended
import { axe } from 'jest-axe';
import GDSRadio from '../src/GDSRadio';

describe('GDSRadio Component', () => {
    it('renders the radio group with the correct label', () => {
        render(<GDSRadio name="choices" label="Choose an option" hint={undefined} labelIsPageTitle={false} options={[]} />);
        const legend = screen.getByText(/choose an option/i);
        expect(legend).toBeInTheDocument();
    });

    it('renders the radio group with the correct hint', () => {
        render(
            <GDSRadio
                name="choices"
                label="Choose an option"
                hint="Please select one of the options"
                labelIsPageTitle={false}
                options={[]}
            />
        );
        const hint = screen.getByText(/please select one of the options/i);
        expect(hint).toBeInTheDocument();
    });

    it('renders the radio group with error message when errors are passed', () => {
        render(
            <GDSRadio
                name="choices"
                label="Choose an option"
                hint={undefined}
                errors={["You must select an option"]}
                labelIsPageTitle={false}
                options={[]}
            />
        );
        const errorMessage = screen.getByText(/you must select an option/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it('renders the radio group with options', () => {
        const options = [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
        ];
        render(<GDSRadio name="choices" label="Choose an option" hint={undefined} options={options} labelIsPageTitle={false} />);
        const option1 = screen.getByLabelText(/option 1/i);
        const option2 = screen.getByLabelText(/option 2/i);
        expect(option1).toBeInTheDocument();
        expect(option2).toBeInTheDocument();
    });

    it('renders the radio group with the correct default checked option', () => {
        const options = [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
        ];
        render(
            <GDSRadio
                name="choices"
                label="Choose an option"
                hint={undefined}
                options={options}
                answer={{ value: 'option1' }}
                labelIsPageTitle={false}
            />
        );
        const option1 = screen.getByLabelText(/option 1/i);
        expect(option1).toBeChecked();
    });

    it('renders the radio group with the correct legend style when labelIsPageTitle is true', () => {
        render(<GDSRadio name="choices" label="Choose an option" hint={undefined} labelIsPageTitle={true} options={[]} />);
        const legend = screen.getByRole('heading', { level: 1 });
        expect(legend).toHaveTextContent(/choose an option/i);
    });

it('should not have any accessibility violations', async () => {
        const options = [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
        ];

        let renderResult = render(<GDSRadio name="terms" label="Accept Terms" hint={"Please read the terms carefully"} options={options} labelIsPageTitle={true} />);
        const results = await axe(renderResult.container);
        expect(results).toHaveNoViolations();

        renderResult = render(<GDSRadio name="terms" label="Accept Terms" hint={"Please read the terms carefully"} options={options} labelIsPageTitle={true} />);
        const results2 = await axe(renderResult.container);
        expect(results2).toHaveNoViolations();

        renderResult = render(<GDSRadio name="terms" label="Accept Terms" hint={undefined} options={options} labelIsPageTitle={true} />);
        const results3 = await axe(renderResult.container);
        expect(results3).toHaveNoViolations();

        renderResult = render(<GDSRadio name="terms" label="Accept Terms" hint={undefined} options={options} labelIsPageTitle={true} errors={['You must accept the terms']} />);
        const results4 = await axe(renderResult.container);
        expect(results4).toHaveNoViolations();        

        renderResult = render(<GDSRadio name="terms" label="Accept Terms" hint={"Please read the terms carefully"} options={options} labelIsPageTitle={true} errors={['You must accept the terms']} />);
        const results5 = await axe(renderResult.container);
        expect(results5).toHaveNoViolations();        
    });        
});
