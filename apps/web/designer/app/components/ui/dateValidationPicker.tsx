import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { type DateValidationRule } from "@model/formTypes";
import { DateComponentComparison } from "@model/formTypes";
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";

interface DateValidationPickerProps {
    id: string;
    form: UseFormReturn<any>;
    index: number;
}

export default function DateValidationPicker({ id, form, index }: DateValidationPickerProps) {
  
  // Use the form field path prefix for all form fields
  const fieldPath = `dateValidationRules.${index}` as const;
  
  // Get the current validation rule
  const validationRule = form.getValues(fieldPath) as DateValidationRule;
  
  // Track date selection type (fixed date vs field reference)
  const [dateSelectionType, setDateSelectionType] = React.useState<'fixed' | 'field'>(
    validationRule?.fixedDate ? 'fixed' : validationRule?.fixedDateId ? 'field' : 'fixed'
  );
  
  // For Between comparison, track start date selection type
  const [startDateSelectionType, setStartDateSelectionType] = React.useState<'fixed' | 'field'>(
    validationRule?.startDate ? 'fixed' : validationRule?.startDateId ? 'field' : 'fixed'
  );
  
  // For Between comparison, track end date selection type
  const [endDateSelectionType, setEndDateSelectionType] = React.useState<'fixed' | 'field'>(
    validationRule?.endDate ? 'fixed' : validationRule?.endDateId ? 'field' : 'fixed'
  );

  // Generate an ID for the rule if it doesn't have one
  React.useEffect(() => {
    if (!validationRule?.id) {
      form.setValue(`${fieldPath}.id`, uuidv4());
    }
  }, [form, fieldPath, validationRule]);

  // Handle validation type change
  const handleValidationTypeChange = React.useCallback((value: string) => {
    // Set the comparison type
    form.setValue(`${fieldPath}.comparisonType`, value as DateComponentComparison);
    
    // Reset date values when changing type
    form.setValue(`${fieldPath}.fixedDate`, undefined);
    form.setValue(`${fieldPath}.fixedDateId`, undefined);
    form.setValue(`${fieldPath}.startDate`, undefined);
    form.setValue(`${fieldPath}.startDateId`, undefined);
    form.setValue(`${fieldPath}.endDate`, undefined);
    form.setValue(`${fieldPath}.endDateId`, undefined);
    
    // Trigger form validation
    form.trigger(fieldPath);
  }, [form, fieldPath]);

  // Handle date selection type change
  const handleDateSelectionTypeChange = React.useCallback((value: 'fixed' | 'field') => {
    setDateSelectionType(value);
    
    // Reset the values based on selection type
    if (value === 'fixed') {
      form.setValue(`${fieldPath}.fixedDateId`, undefined);
    } else {
      form.setValue(`${fieldPath}.fixedDate`, undefined);
    }
  }, [form, fieldPath]);

  // Handle start date selection type change
  const handleStartDateSelectionTypeChange = React.useCallback((value: 'fixed' | 'field') => {
    setStartDateSelectionType(value);
    
    // Reset the values based on selection type
    if (value === 'fixed') {
      form.setValue(`${fieldPath}.startDateId`, undefined);
    } else {
      form.setValue(`${fieldPath}.startDate`, undefined);
    }
  }, [form, fieldPath]);

  // Handle end date selection type change
  const handleEndDateSelectionTypeChange = React.useCallback((value: 'fixed' | 'field') => {
    setEndDateSelectionType(value);
    
    // Reset the values based on selection type
    if (value === 'fixed') {
      form.setValue(`${fieldPath}.endDateId`, undefined);
    } else {
      form.setValue(`${fieldPath}.endDate`, undefined);
    }
  }, [form, fieldPath]);

  return (
    <div className="space-y-4 mb-4" key={`date-validation-container-${id}`}>
      {/* Validation Type Selection */}
      <FormField
        control={form.control}
        name={`${fieldPath}.comparisonType`}
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-4">
              <FormLabel className="min-w-32">Validation Type:</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleValidationTypeChange(value);
                }} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select validation type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={DateComponentComparison.TodayOrInPast}>Today or in the past</SelectItem>
                  <SelectItem value={DateComponentComparison.InPast}>In the past</SelectItem>
                  <SelectItem value={DateComponentComparison.TodayOrInFuture}>Today or in the future</SelectItem>
                  <SelectItem value={DateComponentComparison.InFuture}>In the future</SelectItem>
                  <SelectItem value={DateComponentComparison.SameOrAfter}>Same as or after</SelectItem>
                  <SelectItem value={DateComponentComparison.After}>After</SelectItem>
                  <SelectItem value={DateComponentComparison.SameOrBefore}>Same as or before</SelectItem>
                  <SelectItem value={DateComponentComparison.Before}>Before</SelectItem>
                  <SelectItem value={DateComponentComparison.Between}>Between</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date Selection for comparison types that need a reference date */}
      {validationRule?.comparisonType && [
        DateComponentComparison.SameOrAfter,
        DateComponentComparison.After,
        DateComponentComparison.SameOrBefore,
        DateComponentComparison.Before
      ].includes(validationRule.comparisonType) && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <FormLabel className="min-w-32">Compare with:</FormLabel>
            <Select 
              onValueChange={handleDateSelectionTypeChange} 
              value={dateSelectionType}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Specific date</SelectItem>
                <SelectItem value="field">Another date field</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateSelectionType === 'fixed' ? (
            <FormField
              control={form.control}
              name={`${fieldPath}.fixedDate`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="min-w-32">Date:</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-48 justify-start text-left font-normal">
                            {field.value ? new Date(field.value).toLocaleDateString() : "Select date"}
                            <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name={`${fieldPath}.fixedDateId`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="min-w-32">Field name:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter date field name"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      )}

      {/* Between Date Range Selection */}
      {validationRule?.comparisonType === DateComponentComparison.Between && (
        <div className="space-y-4">
          {/* Start Date */}
          <div className="flex items-center gap-4">
            <FormLabel className="min-w-32">Start date type:</FormLabel>
            <Select 
              onValueChange={handleStartDateSelectionTypeChange} 
              value={startDateSelectionType}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Specific date</SelectItem>
                <SelectItem value="field">Date field</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {startDateSelectionType === 'fixed' ? (
            <FormField
              control={form.control}
              name={`${fieldPath}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="min-w-32">Start date:</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-48 justify-start text-left font-normal">
                            {field.value ? new Date(field.value).toLocaleDateString() : "Select start date"}
                            <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name={`${fieldPath}.startDateId`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="min-w-32">Start field name:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter start date field name"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* End Date */}
          <div className="flex items-center gap-4">
            <FormLabel className="min-w-32">End date type:</FormLabel>
            <Select 
              onValueChange={handleEndDateSelectionTypeChange} 
              value={endDateSelectionType}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Specific date</SelectItem>
                <SelectItem value="field">Date field</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {endDateSelectionType === 'fixed' ? (
            <FormField
              control={form.control}
              name={`${fieldPath}.endDate`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="min-w-32">End date:</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-48 justify-start text-left font-normal">
                            {field.value ? new Date(field.value).toLocaleDateString() : "Select end date"}
                            <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name={`${fieldPath}.endDateId`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="min-w-32">End field name:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter end date field name"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      )}      
      {/* Error Message */}
      <FormField
        control={form.control}
        name={`${fieldPath}.errorMessage`}
        render={({ field }) => {
          // Use a stable key based on the component's stable ID
          const stableKey = `errormessage-${id}`;
          
          return (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormLabel className="min-w-32">Error Message:</FormLabel>
                <FormControl>
                  <Input
                    key={stableKey}
                    placeholder="Enter error message"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};
