import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect'; // Ensure jest-axe matchers are extended
import { axe } from 'jest-axe';
import GDSYesNo from '../src/GDSYesNo';

describe('GDSYesNo Component', () => {
    it('renders the yes/no radio group with the correct label', () => {
        render(<GDSYesNo key="yesno" name="yesno" label="Do you agree?" hint={undefined} labelIsPageTitle={false} />);
        const legend = screen.getByText(/do you agree\?/i);
        expect(legend).toBeInTheDocument();
    });

    it('renders the yes/no radio group with the correct hint', () => {
        render(
            <GDSYesNo
                key="yesno"
                name="yesno"
                label="Do you agree?"
                hint="Please select yes or no"
                labelIsPageTitle={false}
            />
        );
        const hint = screen.getByText(/please select yes or no/i);
        expect(hint).toBeInTheDocument();
    });

    it('renders the yes/no radio group with error message when errors are passed', () => {
        render(
            <GDSYesNo
                key="yesno"
                name="yesno"
                label="Do you agree?"
                hint={undefined}
                errors={["You must select yes or no"]}
                labelIsPageTitle={false}
            />
        );
        const errorMessage = screen.getByText(/you must select yes or no/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it('renders the yes/no radio group with the correct default checked option', () => {
        render(
            <GDSYesNo
                key="yesno"
                name="yesno"
                label="Do you agree?"
                hint={undefined}
                answer={{ value: 'yes' }}
                labelIsPageTitle={false}
            />
        );
        const yesOption = screen.getByLabelText(/yes/i);
        expect(yesOption).toBeChecked();
    });

    it('renders the yes/no radio group with the correct legend style when labelIsPageTitle is true', () => {
        render(<GDSYesNo key="yesno" name="yesno" label="Do you agree?" hint={undefined} labelIsPageTitle={true} />);
        const legend = screen.getByRole('heading', { level: 1 });
        expect(legend).toHaveTextContent(/do you agree\?/i);
    });

it('should not have any accessibility violations', async () => {

        let renderResult = render(<GDSYesNo key="yesno" name="yesno" label="Do you agree?" hint={"Please select yes or no"} labelIsPageTitle={true} />);
        const results = await axe(renderResult.container);
        expect(results).toHaveNoViolations();

        renderResult = render(<GDSYesNo key="yesno" name="yesno" label="Do you agree?" hint={"Please select yes or no"} labelIsPageTitle={true} />);
        const results2 = await axe(renderResult.container);
        expect(results2).toHaveNoViolations();

        renderResult = render(<GDSYesNo key="yesno" name="yesno" label="Do you agree?" hint={undefined} labelIsPageTitle={true} />);
        const results3 = await axe(renderResult.container);
        expect(results3).toHaveNoViolations();

        renderResult = render(<GDSYesNo key="yesno" name="yesno" label="Do you agree?" hint={undefined} labelIsPageTitle={true} errors={['You must select yes or no']} />);
        const results4 = await axe(renderResult.container);
        expect(results4).toHaveNoViolations();        

        renderResult = render(<GDSYesNo key="yesno" name="yesno" label="Do you agree?" hint={"Please select yes or no"} labelIsPageTitle={true} errors={['You must select yes or no']} />);
        const results5 = await axe(renderResult.container);
        expect(results5).toHaveNoViolations();        
    });        
});
