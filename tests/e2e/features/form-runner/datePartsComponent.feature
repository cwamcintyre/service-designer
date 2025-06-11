Feature: Date Parts Component

    Scenario: Date Parts Component with valid date
        Given I start the "testing-dates-in-forms" form
        When I enter "1" for day, "1" for month, and "2020" for year in the "what_is_the_first_date" date parts component
        And I click the submit button
        When I enter "2" for day, "1" for month, and "2020" for year in the "what_is_the_second_date" date parts component
        And I click the submit button
        Then I should see the summary page which contains "01/01/2020" for question "What is the first date?" with name "what_is_the_first_date"
        And I should see the summary page which contains "02/01/2020" for question "What is the second date?" with name "what_is_the_second_date"

    Scenario: Date Parts Component with invalid date
        Given I start the "testing-dates-in-forms" form
        When I enter "31" for day, "" for month, and "2020" for year in the "what_is_the_first_date" date parts component
        And I click the submit button
        Then I should see the error message "date must include a month" for "what_is_the_first_date"        

    Scenario: required Date Parts Component with no date
        Given I start the "testing-dates-in-forms" form
        And I click the submit button
        Then I should see the error message "Enter your date" for "what_is_the_first_date"                