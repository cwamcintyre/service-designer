Feature: Yes/No Component

  Scenario: Fill out yes/no component correctly
    Given I start the "test-yesno-component" form
    When I select "yes" in the "yesno" radio group
    When I click the submit button
    Then I should see the summary page which contains "Yes" for question "Test Yes/No component" with name "yesno"

  Scenario: Fill out yes/no component with no input
    Given I start the "test-yesno-component" form
    When I click the submit button
    Then I should see the error message "An answer is required" for "yesno"

  Scenario: Fill out optional yes/no component with empty input
    Given I start the "test-optional-yesno-component" form
    When I click the submit button
    Then I should see the summary page which contains "Not provided" for question "Test Yes/No component" with name "yesno"
