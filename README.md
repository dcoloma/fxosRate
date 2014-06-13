fxosRate
========

fxosRate is a Library to help the promotion of your Firefox Marketplace apps by encouraging application users to rate the application. The library decides when it's the best moment to ask users to rate the app based on a set of parameters.

It's inspired in the iRate library for iPhone/Apple Store. 

This is an ALPHA version, so expect bugs, glithes and many other things. If you detect a bug, please file an issue in github or even better, submit a patch!

Using fxosRate
==============

Including the library
--------------

1 - You need to copy the file fxosrate.js to the scripts folder of your application and include it in your HTML, e.g.

	<script src="scripts/fxosrate.js"></script>
	
2 - Library supports localization based on the L10n library offered by FirefoxOS. You can customize the texts used to prompt the user in different languages (currently Spanish, English and Portuguese - but you can extend the list).

A/ If you are already using L10n library. You just need to add the fxosRate l10n properties files to your locales.ini.

B/ If you are not using it yet you need to copy the l10n.js library to your project as well as the content of the locales folder.

Then you just need to include them in your html, e.g.:

	<script src="scripts/l10n.js" charset="utf-8"></script>
	<link rel="resource" type="application/l10n" href="locales/locales.ini" />

	
	
Initializing the library
------------------------
 
You need to invoke the init method with a set of parameters that will determine the prompt policy to the user. E.g.

	rate = Object.create(fxosRate);
	rate.init("memes", "1.0", 0, 0, 0, 0, 0, 0);
	
This method should be invoked every time your app is launched (e.g. on your own init method)

Prompting the user
-------------------------

The method 'promptRequired()' should be invoked in order to check if a prompt is required an prompt the user. This can be done right after the initilization of the library or at any time in case you don't want to disturb the user right after app launch. E.g.

	rate.promptRequired();

Counting events
-------------------------

The app developer could chose to use an event different than starting the app in order to assess how extensively the app is being used (e.g. useful for apps such as daemons)

In this case, the app needs to notify the library via the method logEvent(numEvents) that will increase the event count in numEvents.

	rate.logEvent(1); // Add 1 event
	rate.promptRequired() // Check if needs to be prompted
	
	
Library Configuration
========================

The init method accepts 8 parameters that allow configuring accordingly the library:

* applicationName: Name of your application in the marketplace, it's important it's the same as in the marketplace so that user can be redirected to the correct "rate me" page.
* version: It will be used to check if user has the latest version of the application (not implemented yet).
* daysUntilPrompt: Number of days that will need to pass since first time the app was used before prompting the user. 7 would mean do not prompt the user during the first week. 0 means ignore this criteria.
* usesUntilPrompt: Number of times the app must be launched before prompting the user. 10 would mean do not prompt the user during the first 10 launches. 0 means ignore this criteria.
* eventsUntilPrompt: Number of events that the app must trigger before launching a first prompt to the user. This is helpful, for instance in case the activity of the app is more related to a given event than to launching the application itself. It is linked to the logEvent method described above. 0 means ignore this criteria.
* usesPerWeekForPromompt: Number of times the app must have been launched during a week before launching the prompt to the user. 0 means ignore this criteria.
* eventsPerWeekForPrompt: Number of events that the app must trigger during a week before launching the prompt to the user. This is helpful, for instance in case the activity of the app is more related to a given event than to launching the application itself. It is linked to the logEvent method described above. 0 means ignore this criteria.
* remindPeriod: Once a user has postponed to rate the application, this could be used as a waiting period before prompting him next time. 0 means ignore this criteria.


Additionally, you can change the Strings used to prompt the user by modifying the files located at the locales folder for the supported languages. You can also add more locales and included them in the locales.ini file.

Behaviour
================

Every time the method promptRequired is executed, the library will check if based on the criteria defined by the initialization paramters user should be prompted.

If he should be prompted, user can take multiple decisions:

- Rate the application: In this case user will be forwarded to the rate page and won't be asked to rate the app again.
- Don't rate it and never be reminded: In this case, the library won't ask the user again to rate the app.
- Be reminded: The user will be reminded for rating the app after a remind period if the other usage criteria is met.



