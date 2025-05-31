Feature: Number Component

  Background:
    Given I start the "test-number-component" form

  Scenario: Fill out number component correctly
    When I enter "12345" in the "number" component
    When I click the submit button
    Then I should see the summary page which contains "12345" for question "Test Number component" with name "number"

  Scenario: Fill out number component with empty input
    When I enter "" in the "number" component
    When I click the submit button
    Then I should see the summary page which contains "Not provided" for question "Test Number component" with name "number"

  Scenario Outline: Fill out number component with invalid input
    When I enter "<invalidNumber>" in the "number" component
    When I click the submit button
    Then I should see the error message "Enter a valid number" for "number"

    Examples:
      | invalidNumber |
      | abc           |
      | 12.34.56      |
      | -123abc       |
      | NaN           |
