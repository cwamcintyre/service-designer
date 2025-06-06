import { PhoneNumberComponentHandler } from '@/utils/componentHandler/phoneNumberHandler';
import { Component, ValidationRule } from '@model/formTypes';

describe('PhoneNumberComponentHandler', () => {
    describe('IsFor', () => {
        it('should return true for phonenumber type', () => {
            expect(PhoneNumberComponentHandler.IsFor('phonenumber')).toBe(true);
        });

        it('should return false for non-phonenumber types', () => {
            expect(PhoneNumberComponentHandler.IsFor('text')).toBe(false);
            expect(PhoneNumberComponentHandler.IsFor('email')).toBe(false);
        });
    });

    describe('Validate', () => {
        it('should return an error for each invalid phone number format', async () => {
            const mockComponent: Component = { name: 'phoneNumberField', questionId: 'q1', labelIsPageTitle: false };

            const handler = new PhoneNumberComponentHandler();

            const invalidPhoneNumbers = [
                { phoneNumber: '12345', error: 'Enter a phone number, like 02010 960 001, 07729 900 982 or +44 808 157 0192' },
                { phoneNumber: 'abcd1234', error: 'Enter a phone number, like 02010 960 001, 07729 900 982 or +44 808 157 0192' },
                { phoneNumber: '+44', error: 'Enter a phone number, like 02010 960 001, 07729 900 982 or +44 808 157 0192' },
                { phoneNumber: '', error: 'Enter a phone number, like 02010 960 001, 07729 900 982 or +44 808 157 0192' },
                { phoneNumber: null, error: 'Enter a phone number, like 02010 960 001, 07729 900 982 or +44 808 157 0192' },
                { phoneNumber: undefined, error: 'Enter a phone number, like 02010 960 001, 07729 900 982 or +44 808 157 0192' }
            ];

            for (const { phoneNumber, error } of invalidPhoneNumbers) {
                const errors = await handler.Validate(mockComponent, { phoneNumberField: phoneNumber });
                expect(errors).toContain(error);
            }
        });

        it('should not return an error if phone number is empty and field is optional', async () => {
            const mockComponent: Component = { name: 'phoneNumberField', questionId: 'q1', labelIsPageTitle: false, optional: true };

            const handler = new PhoneNumberComponentHandler();

            const invalidNumbers = [
                { phoneNumber: '', error: 'Enter a phone number, like 02010 960 001, 07729 900 982 or +44 808 157 0192' },
                { phoneNumber: null, error: 'Enter a phone number, like 02010 960 001, 07729 900 982 or +44 808 157 0192' },
                { phoneNumber: undefined, error: 'Enter a phone number, like 02010 960 001, 07729 900 982 or +44 808 157 0192' }
            ];

            for (const { phoneNumber, error } of invalidNumbers) {
                const errors = await handler.Validate(mockComponent, { numberField: phoneNumber });
                expect(errors).not.toContain(error);
            }
        });

        it('should ignore validation rules if phone number is empty and field is optional', async () => {
            const mockComponent: Component = { name: 'phoneNumberField', questionId: 'q1', labelIsPageTitle: false, optional: true,
                validationRules: [
                    { id: 'rule1', expression: 'data.phoneNumberField.startsWith("+44")', errorMessage: 'Phone number must start with +44' } as ValidationRule
                ] };

            const handler = new PhoneNumberComponentHandler();

            const invalidNumbers = [
                { phoneNumber: '', error: 'Enter a phone number, like 02010 960 001, 07729 900 982 or +44 808 157 0192' },
                { phoneNumber: null, error: 'Enter a phone number, like 02010 960 001, 07729 900 982 or +44 808 157 0192' },
                { phoneNumber: undefined, error: 'Enter a phone number, like 02010 960 001, 07729 900 982 or +44 808 157 0192' }
            ];

            for (const { phoneNumber, error } of invalidNumbers) {
                const errors = await handler.Validate(mockComponent, { numberField: phoneNumber });
                expect(errors).not.toContain(error);
            }
        });

        it('should return validation errors for invalid data', async () => {
            const mockComponent: Component = {
                name: 'phoneNumberField',
                questionId: 'q1',
                labelIsPageTitle: false,
                validationRules: [
                    { id: 'rule1', expression: 'data.phoneNumberField.startsWith("+44")', errorMessage: 'Phone number must start with +44' } as ValidationRule,
                ],
            };

            const handler = new PhoneNumberComponentHandler();
            const errors = await handler.Validate(mockComponent, { phoneNumberField: '07729900982' });

            expect(errors).toContain('Phone number must start with +44');
        });

        it('should return an empty array if all validation rules pass', async () => {
            const mockComponent: Component = {
                name: 'phoneNumberField',
                questionId: 'q1',
                labelIsPageTitle: false,
                validationRules: [
                    { id: 'rule1', expression: 'data.phoneNumberField.startsWith("+44")', errorMessage: 'Phone number must start with +44' } as ValidationRule,
                ],
            };

            const handler = new PhoneNumberComponentHandler();

            const validPhoneNumbers = [
                '+447729900982',
                '+4408081570192',
                '+441234567890',
            ];

            for (const phoneNumber of validPhoneNumbers) {
                const errors = await handler.Validate(mockComponent, { phoneNumberField: phoneNumber });
                expect(errors).toEqual([]);
            }
        });
    });

    describe('Convert', () => {
        it('should return the value from data for a named component', () => {
            const mockComponent: Component = { name: 'phoneNumberField', questionId: 'q1', labelIsPageTitle: false };
            const handler = new PhoneNumberComponentHandler();

            const result = handler.Convert(mockComponent, { phoneNumberField: '+447729900982' });

            expect(result).toBe('+447729900982');
        });

        it('should return an empty string for an unnamed component', () => {
            const mockComponent: Component = { questionId: 'q1', labelIsPageTitle: false };
            const handler = new PhoneNumberComponentHandler();

            const result = handler.Convert(mockComponent, {});

            expect(result).toBe('');
        });
    });
});