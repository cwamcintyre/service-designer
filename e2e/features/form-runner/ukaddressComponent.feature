Feature: UK Address Component

  Background:
    Given I start the "test-ukaddress-component" form

  Scenario: Fill out UK address component correctly
    When I enter "Test address line 1" in the "ukaddress-addressLine1" component
    When I enter "Test address line 2" in the "ukaddress-addressLine2" component
    When I enter "Test town" in the "ukaddress-addressTown" component
    When I enter "Test county" in the "ukaddress-addressCounty" component
    When I enter "SW1A 1AA" in the "ukaddress-addressPostcode" component
    When I click the submit button
    Then I should see the summary page which contains "<p>Test address line 1</p><p>Test address line 2</p><p>Test town</p><p>Test county</p><p>SW1A 1AA</p>" for question "Test UK Address component" with name "ukaddress"

 Scenario: Fill out text component correctly with essential data
    When I enter "Test address line 1" in the "ukaddress-addressLine1" component
    When I enter "Test town" in the "ukaddress-addressTown" component
    When I enter "SW1A 1AA" in the "ukaddress-addressPostcode" component
    When I click the submit button
    Then I should see the summary page which contains "<p>Test address line 1</p><p>Test town</p><p>SW1A 1AA</p>" for question "Test UK Address component" with name "ukaddress"

  Scenario: Fill out text component with invalid input
    When I click the submit button
    Then I should see the error message "Enter address line 1, typically the building and street" for "ukaddress-address-line-1" at index "0"
    And I should see the error message "Enter town or city" for "ukaddress-address-town" at index "0"
    And I should see the error message "Enter postcode" for "ukaddress-address-postcode" at index "0"

  Scenario: Fill out UK address component with invalid postcodes
    When I enter "INVALIDCODE" in the "ukaddress-addressPostcode" component
    When I click the submit button
    Then I should see the error message "Enter a full UK postcode" for "ukaddress-address-postcode" at index "0"