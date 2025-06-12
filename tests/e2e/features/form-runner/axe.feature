Feature: aXe accessibility checks

  Scenario: Check accessibility of all components on one page and the summary screen.
    Given I start the "test-optional-all-components-doubled" form
    Then I should see the form with title "All components doubled"
    And the page should pass accessibility checks
    When I click the submit button
    Then the page should pass accessibility checks
    And I should see "Not provided" in the summary "22" times

  Scenario: Check accessibility of all components on one page with hints and errors
    Given I start the "test-all-components-doubled" form
    Then I should see the form with title "All components doubled"
    When I click the submit button
    Then the page should pass accessibility checks