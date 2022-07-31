# Bjs-Wholesale-Coupon-Bot

#### Instructions

- Open https://www.bjs.com/myCoupons in Google Chrome / Microsoft Edge
- Signin to your account
- Run JavaScript in the console. Guide: https://developers.google.com/web/tools/chrome-devtools/console/javascript


```
function sleep(t) {  
  const start = Date.now();
  while (Date.now() - start < t);
}

var interval = setInterval(function(){
    var buttons = $("button.next-prev:contains('CLIP')");
    var nextLink = $("button.next-prev:contains('Next')");
    var btn = $(buttons.splice(0, 1));
    console.log("Clicking: " + buttons.length + " ", btn);
    btn.trigger( "click" );
    if (buttons.length === 0 && nextLink.length === 0 ) {
        console.log("Done");
        clearInterval(interval);
    } else if (buttons.length === 0) {
        nextLink.trigger( "click" );
        sleep(3000);
    }
}, 3000);
    
```    
