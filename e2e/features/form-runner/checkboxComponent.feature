Feature: Checkbox Component

  Background:
    Given I start the "test-checkbox-component" form

  Scenario: Fill out checkbox component correctly
    When I check "option1" in the "checkbox" checkbox
    When I click the submit button
    Then I should see the summary page which contains "Option 1" for question "Test Checkbox component" with name "checkbox"

  Scenario: Fill out checkbox component with invalid input
    When I click the submit button
    Then I should see the error message "Please select at least one option" for "checkbox"
