fxosRate
========

fxosRate is a Library to help the promotion of your Firefox Marketplace apps by encouraging application users to rate the application. The library decides when it's the best moment to ask users to rate the app based on a set of parameters.

It's inspired in the iRate library for iPhone/Apple Store. 

Using fxosRate
==============

Including the library
--------------

You just need to copy the file fxosrate.js to the scripts folder of your application and include it in your HTML, e.g.

	<script src="scripts/fxosrate.js"></script>
	
Initializing the library
------------------------

The 
You need to invoke the init method with a set of parameters that will determine the prompt policy to the user. E.g.

	rate = Object.create(fxosRate);
	rate.init("memes", "1.0", 0, 0, 0, 0, 0);
	
This method should be invoked every time your app is launched (e.g. on your own init method)

Prompting the user
-------------------------

The method 'promptRequired()' should be invoked in order to check if a prompt is required an prompt the user. This can be done right after the initilization of the library or at any time in case you don't want to disturb the user right after app launch.




