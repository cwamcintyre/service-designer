Feature: Text Component

  Scenario: Fill out text component correctly
    Given I start the "test-text-component" form
    When I enter "Test text" in the "text" component
    When I click the submit button
    Then I should see the summary page which contains "Test text" for question "Test Text component" with name "text"

 Scenario: Fill out text component correctly with empty data
    Given I start the "test-text-component" form
    When I enter "" in the "text" component
    When I click the submit button
    Then I should see the error message "An answer is required" for "text"

  Scenario: Fill out text component with invalid input
    Given I start the "test-text-component" form
    When I enter "ERROR" in the "text" component
    When I click the submit button
    Then I should see the error message "ERROR MESSAGE" for "text"

  Scenario: Fill out optional text component with empty input
    Given I start the "test-optional-text-component" form
    When I click the submit button
    Then I should see the summary page which contains "Not provided" for question "Test Text component" with name "text"
