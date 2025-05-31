Feature: Yes/No Component

  Background:
    Given I start the "test-yesno-component" form

  Scenario: Fill out yes/no component correctly
    When I select "yes" in the "yesno" radio group
    When I click the submit button
    Then I should see the summary page which contains "Yes" for question "Test Yes/No component" with name "yesno"

  Scenario: Fill out yes/no component with no input
    When I click the submit button
    Then I should see the error message "Please select Yes or No" for "yesno"
