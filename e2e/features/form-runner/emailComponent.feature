Feature: Email Component

  Scenario: Fill out email component correctly
    Given I start the "test-email-component" form
    When I enter "test@example.com" in the "email" component
    When I click the submit button
    Then I should see the summary page which contains "test@example.com" for question "Test Email component" with name "email"

  Scenario: Fill out email component with invalid input
    Given I start the "test-email-component" form
    When I enter "test@.com" in the "email" component
    When I click the submit button
    Then I should see the error message "Enter an email address in the correct format, like name@example.com" for "email"

  Scenario: Fill out optional email component with empty input
    Given I start the "test-optional-email-component" form
    When I click the submit button
    Then I should see the summary page which contains "Not provided" for question "Test Email component" with name "email"
