export type ValidationRule = {
    id: string;
    expression: string;
    errorMessage: string;
};

export type Option = {
    id: string;
    label: string;
    value: string;
};

export type Component = {
    questionId: string;
    type?: string;
    label?: string;
    name?: string;
    hint?: string;
    labelIsPageTitle: boolean;
    validationRules?: ValidationRule[];
    content?: string; // For components like "html"
    options?: Option[];
    answer?: any;
    errors?: string[] | undefined;
    optional?: boolean;
    optionalErrorMessage?: string;
};

export interface DateComponent extends Component {
    dateName?: string; // For components like "dateParts"
    dateValidationRules?: DateValidationRule[];
}

export type DateValidationRule = {
    id: string;
    errorMessage: string;
    comparisonType?: DateComponentComparison;
    fixedDate?: Date;
    fixedDateId?: string;
    startDate?: Date;
    endDate?: Date;
    startDateId?: string;
    endDateId?: string;
}

export enum DateComponentComparison {
    TodayOrInPast = "todayOrInPast",
    InPast = "inPast",
    TodayOrInFuture = "todayOrInFuture",
    InFuture = "inFuture",
    SameOrAfter = "sameOrAfter",
    After = "after",
    SameOrBefore = "sameOrBefore",
    Before = "before",
    Between = "between"
}

export type DateError = {
    errorMessage: string;
    dayError: boolean;
    monthError: boolean;
    yearError: boolean;
}

export type Condition = {
    id: string;
    label: string;
    expression: string;
    nextPageId?: string;
};

export type Page = {
    id: string;
    pageId: string;
    pageType?: string;
    title?: string;
    components: Component[];
    nextPageId?: string;
    conditions?: Condition[];
};

export type Submission = {
    method: string;
    endpoint: string;
};

export type Form = {
    formId: string;
    title: string;
    description: string;
    startPage: string;
    pages: Page[];
    submission: Submission;
    isCreated: boolean;
};

export type UKAddress = {
    addressLine1?: string;
    addressLine2?: string;
    town?: string;
    county?: string;
    postcode?: string;
}

export type DateParts = {
    day?: string;
    month?: string;
    year?: string;
}

export interface Application extends Form {
    id: string;
    applicantId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    submittedAt?: Date;
}