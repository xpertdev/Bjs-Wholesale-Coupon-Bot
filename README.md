# Bjs-Wholesale-Coupon-Bot

#### Instructions

- Open https://www.bjs.com/myCoupons in Google Chrome / Microsoft Edge
- Signin to your account
- Run JavaScript in the console. Guide: https://developers.google.com/web/tools/chrome-devtools/console/javascript


```
var interval = setInterval(function(){
    var buttons = $("button.red-btn:contains('CLIP')")
    var btn = $(buttons.splice(0, 1));
    console.log("Clicking: " + buttons.length + " ", btn);
    btn.trigger( "click" );
    if (buttons.length === 0) {
    console.log("Done");
        clearInterval(interval);
    }
}, 500);
    
```    
