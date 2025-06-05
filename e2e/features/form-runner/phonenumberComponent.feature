Feature: Phone Number Component

  Background:
    Given I start the "test-phonenumber-component" form

  Scenario: Fill out phone number component correctly
    When I enter "07729 900 982" in the "phonenumber" component
    When I click the submit button
    Then I should see the summary page which contains "07729 900 982" for question "Test Phone Number component" with name "phonenumber"

  Scenario: Fill out phone number component with invalid input
    When I enter "abcdefghij" in the "phonenumber" component
    When I click the submit button
    Then I should see the error message "Enter a phone number, like 02010 960 001, 07729 900 982 or +44 808 157 0192" for "phonenumber"