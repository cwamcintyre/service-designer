Feature: Select Component

  Background:
    Given I start the "test-select-component" form

  Scenario: Fill out select component correctly
    When I select "Option 1" in the "select" component
    When I click the submit button
    Then I should see the summary page which contains "Option 1" for question "Test Select component" with name "select"

  Scenario: Fill out select component with invalid input
    When I click the submit button
    Then I should see the error message "Select a valid option" for "select"
