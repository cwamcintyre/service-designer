Feature: Number Component

  Scenario: Fill out number component correctly
    Given I start the "test-number-component" form
    When I enter "12345" in the "number" component
    When I click the submit button
    Then I should see the summary page which contains "12345" for question "Test Number component" with name "number"

  Scenario: Fill out number component with empty input
    Given I start the "test-number-component" form
    When I enter "" in the "number" component
    When I click the submit button
    Then I should see the error message "Enter a number" for "number"

  Scenario: Fill out number component with invalid input
    Given I start the "test-number-component" form
    When I enter "abc" in the "number" component
    When I click the submit button
    Then I should see the error message "Enter a number" for "number"

  Scenario: Fill out optional number component correctly
    Given I start the "test-optional-number-component" form
    When I click the submit button
    Then I should see the summary page which contains "Not provided" for question "Test Number component" with name "number"
