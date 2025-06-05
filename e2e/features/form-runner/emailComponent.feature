Feature: Email Component

  Background:
    Given I start the "test-email-component" form

  Scenario: Fill out email component correctly
    When I enter "test@example.com" in the "email" component
    When I click the submit button
    Then I should see the summary page which contains "test@example.com" for question "Test Email component" with name "email"

  Scenario: Fill out email component with invalid input
    When I enter "test@.com" in the "email" component
    When I click the submit button
    Then I should see the error message "Enter an email address in the correct format, like name@example.com" for "email"