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
	const buttons = document.getElementsByName('clipToCard');

			
	buttons.forEach(btn => {
		console.log("Clicking: " + buttons.length + " ", btn);
		btn.click();
		btn.scrollIntoView({behavior:"smooth"});
		buttons[btn].remove();
		sleep(3000);
	});

    if (buttons.length === 0) {
        console.log("Done");
        clearInterval(interval);
    }
		
}, 3000);
    
```    

You may need to run this more than once (press the up arrow in the console, and Enter again.)
