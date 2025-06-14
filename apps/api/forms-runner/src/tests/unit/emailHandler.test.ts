import { EmailComponentHandler } from '@/utils/componentHandler/emailHandler';
import { Component, ValidationRule } from '@model/formTypes';

describe('EmailComponentHandler', () => {
    describe('IsFor', () => {
        it('should return true for email type', () => {
            expect(EmailComponentHandler.IsFor('email')).toBe(true);
        });

        it('should return false for non-email types', () => {
            expect(EmailComponentHandler.IsFor('text')).toBe(false);
            expect(EmailComponentHandler.IsFor('checkbox')).toBe(false);
        });
    });

    describe('Validate', () => {

        it('should throw an error if the component name is not provided', async () => {
            const mockComponent: Component = {
                questionId: 'q1',
                labelIsPageTitle: false
            };
            const handler = new EmailComponentHandler();
            await expect(handler.Validate(mockComponent, {})).rejects.toThrow('Component name is required');
        });

        it('should return an error for each invalid email format', async () => {
            const mockComponent: Component = { name: 'emailField', questionId: 'q1', labelIsPageTitle: false };

            const handler = new EmailComponentHandler();

            const invalidEmails = [
                { email: 'invalid-email', error: 'Enter an email address in the correct format, like name@example.com' },
                { email: 'user@', error: 'Enter an email address in the correct format, like name@example.com' },
                { email: '@example.com', error: 'Enter an email address in the correct format, like name@example.com' },
                { email: 'user@.com', error: 'Enter an email address in the correct format, like name@example.com' },
                { email: 'user@com', error: 'Enter an email address in the correct format, like name@example.com' },
                { email: 'user@@example.com', error: 'Enter an email address in the correct format, like name@example.com' },
                { email: 'user@ example.com', error: 'Enter an email address in the correct format, like name@example.com' },
                { email: 'user@example..com', error: 'Enter an email address in the correct format, like name@example.com' },
                { email: '', error: 'Enter an email address in the correct format, like name@example.com' },
                { email: null, error: 'Enter an email address in the correct format, like name@example.com' },
                { email: undefined, error: 'Enter an email address in the correct format, like name@example.com' }
            ];

            for (const { email, error } of invalidEmails) {
                const errors = await handler.Validate(mockComponent, { emailField: email });
                expect(errors).toContain(error);
            }
        });

        it('should not return an error if email is empty and field is optional', async () => {
            const mockComponent: Component = { name: 'emailField', questionId: 'q1', labelIsPageTitle: false, optional: true };

            const handler = new EmailComponentHandler();

            const invalidEmails = [
                { email: '', error: 'Enter an email address in the correct format, like name@example.com' },
                { email: null, error: 'Enter an email address in the correct format, like name@example.com' },
                { email: undefined, error: 'Enter an email address in the correct format, like name@example.com' }
            ];

            for (const { email, error } of invalidEmails) {
                const errors = await handler.Validate(mockComponent, { emailField: email });
                expect(errors).not.toContain(error);
            }
        });

        it('should ignore validation rules if email is empty and field is optional', async () => {
            const mockComponent: Component = { name: 'emailField', questionId: 'q1', labelIsPageTitle: false, optional: true,
                validationRules: [
                    { id: 'rule1', expression: 'data.emailField.includes("@example.com")', errorMessage: 'Email must be from example.com' } as ValidationRule,
                ] };

            const handler = new EmailComponentHandler();

            const invalidEmails = [
                { email: '', error: 'Enter an email address in the correct format, like name@example.com' },
                { email: null, error: 'Enter an email address in the correct format, like name@example.com' },
                { email: undefined, error: 'Enter an email address in the correct format, like name@example.com' }
            ];

            for (const { email, error } of invalidEmails) {
                const errors = await handler.Validate(mockComponent, { emailField: email });
                expect(errors).not.toContain(error);
            }
        });

        it('should return validation errors for invalid data', async () => {
            const mockComponent: Component = {
                name: 'emailField',
                questionId: 'q1',
                labelIsPageTitle: false,
                validationRules: [
                    { id: 'rule1', expression: 'data.emailField.includes("@example.com")', errorMessage: 'Email must be from example.com' } as ValidationRule,
                ],
            };

            const handler = new EmailComponentHandler();
            const errors = await handler.Validate(mockComponent, { emailField: 'user@other.com' });

            expect(errors).toContain('Email must be from example.com');
        });

        it('should return an empty array if all validation rules pass', async () => {
            const mockComponent: Component = {
                name: 'emailField',
                questionId: 'q1',
                labelIsPageTitle: false,
                validationRules: [
                    { id: 'rule1', expression: 'data.emailField.includes("@example.com")', errorMessage: 'Email must be from example.com' } as ValidationRule,
                ],
            };

            const handler = new EmailComponentHandler();
            const errors = await handler.Validate(mockComponent, { emailField: 'user@example.com' });

            expect(errors).toEqual([]);
        });
    });

    describe('Convert', () => {
        it('should return the value from data for a named component', () => {
            const mockComponent: Component = { name: 'emailField', questionId: 'q1', labelIsPageTitle: false };
            const handler = new EmailComponentHandler();

            const result = handler.Convert(mockComponent, { emailField: 'user@example.com' });

            expect(result).toBe('user@example.com');
        });

        it('should throw an error if the component name is not provided', () => {
            const mockComponent: Component = {
                questionId: 'q1',
                labelIsPageTitle: false
            };
            const handler = new EmailComponentHandler();
            expect(() => handler.Convert(mockComponent, {})).toThrow('Component name is required');
        });        
    });
});