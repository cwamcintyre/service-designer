Feature: Multiline Text Component

  Scenario: Fill out multiline text component correctly
    Given I start the "test-multilineText-component" form
    When I enter "This is a test text" in the "multilineText" component
    When I click the submit button
    Then I should see the summary page which contains "This is a test text" for question "Test Multiline Text component" with name "multilineText"

  Scenario: Fill out multiline text component with invalid input
    Given I start the "test-multilineText-component" form
    When I enter "" in the "multilineText" component
    When I click the submit button
    Then I should see the error message "An answer is required" for "multilineText"

  Scenario: Fill out optional multiline text component with empty input
    Given I start the "test-optional-multilineText-component" form
    When I click the submit button
    Then I should see the summary page which contains "Not provided" for question "Test Multiline Text component" with name "multilineText"

