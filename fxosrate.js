var fxosRate = {
  init: function(applicationName, applicationVersion, daysUntilPrompt, 
                   usesUntilPrompt, eventsUntilPrompt, usesPerWeekForPrompt, 
                   eventsPerWeekForPrompt, remindPeriod) {
    this.applicationName = applicationName;
    this.applicationVersion = applicationVersion;
    this.daysUntilPrompt = daysUntilPrompt || 0;
    this.usesUntilPrompt = usesUntilPrompt || 0;
    this.eventsUntilPrompt = eventsUntilPrompt || 0;
    this.usesPerWeekForPrompt = usesPerWeekForPrompt || 0;
    this.eventsPerWeekForPrompt = eventsPerWeekForPrompt || 0;
    this.remindPeriod = remindPeriod || 0;
        
    this.MILLISPERDAY = 86400000;
    this.MARKETBASEURL = "https://marketplace.firefox.com/app/";

    // Init LocalStorage if no initialized
    this.usesWeek = this.getLsItem("usesWeek") || 0;
    this.setLsItem("usesWeek",  parseInt(this.usesWeek) + 1);
    this.eventsWeek = this.getLsItem("eventsWeek") || 0;
    this.events = this.getLsItem("events") || 0;
    this.usedTimes = this.getLsItem("usedTimes") || 0;
    this.setLsItem("usedTimes",  parseInt(this.usedTimes)+1);

    this.firstUsageDate = this.getLsItem("firstUsageDate") || new Date();
    this.setLsItem("firstUsageDate", this.firstUsageDate);
    this.checkWeekPeriod();
  },

  getLsItem: function (itemName){
    return localStorage.getItem(this.applicationName+"-"+itemName);
  },

  setLsItem: function (itemName, itemValue){
    localStorage.setItem(this.applicationName+"-"+itemName, itemValue);
  },

  // Checks if a prompt for rating the app should be done at this moment
  // based on the initiailization criteria
  promptRequired: function(){
    if (this.shouldPrompt())
    	this.prompt();
  },

  shouldPrompt: function(){
    prompt = false;
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
      prompt = true;
    return prompt 
  },

  // Did user already say he doesn't want to rate the app? 
  rateRejected: function(){ // yes, no
    return this.getLsItem("rateRejected") || "no";
  },

  // Did user already rate the app? 
  alreadyRated: function(){ // yes, no, old
    return this.getLsItem("alreadyRated") || "no"; 
  },

  // Check if the app has been used enough to request user to rate it
  // enough means number of times launched or days since first launch
  minimumUsageMet: function(){
    usedEnough = false;
    var now = new Date();
    var days = Math.round(
           (now.getTime() - Date.parse(this.getLsItem("firstUsageDate")))/this.MILLISPERDAY); 
    if ((this.getLsItem("usedTimes") > this.usesUntilPrompt) &&
        (days >= this.daysUntilPrompt) && 
        (this.getLsItem("events") >= this.eventsUntilPrompt))
      usedEnough = true;

    return usedEnough;
  },

  // If the user has selected to be reminded later on, we need to honour this
  // period before doing so - returns true if "not remind period" is over
  notRemindPeriodOver: function(){
    var over = true;
    var prompted = Date.parse(this.getLsItem("promptDate"));
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
  // return true if user has not ever been prompted yet
  weeklyUsageReached: function(){
    reached = false;
    if (this.getLsItem("promptDate") == null)
        reached = true;
    else if ((parseInt(this.getLsItem("usesWeek")) > this.usesPerWeekForPrompt)
      && (parseInt(this.getLsItem("eventsWeek"))>=this.eventsPerWeekForPrompt))
     	reached = true;
    return reached;
  },

  // Used to logEvents so that apps can decide to ask for rating based on a
  // a given amount of events rather than in number of launches, e.g. number
  // of messages sent. After invoking this method, developer needs to invoke
  // promptRequired to determine if user should be prompted or not
  logEvent: function(events){
    this.checkWeekPeriod();
    eventsWeek = this.getLsItem("eventsWeek") || 0;
    totalEvents = this.getLsItem("events") || 0;
    this.setLsItem("eventsWeek", parseInt(eventsWeek)+events);
    this.setLsItem("events", parseInt(totalEvents)+events);
  },

  // Helper function to check if a week has already passed so that we need
  // to reset counters for weekly control
  checkWeekPeriod: function(){
    var weekStartDate = Date.parse(this.getLsItem("weekStartDate"));
    if (weekStartDate != null)
    {
      var now = new Date();
      var days = Math.round((now.getTime()-weekStartDate)/this.MILLISPERDAY);
      if (days > 7) // If more than 1 week has passed, it's time to reset 
      {
        this.setLsItem("weekStartDate", now);
        this.setLsItem("usesWeek", 0);
        this.setLsItem("eventsWeek", 0);
      }
    }
  },

  // Shows the prompt to the user
  prompt: function(){
    this.setLsItem("promptDate", new Date());
    this.setLsItem("weekStartDate", new Date());
    this.setLsItem("eventsWeek", 0);
    this.setLsItem("usesWeek", 0);

    var rateIt = confirm(navigator.mozL10n.get("wanttorate"));
    if (rateIt == true)
    {
      this.setLsItem("alreadyRated", "yes");
      window.open(this.MARKETBASEURL + this.applicationName + "/ratings/add");
    }
    else
    {
      var later = confirm(navigator.mozL10n.get("wantremindlater"));
      if (later != true)
        this.setLsItem("rateRejected","yes");
      alert(navigator.mozL10n.get("thankyoumessage"));
    }
  },

  // only for testing purposes
  clear: function() {
    this.setLsItem("usesWeek",  0);
    this.setLsItem("usedTimes", 0); 
    this.setLsItem("firstUsageDate", new Date()); 
    this.setLsItem("eventsWeek", 0);
    this.setLsItem("events", 0);
    this.setLsItem("weekStartDate", null);
    this.setLsItem("promptDate", null); 
    this.setLsItem("usesWeek", 0);
    this.setLsItem("alreadyRated", "no");
    this.setLsItem("rateRejected", "no");
  },
};
