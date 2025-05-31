Feature: Multiline Text Component

  Background:
    Given I start the "test-multilineText-component" form

  Scenario: Fill out multiline text component correctly
    When I enter "This is a test text" in the "multilineText" component
    When I click the submit button
    Then I should see the summary page which contains "This is a test text" for question "Test Multiline Text component" with name "multilineText"

  Scenario: Fill out multiline text component with invalid input
    When I enter "" in the "multilineText" component
    When I click the submit button
    Then I should see the error message "Please enter valid text" for "multilineText"
