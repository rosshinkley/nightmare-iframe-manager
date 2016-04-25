nightmare-iframe-manager
========================

Add inline iframe management to your [Nightmare](http://github.com/segmentio/nightmare) scripts.

## Credit
Original idea was thanks to @tiangolo in segmentio/nightmare#496.

# _WARNING_
This plugin overrides Nightmare's internal `evaluate_now` method to wrap the page's `document` variable.  This is dangerous and fragile.  After entering an iframe, certain functionality may not work as expected.  Read the pull in the credit link for more information.  _You have been warned._

## Usage
Require the library: 

```js
require('nightmare-iframe-manager')
```

... and that's it.  You should now be able to enter and exit iframes.

### .enterIFrame(selector)
Enter an iframe with the given selector.  All subsequent requests will go through that iframe until `.exitIFrame()` or `.resetFrame()` is called.

### .exitIFrame()
Exits the current selector to the previous one.  If exiting the last selector, this exits to the root document.

### .resetFrame()
Resets all frames and restores the root document.

## Example

```javascript
require('nightmare-iframe-manager');
var nightmare = Nightmare();
nightmare.goto('http://example.com')
  .enterIFrame('#someIFrame')
  .title()
  .then(function(title){
    // `title` is the title of the child frame #someIFrame
  })
```
