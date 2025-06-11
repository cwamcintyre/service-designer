import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import { GDSSummaryList, GDSSummaryRow, GDSSummaryQuestion, GDSSummaryAnswer, GDSSummaryActions } from '../src/GDSSummary';

describe('GDSSummary Component', () => {
    it('renders the summary list with children', () => {
        render(
            <GDSSummaryList>
                <GDSSummaryRow>
                    <GDSSummaryQuestion text="Question 1" />
                    <GDSSummaryAnswer>Answer 1</GDSSummaryAnswer>
                    <GDSSummaryActions>
                        <a href="#">Change</a>
                    </GDSSummaryActions>
                </GDSSummaryRow>
            </GDSSummaryList>
        );
        const question = screen.getByText(/question 1/i);
        const answer = screen.getByText(/answer 1/i);
        const action = screen.getByText(/change/i);
        expect(question).toBeInTheDocument();
        expect(answer).toBeInTheDocument();
        expect(action).toBeInTheDocument();
    });

    it('renders the summary row with the correct name attribute', () => {
        render(
            <GDSSummaryRow name="row1">
                <GDSSummaryQuestion text="Question 1" />
                <GDSSummaryAnswer>Answer 1</GDSSummaryAnswer>
            </GDSSummaryRow>
        );
        const row = screen.getByText(/question 1/i).closest('.govuk-summary-list__row');
        expect(row).toHaveAttribute('data-name', 'row1');
    });

    it('renders the summary question with the correct text', () => {
        render(<GDSSummaryQuestion text="Question 1" />);
        const question = screen.getByText(/question 1/i);
        expect(question).toBeInTheDocument();
    });

    it('renders the summary answer with children', () => {
        render(<GDSSummaryAnswer>Answer 1</GDSSummaryAnswer>);
        const answer = screen.getByText(/answer 1/i);
        expect(answer).toBeInTheDocument();
    });

    it('renders the summary actions with children', () => {
        render(
            <GDSSummaryActions>
                <a href="#">Change</a>
            </GDSSummaryActions>
        );
        const action = screen.getByText(/change/i);
        expect(action).toBeInTheDocument();
    });

    it('passes accessibility checks', async () => {
        const { container } = render(
            <GDSSummaryList>
                <GDSSummaryRow>
                    <GDSSummaryQuestion text="Question 1" />
                    <GDSSummaryAnswer>Answer 1</GDSSummaryAnswer>
                    <GDSSummaryActions>
                        <a href="#">Change</a>
                    </GDSSummaryActions>
                </GDSSummaryRow>
            </GDSSummaryList>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
