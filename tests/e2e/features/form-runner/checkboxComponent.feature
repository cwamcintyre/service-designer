Feature: Checkbox Component

  Scenario: Fill out checkbox component correctly
    Given I start the "test-checkbox-component" form
    When I check "option1" in the "checkbox" checkbox
    When I click the submit button
    Then I should see the summary page which contains "Option 1" for question "Test Checkbox component" with name "checkbox"

  Scenario: Fill out checkbox component with invalid input
    Given I start the "test-checkbox-component" form
    When I click the submit button
    Then I should see the error message "An answer is required" for "checkbox"

  Scenario: Fill out optional checkbox component with empty input
    Given I start the "test-optional-checkbox-component" form
    When I click the submit button
    Then I should see the summary page which contains "Not provided" for question "Test Checkbox component" with name "checkbox"
