import { 
    DateParts, 
    type DateComponent, 
    type DateError, 
    DateComponentComparison, 
    type DateValidationRule } from '@model/formTypes';
import { ComponentHandler } from '@/utils/componentHandler/interfaces';

export class DatePartsComponentHandler implements ComponentHandler {
    static IsFor(type: string): boolean {
        return type === 'dateParts';    
    }

    async Validate(component: DateComponent, data: { [key: string]: any }): Promise<string[]> {
        const validationResult: string[] = [];
        
        if (!component.name) {
            throw new Error('Component name is required');
        }

        const input = data[component.name];

        if (!input && component.optional) {
            return validationResult; // If the field is optional and no input, skip validation
        }

        //If nothing is entered
        if (!component.optional) {
            const error = this.checkDateComplete(input, component.dateName ?? 'date');
            if (error) {
                validationResult.push(JSON.stringify(error));
                return validationResult;
            }
        }

        if (!component.optional) {
            const error = this.checkDateIsRealDate(input, component.dateName ?? 'date');
            if (error) {
                validationResult.push(JSON.stringify(error));
                return validationResult;
            }
        }

        for (const dateValidationRule of component.dateValidationRules ?? []) {

            const fixedDate = dateValidationRule.fixedDate ?? (dateValidationRule.fixedDateId ? this.ConvertFromDateParts(data[dateValidationRule.fixedDateId]) : undefined);
            const beforeDate = dateValidationRule.startDate ?? (dateValidationRule.startDateId ? this.ConvertFromDateParts(data[dateValidationRule.startDateId]) : undefined);
            const afterDate = dateValidationRule.endDate ?? (dateValidationRule.endDateId ? this.ConvertFromDateParts(data[dateValidationRule.endDateId]) : undefined);

            const error = this.isValidDateParts(input, dateValidationRule, fixedDate, beforeDate, afterDate);
            if (error) {
                validationResult.push(JSON.stringify(error));
            }
        }

        return validationResult;
    }

    Convert(component: DateComponent, data: { [key: string]: any }): DateParts | undefined {
        if (!component.name) {
            throw new Error('Component name is required');
        }
        const dateParts: DateParts = {
            day: data[`${component.name}-day`]?.trim(),
            month: data[`${component.name}-month`]?.trim(),
            year: data[`${component.name}-year`]?.trim()
        };
        return dateParts;
    }

    private ConvertFromDateParts(dateParts: DateParts): Date {
        if (!dateParts || !dateParts.day || !dateParts.month || !dateParts.year) {
            throw new Error('Invalid date parts provided for conversion');
        }
        const day = parseInt(dateParts.day, 10);
        const month = parseInt(dateParts.month, 10) - 1; // JavaScript months are 0-based
        const year = parseInt(dateParts.year, 10);
        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            throw new Error('Invalid date parts provided for conversion');
        }
        return new Date(year, month, day);
    }

    private isValidDateParts(
        dateParts: DateParts, 
        rule: DateValidationRule, 
        fixedDate: Date | undefined,
        beforeDate: Date | undefined,
        afterDate: Date | undefined): DateError | undefined {

        //If the date is in the future when it needs to be in the past
        //If the date is in the future when it needs to be today or in the past
        //If the date is in the past when it needs to be in the future
        //If the date is in the past when it needs to be today or in the future
        //If the date must be the same as or after another date
        //If the date must be after another date
        //If the date must be the same as or before another date
        //If the date must be before another date
        //If the date must be between two dates
        const { day, month, year } = dateParts;
        
        const date = new Date(parseInt(year ?? ''), 
                              parseInt(month ?? '') - 1,
                              parseInt(day ?? ''));

        switch (rule.comparisonType) {
            case DateComponentComparison.TodayOrInPast:
                if (this.isFutureDate(date)) {
                    return {
                        errorMessage: rule.errorMessage,
                        dayError: true,
                        monthError: true,
                        yearError: true
                    };
                }
                break;
            case DateComponentComparison.InPast:
                if (this.isTodayOrFutureDate(date)) {
                    return {
                        errorMessage: rule.errorMessage,
                        dayError: true,
                        monthError: true,
                        yearError: true
                    };
                }
                break;
            case DateComponentComparison.TodayOrInFuture:
                if (this.isPastDate(date)) { // Check if the date is in the past
                    return {
                        errorMessage: rule.errorMessage,
                        dayError: true,
                        monthError: true,
                        yearError: true
                    };
                }
                break;
            case DateComponentComparison.InFuture:
                if (this.isTodayOrPastDate(date)) {
                    return {
                        errorMessage: rule.errorMessage,
                        dayError: true,
                        monthError: true,
                        yearError: true
                    };
                }
                break;
            case DateComponentComparison.SameOrAfter:
                if (!fixedDate) {
                    throw new Error(`Fixed date is required for comparison type: ${rule.comparisonType}`);
                }
                if (this.isBeforeDate(date, fixedDate)) {
                    return {
                        errorMessage: rule.errorMessage,
                        dayError: true,
                        monthError: true,
                        yearError: true
                    };
                }
                break;
            case DateComponentComparison.After:
                if (!fixedDate) {
                    throw new Error(`Fixed date is required for comparison type: ${rule.comparisonType}`);
                }
                if (this.isSameOrBeforeDate(date, fixedDate)) {
                    return {
                        errorMessage: rule.errorMessage,
                        dayError: true,
                        monthError: true,
                        yearError: true
                    };
                }
                break;
            case DateComponentComparison.SameOrBefore:
                if (!fixedDate) {
                    throw new Error(`Fixed date is required for comparison type: ${rule.comparisonType}`);
                }
                if (this.isAfterDate(date, fixedDate)) {
                    return {
                        errorMessage: rule.errorMessage,
                        dayError: true,
                        monthError: true,
                        yearError: true
                    };
                }
                break;
            case DateComponentComparison.Before:
                if (!fixedDate) {
                    throw new Error(`Fixed date is required for comparison type: ${rule.comparisonType}`);
                }
                if (this.isSameOrAfterDate(date, fixedDate)) {
                    return {
                        errorMessage: rule.errorMessage,
                        dayError: true,
                        monthError: true,
                        yearError: true
                    };
                }
                break;
            case DateComponentComparison.Between:
                if (!beforeDate && !afterDate) {
                    throw new Error(`Before and after date is required for comparison type: ${rule.comparisonType}`);
                }
                if (!afterDate) {
                    throw new Error(`After date is required for comparison type: ${rule.comparisonType}`);
                }
                if (!beforeDate) {
                    throw new Error(`Before date is required for comparison type: ${rule.comparisonType}`);
                }
                if (this.isNotBetweenDates(date, beforeDate, afterDate)) {
                    return {
                        errorMessage: rule.errorMessage,
                        dayError: true,
                        monthError: true,
                        yearError: true
                    };
                }
                break;
            default:
                throw new Error(`Unknown date comparison type: ${rule.comparisonType}`);
        }
    }

    private checkDateComplete(dateParts: DateParts, dateName: string): DateError | undefined {
        
        if (!dateParts) {
            return {
                errorMessage: `Enter your ${dateName}`,
                dayError: true,
                monthError: true,
                yearError: true
            };
        }

        if (!dateParts.day && !dateParts.month && !dateParts.year) {
            return {
                errorMessage: `Enter your ${dateName}`,
                dayError: !dateParts.day,
                monthError: !dateParts.month,
                yearError: !dateParts.year
            };
        }

        const missingParts = (['day', 'month', 'year'] as Array<keyof DateParts>).filter(part => !dateParts[part]);
        if (missingParts.length) {
            return {
                errorMessage: `${dateName} must include a ${missingParts.join(' and ')}`,
                dayError: !dateParts.day,
                monthError: !dateParts.month,
                yearError: !dateParts.year
            };
        }
        
        return undefined;
    }

    private checkDateIsRealDate(dateParts: DateParts, dateName: string): DateError | undefined {
        const { day, month, year } = dateParts;

        const dayNumber = parseInt(day ?? '');
        const monthNumber = parseInt(month ?? '');
        const yearNumber = parseInt(year ?? '');

        if (isNaN(dayNumber) || isNaN(monthNumber) || isNaN(yearNumber)) {
            return {
                errorMessage: `${dateName} must be a real date`,
                dayError: isNaN(dayNumber),
                monthError: isNaN(monthNumber),
                yearError: isNaN(yearNumber)
            };
        }

        if ((year ?? '').length !== 4) {
            return {
                errorMessage: `Year must include 4 numbers`,
                dayError: false,
                monthError: false,
                yearError: true
            };
        }

        let dayError, monthError, yearError;

        // Check if the month is valid
        if (monthNumber < 1 || monthNumber > 12) {
            monthError = true;
        }

        // Check if the day is valid for the given month and year
        const daysInMonth = new Date(yearNumber, monthNumber, 0).getDate();
        if (dayNumber < 1 || dayNumber > daysInMonth) {
            dayError = true;}

        // Check if the year is valid
        if (yearNumber < 1901) {
            yearError = true;
        }

        if (dayError || monthError || yearError) {
            return {
                errorMessage: `${dateName} must be a real date`,
                dayError: dayError ?? false,
                monthError: monthError ?? false,
                yearError: yearError ?? false
            };
        }

        return undefined;
    }

    private isTodayOrFutureDate(date: Date): boolean {
        date.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        return date.getTime() >= today.getTime();
    }

    private isPastDate(date: Date): boolean {
        date.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        return date.getTime() < today.getTime();
    }

    private isTodayOrPastDate(date: Date): boolean {
        date.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        return date.getTime() <= today.getTime();
    }

    private isFutureDate(date: Date): boolean {
        date.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        return date.getTime() > today.getTime();
    }

    private isSameOrBeforeDate(date: Date, comparisonDate: Date): boolean {
        date.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        comparisonDate.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        if (date.getTime() === comparisonDate.getTime()) {
            return true; // They are the same date
        }
        return date.getTime() <= comparisonDate.getTime();
    }

    private isSameOrAfterDate(date: Date, comparisonDate: Date): boolean {
        date.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        comparisonDate.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        if (date.getTime() === comparisonDate.getTime()) {
            return true; // They are the same date
        }
        return date.getTime() >= comparisonDate.getTime();
    }

    private isBeforeDate(date: Date, comparisonDate: Date): boolean {
        date.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        comparisonDate.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        return date.getTime() < comparisonDate.getTime();
    }

    private isAfterDate(date: Date, comparisonDate: Date): boolean {
        date.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        comparisonDate.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        return date.getTime() > comparisonDate.getTime();
    }

    private isNotBetweenDates(date: Date, startDate: Date, endDate: Date): boolean {
        date.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        startDate.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        endDate.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
        return date.getTime() < startDate.getTime() || date.getTime() > endDate.getTime();
    }
}