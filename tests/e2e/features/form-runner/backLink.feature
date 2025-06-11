Feature: Back link

Background: 
    Given I start the "test-branching-form" form

Scenario: Fill out form using branch A, see summary and go back to the first page using the back link
    When I enter "John" in the "what_is_your_name" component
    And I click the submit button
    When I select "yes" in the "do_you_want_branch_a" radio group
    And I click the submit button
    When I enter "It's great" in the "what_do_you_think_of_branch_a" component
    And I click the submit button
    Then I should see the summary page which contains "It's great" for question "What do you think of branch A?" with name "what_do_you_think_of_branch_a"
    And I should see the summary page which contains "Not provided" for question "What do you think of branch B?" with name "what_do_you_think_of_branch_b"
    And I should see the summary page which contains "John" for question "What is your name?" with name "what_is_your_name"
    When I click on the back link
    Then I should see the "what_do_you_think_of_branch_a" component
    When I click on the back link
    Then I should see the yes option of the "do_you_want_branch_a" component
    When I click on the back link
    Then I should see the "what_is_your_name" component
    And There should not be a back link

Scenario: Fill out form using branch B, see summary and go back to the first page using the back link
    When I enter "Jane" in the "what_is_your_name" component
    And I click the submit button
    When I select "no" in the "do_you_want_branch_a" radio group
    And I click the submit button
    When I enter "It's ok" in the "what_do_you_think_of_branch_b" component
    And I click the submit button
    When I enter "maybe" in the "does_it_still_work" component
    And I click the submit button
    Then I should see the summary page which contains "It's ok" for question "What do you think of branch B?" with name "what_do_you_think_of_branch_b"
    And I should see the summary page which contains "Jane" for question "What is your name?" with name "what_is_your_name"
    And I should see the summary page which contains "maybe" for question "Does the previous page link still work if I'm on branch B?" with name "does_it_still_work"
    When I click on the back link
    Then I should see the "does_it_still_work" component
    When I click on the back link
    Then I should see the "what_do_you_think_of_branch_b" component
    When I click on the back link
    Then I should see the yes option of the "do_you_want_branch_a" component
    When I click on the back link
    Then I should see the "what_is_your_name" component
    And There should not be a back link

Scenario: Fill out form using branch B, see summary and go back to the first page using the back button
    When I enter "Jane" in the "what_is_your_name" component
    And I click the submit button
    When I select "no" in the "do_you_want_branch_a" radio group
    And I click the submit button
    When I enter "It's ok" in the "what_do_you_think_of_branch_b" component
    And I click the submit button
    When I enter "maybe" in the "does_it_still_work" component
    And I click the submit button
    Then I should see the summary page which contains "It's ok" for question "What do you think of branch B?" with name "what_do_you_think_of_branch_b"
    And I should see the summary page which contains "Jane" for question "What is your name?" with name "what_is_your_name"
    And I should see the summary page which contains "maybe" for question "Does the previous page link still work if I'm on branch B?" with name "does_it_still_work"
    When I click on the back button
    Then I should see the "does_it_still_work" component
    When I click on the back button
    Then I should see the "what_do_you_think_of_branch_b" component
    When I click on the back button
    Then I should see the yes option of the "do_you_want_branch_a" component
    When I click on the back button
    Then I should see the "what_is_your_name" component
    And There should not be a back link

Scenario: Verify Post-Redirect-Get pattern is working on the form
    When I enter "" in the "what_is_your_name" component
    And I click the submit button
    Then I should see the "what_is_your_name" component
    And I should see the error message "Enter your name" for "what_is_your_name"
    When I enter "John" in the "what_is_your_name" component
    And I click the submit button
    When I select "yes" in the "do_you_want_branch_a" radio group
    And I start tracking requests
    And I click on the back button
    And I click on the back button
    And I should see the "what_is_your_name" component
    Then I should not see POST in the requests
    And There should not be a back link