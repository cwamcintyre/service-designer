Feature: Radio Component

  Scenario: Fill out radio component correctly
    Given I start the "test-radio-component" form
    When I select "option1" in the "radio" radio group
    When I click the submit button
    Then I should see the summary page which contains "Option 1" for question "Test Radio component" with name "radio"

  Scenario: Fill out radio component with invalid input
    Given I start the "test-radio-component" form
    When I click the submit button
    Then I should see the error message "An answer is required" for "radio"

  Scenario: Fill out optional radio component with empty input
    Given I start the "test-optional-radio-component" form
    When I click the submit button
    Then I should see the summary page which contains "Not provided" for question "Test Radio component" with name "radio"

