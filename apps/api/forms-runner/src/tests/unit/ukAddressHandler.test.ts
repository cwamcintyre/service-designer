import { UKAddressComponentHandler } from '@/utils/componentHandler/ukAddressHandler';
import { Component, ValidationRule, UKAddress } from '@model/formTypes';

describe('UKAddressComponentHandler', () => {
    describe('IsFor', () => {
        it('should return true for ukaddress type', () => {
            expect(UKAddressComponentHandler.IsFor('ukaddress')).toBe(true);
        });

        it('should return false for non-ukaddress types', () => {
            expect(UKAddressComponentHandler.IsFor('text')).toBe(false);
            expect(UKAddressComponentHandler.IsFor('number')).toBe(false);
        });
    });

    describe('Validate', () => {
        it('should return errors for missing required fields if the component is not optional', async () => {
            const mockComponent: Component = {
                name: 'addressField',
                questionId: 'q1',
                labelIsPageTitle: false,
            };

            const handler = new UKAddressComponentHandler();
            const errors = await handler.Validate(mockComponent, { addressField: {} });

            expect(errors).toContain('[addressLine1]-Enter address line 1, typically the building and street');
            expect(errors).toContain('[addressTown]-Enter town or city');
            expect(errors).toContain('[addressPostcode]-Enter postcode');
        });

        it('should ignore validation rules if the component is empty and the component is optional', async () => {
            const mockComponent: Component = {
                name: 'addressField',
                questionId: 'q1',
                labelIsPageTitle: false,
                optional: true,
                validationRules: [
                    { id: 'rule1', expression: 'data.addressField.town === "London"', errorMessage: 'Town must be London' } as ValidationRule,
                ],
            };

            const handler = new UKAddressComponentHandler();
            const errors = await handler.Validate(mockComponent, { addressField: { addressLine1: '', town: '', postcode: '' } });

            expect(errors).toEqual([]);
        });

        it('should return an empty array if the component is optional', async () => {
            const mockComponent: Component = {
                name: 'addressField',
                questionId: 'q1',
                labelIsPageTitle: false,
                optional: true
            };

            const handler = new UKAddressComponentHandler();
            const errors = await handler.Validate(mockComponent, { addressField: { addressLine1: '', town: '', postcode: '' } });

            expect(errors).toEqual([]);
        });

        it('should return an error for invalid postcode', async () => {
            const mockComponent: Component = {
                name: 'addressField',
                questionId: 'q1',
                labelIsPageTitle: false,
            };

            const handler = new UKAddressComponentHandler();
            const invalidPostcodes = ['INVALID', '12345', 'ABCDE', 'SW1A2', 'SW1A 2A', 'SW1A-2AA'];

            for (const postcode of invalidPostcodes) {
                const errors = await handler.Validate(mockComponent, { addressField: { postcode } });
                expect(errors).toContain('[addressPostcode]-Enter a full UK postcode');
            }
        });

        it('should return validation errors for invalid data', async () => {
            const mockComponent: Component = {
                name: 'addressField',
                questionId: 'q1',
                labelIsPageTitle: false,
                validationRules: [
                    { id: 'rule1', expression: 'data.addressField.town === "London"', errorMessage: 'Town must be London' } as ValidationRule,
                ],
            };

            const handler = new UKAddressComponentHandler();
            const errors = await handler.Validate(mockComponent, { addressField: { addressLine1: '1 Somewhere', postcode: 'SW1A 2AA', town: 'Manchester' } });

            expect(errors).toContain('Town must be London');
        });

        it('should return an empty array if all validation rules pass', async () => {
            const mockComponent: Component = {
                name: 'addressField',
                questionId: 'q1',
                labelIsPageTitle: false,
                validationRules: [
                    { id: 'rule1', expression: 'data.addressField.town === "London"', errorMessage: 'Town must be London' } as ValidationRule,
                ],
            };

            const handler = new UKAddressComponentHandler();
            const errors = await handler.Validate(mockComponent, { addressField: { addressLine1: '1 Somewhere', town: 'London', postcode: 'SW1A 2AA' } });

            expect(errors).toEqual([]);
        });
    });

    describe('Convert', () => {
        it('should return a UKAddress object with the correct fields', () => {
            const mockComponent: Component = { name: 'addressField', questionId: 'q1', labelIsPageTitle: false };
            const handler = new UKAddressComponentHandler();

            const data = {
                'addressField-addressLine1': '10 Downing Street',
                'addressField-addressLine2': '',
                'addressField-addressTown': 'London',
                'addressField-addressCounty': 'Greater London',
                'addressField-addressPostcode': 'SW1A 2AA',
            };

            const result: UKAddress = handler.Convert(mockComponent, data);

            expect(result).toEqual({
                addressLine1: '10 Downing Street',
                addressLine2: '',
                town: 'London',
                county: 'Greater London',
                postcode: 'SW1A 2AA',
            });
        });
    });
});