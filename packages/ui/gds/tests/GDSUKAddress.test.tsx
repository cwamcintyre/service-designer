import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import GDSUKAddress from '../src/GDSUKAddress';

describe('GDSUKAddress Component', () => {
    it('renders the UK address form with the correct label', () => {
        render(<GDSUKAddress name="address" label="Enter your address" hint={undefined} labelIsPageTitle={false} />);
        const label = screen.getByText(/enter your address/i);
        expect(label).toBeInTheDocument();
    });

    it('renders the UK address form with the correct hint', () => {
        render(
            <GDSUKAddress
                name="address"
                label="Enter your address"
                hint="Please provide your full address"
                labelIsPageTitle={false}
            />
        );
        const hint = screen.getByText(/please provide your full address/i);
        expect(hint).toBeInTheDocument();
    });

    it('renders the UK address form with error messages for specific fields', () => {
        const errors = [
            '[addressLine1]-Address line 1 is required',
            '[addressTown]-Town or city is required',
            '[addressPostcode]-Postcode is required'
        ];
        render(
            <GDSUKAddress
                name="address"
                label="Enter your address"
                hint={undefined}
                errors={errors}
                labelIsPageTitle={false}
            />
        );
        const line1Error = screen.getByText(/address line 1 is required/i);
        const townError = screen.getByText(/town or city is required/i);
        const postcodeError = screen.getByText(/postcode is required/i);
        expect(line1Error).toBeInTheDocument();
        expect(townError).toBeInTheDocument();
        expect(postcodeError).toBeInTheDocument();
    });

    it('renders the UK address form with the correct default values', () => {
        render(
            <GDSUKAddress
                name="address"
                label="Enter your address"
                hint={undefined}
                answer={{
                    addressLine1: "123 Test Street",
                    addressLine2: "Flat 1",
                    town: "Test Town",
                    county: "Test County",
                    postcode: "TE57 1NG"
                }}
                labelIsPageTitle={false}
            />
        );
        const line1Input = screen.getByDisplayValue(/123 test street/i);
        const line2Input = screen.getByDisplayValue(/flat 1/i);
        const townInput = screen.getByDisplayValue(/test town/i);
        const countyInput = screen.getByDisplayValue(/test county/i);
        const postcodeInput = screen.getByDisplayValue(/te57 1ng/i);
        expect(line1Input).toBeInTheDocument();
        expect(line2Input).toBeInTheDocument();
        expect(townInput).toBeInTheDocument();
        expect(countyInput).toBeInTheDocument();
        expect(postcodeInput).toBeInTheDocument();
    });

    it('renders the UK address form with the correct label style when labelIsPageTitle is true', () => {
        render(<GDSUKAddress name="address" label="Enter your address" hint={undefined} labelIsPageTitle={true} />);
        const label = screen.getByRole('heading', { level: 1 });
        expect(label).toHaveTextContent(/enter your address/i);
    });

    it('passes accessibility checks', async () => {
        const { container } = render(
            <GDSUKAddress
                name="address"
                label="Enter your address"
                hint="Please provide your full address"
                labelIsPageTitle={false}
            />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
