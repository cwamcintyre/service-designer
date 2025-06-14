## Cookies used to store application ID and form title result in "weird" behaviour with multiple tabs open

Because cookies are per browser, not per tab, it means two tabs open end up on the same form. Even with wonky URL's (say the first form open will become the second form summary or crash because the page ID doesn't exist in it).

There is no solution I or AI can come up with that would make cookies per tab without javascript on the client side, and at that point there are better options. This is fundamental though
so if a solution is necessary it should work without javascript.

Possible solution is to use Redis and have server side sessions - probably wants user testing to identify whether it is required.