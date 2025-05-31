Feature: Radio Component

  Background:
    Given I start the "test-radio-component" form

  Scenario: Fill out radio component correctly
    When I select "option1" in the "radio" radio group
    When I click the submit button
    Then I should see the summary page which contains "Option 1" for question "Test Radio component" with name "radio"

  Scenario: Fill out radio component with invalid input
    When I click the submit button
    Then I should see the error message "Please select a valid option" for "radio"
