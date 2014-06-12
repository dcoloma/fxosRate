var fxosRate = {
  init: function(applicationName, applicationVersion, daysUntilPrompt, 
                   usesUntilPrompt, eventsUntilPrompt, usesPerWeekForPrompt, 
                   remindPeriod) {
    this.applicationName = applicationName;
    this.applicationVersion = applicationVersion;
    this.daysUntilPrompt = daysUntilPrompt || 0;
    this.usesUntilPrompt = usesUntilPrompt || 0;
    this.eventsUntilPrompt = eventsUntilPrompt || 0;
    this.usesPerWeekForPrompt = usesPerWeekForPrompt || 0;
    this.remindPeriod = remindPeriod || 0;
        
    this.MILLISPERDAY = 86400000;
    this.MARKETBASEURL = "https://marketplace.firefox.com/app/";

    // Init LocalStorage if no initialized
    this.usesWeek = localStorage.getItem("usesWeek") || 0;
    localStorage.setItem("usesWeek",  parseInt(this.usesWeek) + 1);
    this.eventsWeek = localStorage.getItem("eventsWeek") || 0;
    this.usedTimes = localStorage.getItem("usedTimes") || 1;
    localStorage.setItem("usedTimes",  parseInt(this.usedTimes));

    this.firstUsageDate = localStorage.getItem("firstUsageDate") || new Date();
    localStorage.setItem("firstUsageDate", localStorage.firstUsageDate);
    this.checkWeekPeriod();
  },

  // Checks if a prompt for rating the app should be done at this moment
  // based on the initiailization criteria
  promptRequired: function(){
    // Checks if a prompt for rating should be done
    if (this.rateRejected() == "yes")
    	console.log("User rejected rating");
    else if(this.alreadyRated() == "yes")
    	console.log("App already rated");
    else if (!this.minimumUsageMet()) // DONE
    	console.log("App has not been yet used enough");
    else if (!this.notRemindPeriodOver()) // DONE
    	console.log("Not remind period is not over yet");
    else if (!this.weeklyUsageReached()) // DONE
    	console.log("Not enough usage per week");
    else
    	this.prompt();
  },

  // Did user already say he doesn't want to rate the app? 
  rateRejected: function(){ // yes, no
    return localStorage.getItem("rateRejected") || "no";
  },

  // Did user already rate the app? 
  alreadyRated: function(){ // yes, no, old
    return localStorage.getItem("alreadyRated") || "no"; 
  },

  // Check if the app has been used enough to request user to rate it
  // enough means number of times launched or days since first launch
  minimumUsageMet: function(){
    usedEnough = false;
    var now = new Date();
    var days = Math.round(
           (now.getTime() - Date.parse(this.firstUsageDate))/this.MILLISPERDAY);

    if ((this.usedTimes > this.usesUntilPrompt)&&(days >= this.daysUntilPrompt))
      usedEnough = true;

    return usedEnough;
  },

  // If the user has selected to be reminded later on, we need to honour this
  // period before doing so - returns true if "not remind period" is over
  notRemindPeriodOver: function(){
    var over = true;
    var prompted = Date.parse(localStorage.getItem("promptDate"));
    if (prompted != null) // otherwise it never was prompted before
    {
      var now = new Date();
      var days = Math.round((now.getTime()-prompted)/this.MILLISPERDAY);
      if (days < this.remindPeriod)
        over = false;
    }
    return over;
  },

  // In order to avoid prompting if usage is low, we can set some boundaries
  // per usage week based on a given event (pushed by app in logEvent) or 
  // in number of app launches
  weeklyUsageReached: function(){
    reached = false;
    if ((parseInt(localStorage.getItem("usesWeek")) > this.usesPerWeekForPrompt)
      || (parseInt(localStorage.getItem("eventsWeek"))>=this.eventsUntilPrompt))
     	reached = true;
    return reached;
  },

  // Used to logEvents so that apps can decide to ask for rating based on a
  // a given amount of events rather than in number of launches, e.g. number
  // of messages sent. After invoking this method, developer needs to invoke
  // promptRequired to determine if user should be prompted or not
  logEvent: function(events){
    this.checkWeekPeriod();
    eventsWeek = localStorage.getItem("eventsWeek") || 0;
    localStorage.setItem("eventsWeek", parseInt(eventsWeek)+events);
  },

  // Helper function to check if a week has already passed so that we need
  // to reset counters for weekly control
  checkWeekPeriod: function(){
    var weekStartDate = Date.parse(localStorage.getItem("weekStartDate"));
    if (weekStartDate != null)
    {
      var now = new Date();
      var days = Math.round((now.getTime()-weekStartDate)/this.MILLISPERDAY);
      if (days > 7) // If more than 1 week has passed, it's time to reset 
      {
        localStorage.setItem("weekStartDate", now);
        localStorage.setItem("usesWeek", 0);
        localStorage.setItem("eventsWeek", 0);
      }
    }
  },

  // Shows the prompt to the user
  prompt: function(){
    localStorage.setItem("promptDate", new Date());
    localStorage.setItem("weekStartDate", new Date());
    localStorage.setItem("eventsWeek", 0);
    localStorage.setItem("usesWeek", 0);

    var rateIt = confirm("We are working hard to improve this application. Positive reviews and rates help us to continue doing so. Do you want to help us by rating this app?");
    if (rateIt == true)
    {
      localStorage.setItem("alreadyRated", "yes");
      window.open(this.MARKETBASEURL + this.applicationName + "/ratings/add");
    }
    else
    {
      var later = confirm("Do you want us to remind you to rate it later? If you select 'cancel' we will not ask you again.")
      if (later != true)
        localStorage.setItem("rateRejected","yes");
      alert("Thanks for using " + applicationName + "!");
    }
  },
};