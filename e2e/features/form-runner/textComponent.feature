Feature: Text Component

  Background:
    Given I start the "test-text-component" form

  Scenario: Fill out text component correctly
    When I enter "Test text" in the "text" component
    When I click the submit button
    Then I should see the summary page which contains "Test text" for question "Test Text component" with name "text"

 Scenario: Fill out text component correctly with empty data
    When I enter "" in the "text" component
    When I click the submit button
    Then I should see the summary page which contains "Not provided" for question "Test Text component" with name "text"

  Scenario: Fill out text component with invalid input
    When I enter "ERROR" in the "text" component
    When I click the submit button
    Then I should see the error message "ERROR MESSAGE" for "text"

