import { DatePartsComponentHandler } from '@/utils/componentHandler/datePartsHandler';
import { DateComponent, DateComponentComparison, DateValidationRule } from '@model/formTypes';

describe('DatePartsComponentHandler', () => {
    describe('IsFor', () => {
        it('should return true for "dateParts" type', () => {
            expect(DatePartsComponentHandler.IsFor('dateParts')).toBe(true);
        });

        it('should return false for other types', () => {
            expect(DatePartsComponentHandler.IsFor('text')).toBe(false);
            expect(DatePartsComponentHandler.IsFor('checkbox')).toBe(false);
        });
    });

    describe('Validate', () => {

        it('should throw an error if the component name is not provided', async () => {
            const mockComponent: DateComponent = {
                questionId: 'q1',
                labelIsPageTitle: false
            };
            const handler = new DatePartsComponentHandler();
            await expect(handler.Validate(mockComponent, {})).rejects.toThrow('Component name is required');
        });

        it('should return an error if required date fields are empty', async () => {
            const mockComponent: DateComponent = { name: 'testDate', optional: false } as DateComponent;
            const handler = new DatePartsComponentHandler();

            const errors = await handler.Validate(mockComponent, {});

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Enter your date',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        it('should not return an error if optional date fields are empty', async () => {
            const mockComponent: DateComponent = { name: 'testDate', optional: true } as DateComponent;
            const handler = new DatePartsComponentHandler();

            const errors = await handler.Validate(mockComponent, {});

            expect(errors).toEqual([]);
        });

        it('should return an error for completely empty date parts', async () => {
            const mockComponent: DateComponent = { name: 'testDate', optional: false } as DateComponent;
            const handler = new DatePartsComponentHandler();

            const errors = await handler.Validate(mockComponent, { testDate: { 'day': '', 'month': '', 'year': '' } });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Enter your date',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        it('should return an error for non-numeric date parts', async () => {
            const mockComponent: DateComponent = { name: 'testDate', optional: false } as DateComponent;
            const handler = new DatePartsComponentHandler();

            const errors = await handler.Validate(mockComponent, { testDate: { 'day': 'NOT A DAY', 'month': 'blah', 'year': 'silly' } });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'date must be a real date',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        it('should return an error if the year is too small to be valid', async () => {
            const mockComponent: DateComponent = { name: 'testDate', optional: false } as DateComponent;
            const handler = new DatePartsComponentHandler();

            const errors = await handler.Validate(mockComponent, { testDate: { 'day': '1', 'month': '1', 'year': '1899' } });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'date must be a real date',
                dayError: false,
                monthError: false,
                yearError: true
            }));
        });

        it('should return an error if the year is too large to be valid', async () => {
            const mockComponent: DateComponent = { name: 'testDate', optional: false } as DateComponent;
            const handler = new DatePartsComponentHandler();

            const errors = await handler.Validate(mockComponent, { testDate: { 'day': '1', 'month': '1', 'year': '10000' } });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Year must include 4 numbers',
                dayError: false,
                monthError: false,
                yearError: true
            }));
        });

        it('should return an error for invalid date parts', async () => {
            const mockComponent: DateComponent = { name: 'testDate', optional: false } as DateComponent;
            const handler = new DatePartsComponentHandler();

            const errors = await handler.Validate(mockComponent, { testDate: { 'day': '32', 'month': '13', 'year': '2023' } });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'date must be a real date',
                dayError: true,
                monthError: true,
                yearError: false
            }));
        });

        it('should fail a date against a rule requiring it to be in the past', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.InPast,
                        errorMessage: 'Date must be in the past'
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const errors = await handler.Validate(mockComponent, { testDate: { 'day': '1', 'month': '1', 'year': '3000' } });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Date must be in the past',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        it('should pass a date against a rule requiring it to be in the past', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.InPast,
                        errorMessage: 'Date must be in the past'
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const errors = await handler.Validate(mockComponent, { testDate: { 'day': '1', 'month': '1', 'year': '1920' } });

            expect(errors).toEqual([]);
        });

        it('should pass a date against a rule requiring it to be today or in the past', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.TodayOrInPast,
                        errorMessage: 'Date must be today or in the past'
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const today = new Date();
            const errors = await handler.Validate(mockComponent, { testDate: { 'day': today.getDate().toString(), 'month': (today.getMonth() + 1).toString(), 'year': today.getFullYear().toString() } });

            expect(errors).toEqual([]);
        });

        it('should fail a date against a rule requiring it to be today or in the past', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.TodayOrInPast,
                        errorMessage: 'Date must be today or in the past'
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const today = new Date();
            const errors = await handler.Validate(mockComponent, { testDate: { 'day': today.getDate().toString(), 'month': (today.getMonth() + 1).toString(), 'year': (today.getFullYear() + 1).toString() } });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Date must be today or in the past',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        it('should pass a date against a rule requiring it to be in the future', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.InFuture,
                        errorMessage: 'Date must be in the future'
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const errors = await handler.Validate(mockComponent, { testDate: { 'day': '1', 'month': '1', 'year': '3000' } });

            expect(errors).toEqual([]);
        });

        it('should fail a date against a rule requiring it to be in the future', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.InFuture,
                        errorMessage: 'Date must be in the future'
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const errors = await handler.Validate(mockComponent, { testDate: { 'day': '1', 'month': '1', 'year': '1920' } });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Date must be in the future',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        it('should pass a date against a rule requiring it to be today or in the future', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.TodayOrInFuture,
                        errorMessage: 'Date must be today or in the future'
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const today = new Date();
            const errors = await handler.Validate(mockComponent, { testDate: { 'day': today.getDate().toString(), 'month': (today.getMonth() + 1).toString(), 'year': today.getFullYear().toString() } });

            expect(errors).toEqual([]);
        });

        it('should fail a date against a rule requiring it to be today or in the future', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.TodayOrInFuture,
                        errorMessage: 'Date must be today or in the future'
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const today = new Date();
            const errors = await handler.Validate(mockComponent, { testDate: { 'day': today.getDate().toString(), 'month': (today.getMonth() + 1).toString(), 'year': (today.getFullYear() - 1).toString() } });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Date must be today or in the future',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        it('should pass a date against a rule requiring it to be the same or after a fixed date', async () => {
            const fixed = new Date();

            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.SameOrAfter,
                        errorMessage: 'Date must be the same or after the fixed date',
                        fixedDate: fixed
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const errors = await handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() } 
            });

            expect(errors).toEqual([]);
        });

        it('should fail a date against a rule requiring it to be the same or after a fixed date', async () => {
            const fixed = new Date();
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.SameOrAfter,
                        errorMessage: 'Date must be the same or after the fixed date',
                        fixedDate: fixed
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const errors = await handler.Validate(mockComponent, { testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': (fixed.getFullYear() - 1).toString() } });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Date must be the same or after the fixed date',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        it('should throw an error if fixed date is not given for SameOrAfter', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.SameOrAfter,
                        errorMessage: 'Date must be the same or after the fixed date',
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            await expect(handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
            })).rejects.toThrow('Fixed date is required for comparison type: sameOrAfter');
        });

        it('should throw an error if fixed date is not given for SameOrBefore', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.SameOrBefore,
                        errorMessage: 'Date must be the same or before the fixed date',
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            await expect(handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
            })).rejects.toThrow('Fixed date is required for comparison type: sameOrBefore');
        });

        it('should throw an error if fixed date is not given for After', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.After,
                        errorMessage: 'Date must be after the fixed date',
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            await expect(handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
            })).rejects.toThrow('Fixed date is required for comparison type: after');
        });

        it('should throw an error if fixed date is not given for Before', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.Before,
                        errorMessage: 'Date must be before the fixed date',
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            await expect(handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
            })).rejects.toThrow('Fixed date is required for comparison type: before');
        });

        it('should throw an error if before and after dates are not given for Between', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.Between,
                        errorMessage: 'Date must be between the fixed dates',
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            await expect(handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
            })).rejects.toThrow('Before and after date is required for comparison type: between');
        });

        it('should throw an error if before date is not given for Between', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.Between,
                        errorMessage: 'Date must be between the fixed dates',
                        endDate: new Date()
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            await expect(handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
            })).rejects.toThrow('Before date is required for comparison type: between');
        });

        it('should throw an error if after date is not given for Between', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.Between,
                        errorMessage: 'Date must be between the fixed dates',
                        startDate: new Date()
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            await expect(handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
            })).rejects.toThrow('After date is required for comparison type: between');
        });

        it('should throw an error if the date comparison type is unknown', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: 'unknown' as DateComponentComparison,
                        errorMessage: 'Date must be between the fixed dates'
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            await expect(handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
            })).rejects.toThrow('Unknown date comparison type: unknown');
        });

        it('should throw an error if fixed date has empty parts', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.SameOrAfter,
                        errorMessage: 'Date must be the same or after the fixed date',
                        fixedDateId: 'fixedDate'
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            await expect(handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() },
                fixedDate: { 'day': "", 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
            })).rejects.toThrow('Invalid date parts provided for conversion');
        });

        it('should throw an error if fixed date has non-numeric parts', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.SameOrAfter,
                        errorMessage: 'Date must be the same or after the fixed date',
                        fixedDateId: 'fixedDate'
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            await expect(handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() },
                fixedDate: { 'day': "NOT A DAY", 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
            })).rejects.toThrow('Invalid date parts provided for conversion');
        });

        it('should pass a date against a rule requiring it to be the same or after a form date', async () => {

            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.SameOrAfter,
                        errorMessage: 'Date must be the same or after the fixed date',
                        fixedDateId: 'fixedDate'
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            const errors = await handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() },
                fixedDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
            });

            expect(errors).toEqual([]);
        });

        it('should fail a date against a rule requiring it to be the same or after a form date', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.SameOrAfter,
                        errorMessage: 'Date must be the same or after the fixed date',
                        fixedDateId: 'fixedDate'
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            const errors = await handler.Validate(mockComponent, 
                { testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': (fixed.getFullYear() - 1).toString() },
                  fixedDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
                });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Date must be the same or after the fixed date',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        // Test for "After" comparison type

        it('should pass a date against a rule requiring it to be after a fixed date', async () => {
            const fixed = new Date();

            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.After,
                        errorMessage: 'Date must be after the fixed date',
                        fixedDate: fixed
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const errors = await handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': (fixed.getFullYear() + 1).toString() } 
            });

            expect(errors).toEqual([]);
        });

        it('should fail a date against a rule requiring it to be after a fixed date', async () => {
            const fixed = new Date();
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.After,
                        errorMessage: 'Date must be after the fixed date',
                        fixedDate: fixed
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const errors = await handler.Validate(mockComponent, { testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() } });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Date must be after the fixed date',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        it('should pass a date against a rule requiring it to be after a form date', async () => {

            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.After,
                        errorMessage: 'Date must be after the fixed date',
                        fixedDateId: 'fixedDate'
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            const errors = await handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': (fixed.getFullYear() + 1).toString() },
                fixedDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
            });

            expect(errors).toEqual([]);
        });

        it('should fail a date against a rule requiring it to be after a form date', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.After,
                        errorMessage: 'Date must be after the fixed date',
                        fixedDateId: 'fixedDate'
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            const errors = await handler.Validate(mockComponent, 
                { testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() },
                  fixedDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
                });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Date must be after the fixed date',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        // ---------------

        // Test for "SameOrBefore" comparison type

        it('should pass a date against a rule requiring it to be same or before a fixed date', async () => {
            const fixed = new Date();

            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.SameOrBefore,
                        errorMessage: 'Date must be same or before the fixed date',
                        fixedDate: fixed
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const errors = await handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() } 
            });

            expect(errors).toEqual([]);
        });

        it('should fail a date against a rule requiring it to be same or before a fixed date', async () => {
            const fixed = new Date();
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.SameOrBefore,
                        errorMessage: 'Date must be same or before the fixed date',
                        fixedDate: fixed
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const errors = await handler.Validate(mockComponent, { testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': (fixed.getFullYear() + 1).toString() } });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Date must be same or before the fixed date',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        it('should pass a date against a rule requiring it to be same or before a form date', async () => {

            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.SameOrBefore,
                        errorMessage: 'Date must be same or before the fixed date',
                        fixedDateId: 'fixedDate'
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            const errors = await handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() },
                fixedDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
            });

            expect(errors).toEqual([]);
        });

        it('should fail a date against a rule requiring it to be same or before a form date', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.SameOrBefore,
                        errorMessage: 'Date must be same or before the fixed date',
                        fixedDateId: 'fixedDate'
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            const errors = await handler.Validate(mockComponent, 
                { testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': (fixed.getFullYear() + 1).toString() },
                  fixedDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
                });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Date must be same or before the fixed date',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        // ---------------

        // Test for "Before" comparison type

        it('should pass a date against a rule requiring it to be before a fixed date', async () => {
            const fixed = new Date();

            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.Before,
                        errorMessage: 'Date must be before the fixed date',
                        fixedDate: fixed
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const errors = await handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': (fixed.getFullYear()-1).toString() } 
            });

            expect(errors).toEqual([]);
        });

        it('should fail a date against a rule requiring it to be before a fixed date', async () => {
            const fixed = new Date();
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.Before,
                        errorMessage: 'Date must be before the fixed date',
                        fixedDate: fixed
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const errors = await handler.Validate(mockComponent, { testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() } });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Date must be before the fixed date',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        it('should pass a date against a rule requiring it to be before a form date', async () => {

            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.Before,
                        errorMessage: 'Date must be before the fixed date',
                        fixedDateId: 'fixedDate'
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            const errors = await handler.Validate(mockComponent, { 
                testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': (fixed.getFullYear()-1).toString() },
                fixedDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
            });

            expect(errors).toEqual([]);
        });

        it('should fail a date against a rule requiring it to be before a form date', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.Before,
                        errorMessage: 'Date must be before the fixed date',
                        fixedDateId: 'fixedDate'
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            const errors = await handler.Validate(mockComponent, 
                { testDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() },
                  fixedDate: { 'day': fixed.getDate().toString(), 'month': (fixed.getMonth() + 1).toString(), 'year': fixed.getFullYear().toString() }
                });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Date must be before the fixed date',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        // ---------------

        // Test for "Between" comparison type

        it('should pass a date against a rule requiring it to be between two fixed dates', async () => {
            const fixedStart = new Date(2023, 0, 1); // January 1, 2023
            const fixedEnd = new Date(2023, 11, 31); // December 31, 2023
            fixedEnd.setDate(fixedEnd.getDate() + 1);

            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.Between,
                        errorMessage: 'Date must be between the fixed start and end dates',
                        startDate: fixedStart,
                        endDate: fixedEnd
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const errors = await handler.Validate(mockComponent, { 
                testDate: { 'day': '5', 'month': '6', 'year': '2023' } 
            });

            expect(errors).toEqual([]);
        });

        it('should fail a date against a rule requiring it to be between two fixed dates', async () => {
            const fixedStart = new Date(2023, 0, 1); // January 1, 2023
            const fixedEnd = new Date(2023, 11, 31); // December 31, 2023
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.Between,
                        errorMessage: 'Date must be between the fixed start and end dates',
                        startDate: fixedStart,
                        endDate: fixedEnd
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const errors = await handler.Validate(mockComponent, {
                testDate: { 'day': '5', 'month': '6', 'year': '2025' }
            });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Date must be between the fixed start and end dates',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        it('should pass a date against a rule requiring it to be between two form dates', async () => {

            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.Between,
                        errorMessage: 'Date must be between the fixed start and end dates',
                        startDateId: 'fixedStartDate',
                        endDateId: 'fixedEndDate'
                    }
                ]                
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const errors = await handler.Validate(mockComponent, { 
                testDate: { 'day': '5', 'month': '6', 'year': '2023' },
                fixedStartDate: { 'day': '1', 'month': '1', 'year': '2023' },
                fixedEndDate: { 'day': '31', 'month': '12', 'year': '2023' }
            });

            expect(errors).toEqual([]);
        });

        it('should fail a date against a rule requiring it to be between two form dates', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.Between,
                        errorMessage: 'Date must be between the fixed start and end dates',
                        startDateId: 'fixedStartDate',
                        endDateId: 'fixedEndDate'
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const fixed = new Date();
            const errors = await handler.Validate(mockComponent, {
                testDate: { 'day': '5', 'month': '6', 'year': '2025' },
                fixedStartDate: { 'day': '1', 'month': '1', 'year': '2023' },
                fixedEndDate: { 'day': '31', 'month': '12', 'year': '2023' }
            });

            expect(errors).toContain(JSON.stringify({
                errorMessage: 'Date must be between the fixed start and end dates',
                dayError: true,
                monthError: true,
                yearError: true
            }));
        });

        // ---------------

        it('should return no errors for a valid date that passes all rules', async () => {
            const mockComponent: DateComponent = {
                name: 'testDate',
                dateValidationRules: [
                    {
                        comparisonType: DateComponentComparison.InPast,
                        errorMessage: 'Date must be in the past'
                    }
                ]
            } as DateComponent;

            const handler = new DatePartsComponentHandler();
            const errors = await handler.Validate(mockComponent, { testDate: { 'day': '1', 'month': '1', 'year': '1990' } });

            expect(errors).toEqual([]);
        });
    });

    describe('Convert', () => {
        it('should return date parts from data for a named component', () => {
            const mockComponent: DateComponent = { name: 'testDate' } as DateComponent;
            const handler = new DatePartsComponentHandler();

            const result = handler.Convert(mockComponent, {
                'testDate-day': '01',
                'testDate-month': '01',
                'testDate-year': '2023'
            });

            expect(result).toEqual({
                day: '01',
                month: '01',
                year: '2023'
            });
        });

        it('should throw an error if the component name is not provided', () => {
            const mockComponent: DateComponent = {
                questionId: 'q1',
                labelIsPageTitle: false
            };
            const handler = new DatePartsComponentHandler();
            expect(() => handler.Convert(mockComponent, {})).toThrow('Component name is required');
        });          
    });
});