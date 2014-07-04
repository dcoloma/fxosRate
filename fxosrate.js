(function() {
  'use strict';

  var root = this;
  var fxosRate;
  if (typeof exports !== 'undefined') {
    fxosRate = exports;
  } else {
    fxosRate = root.fxosRate = {};
  }

  fxosRate.init = function(applicationName, applicationVersion,
      daysUntilPrompt, usesUntilPrompt, eventsUntilPrompt, usesPerWeekForPrompt,
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
    this.MARKETBASEURL = 'https://marketplace.firefox.com/app/';

    // Init LocalStorage if no initialized
    this.usesWeek = this.getLsItem('usesWeek') || 0;
    this.setLsItem('usesWeek', parseInt(this.usesWeek) + 1);
    this.eventsWeek = this.getLsItem('eventsWeek') || 0;
    this.events = this.getLsItem('events') || 0;
    this.usedTimes = this.getLsItem('usedTimes') || 0;
    this.setLsItem('usedTimes', parseInt(this.usedTimes) + 1);

    this.wasPrompted = this.getLsItem('prompted') || "no";
    this.setLsItem('prompted', this.wasPrompted);
    this.firstUsageDate = this.getLsItem('firstUsageDate') || new Date();
    this.setLsItem('firstUsageDate', this.firstUsageDate);
    this.checkWeekPeriod();
  };

  fxosRate.getLsItem = function(itemName) {
    return localStorage.getItem(this.applicationName + '-' + itemName);
  };

  fxosRate.setLsItem = function(itemName, itemValue) {
    localStorage.setItem(this.applicationName + '-' + itemName, itemValue);
  };

  // Checks if a prompt for rating the app should be done at this moment
  // based on the initiailization criteria
  fxosRate.promptRequired = function() {
    if (this.shouldPrompt()) {
      this.prompt();
    }
  };

  fxosRate.shouldPrompt = function() {
    var prompt = false;
    // Checks if a prompt for rating should be done
    if (this.rateRejected() === 'yes') {
      console.log('User rejected rating');
    } else if (this.alreadyRated() === 'yes') {
      console.log('App already rated');
    } else if (!this.minimumUsageMet()) { // DONE
      console.log('App has not been yet used enough');
    } else if (!this.notRemindPeriodOver()) { // DONE
      console.log('Not remind period is not over yet');
    } else if (!this.weeklyUsageReached()) {// DONE
      console.log('Not enough usage per week');
    } else {
      prompt = true;
    }
    return prompt;
  };

  // Did user already say he doesn't want to rate the app?
  fxosRate.rateRejected = function() { // yes, no
    return this.getLsItem('rateRejected') || 'no';
  };

  // Did user already rate the app?
  fxosRate.alreadyRated = function() { // yes, no, old
    return this.getLsItem('alreadyRated') || 'no';
  };

  // Check if the app has been used enough to request user to rate it
  // enough means number of times launched or days since first launch
  fxosRate.minimumUsageMet = function() {
    var usedEnough = false;

    var now = new Date();
    var days = Math.round(
      (now.getTime() - new Date(this.getLsItem('firstUsageDate')).getTime()) /
      this.MILLISPERDAY);

    if ((this.getLsItem('usedTimes') > this.usesUntilPrompt) &&
        (days >= this.daysUntilPrompt) &&
        (this.getLsItem('events') >= this.eventsUntilPrompt)) {
      usedEnough = true;
    }
    return usedEnough;
  };

  // If the user has selected to be reminded later on, we need to honour this
  // period before doing so - returns true if 'not remind period' is over
  fxosRate.notRemindPeriodOver = function() {
    var over = true;
    var prompted = new Date(this.getLsItem('promptDate'));
    // otherwise it never was prompted before
    if (this.getLsItem('prompted') === 'yes') {
      var now = new Date();
      var days = Math.round(
        (now.getTime() - prompted.getTime()) / this.MILLISPERDAY);
      console.log(days);
      if (days < this.remindPeriod) {
        over = false;
      }
    }
    return over;
  };

  // In order to avoid prompting if usage is low, we can set some boundaries
  // per usage week based on a given event (pushed by app in logEvent) or
  // in number of app launches
  // return true if user has not ever been prompted yet
  fxosRate.weeklyUsageReached = function() {
    var reached = false;
    if (this.getLsItem('prompted') === 'no') {
      reached = true;
    } else if ((parseInt(this.getLsItem('usesWeek')) >
      this.usesPerWeekForPrompt) &&
      (parseInt(this.getLsItem('eventsWeek')) >= this.eventsPerWeekForPrompt)) {
      reached = true;
    }
    return reached;
  };

  // Used to logEvents so that apps can decide to ask for rating based on a
  // a given amount of events rather than in number of launches, e.g. number
  // of messages sent. After invoking this method, developer needs to invoke
  // promptRequired to determine if user should be prompted or not
  fxosRate.logEvent = function(events) {
    this.checkWeekPeriod();
    var eventsWeek = this.getLsItem('eventsWeek') || 0;
    var totalEvents = this.getLsItem('events') || 0;
    this.setLsItem('eventsWeek', parseInt(eventsWeek) + events);
    this.setLsItem('events', parseInt(totalEvents) + events);
  };

  // Helper function to check if a week has already passed so that we need
  // to reset counters for weekly control
  fxosRate.checkWeekPeriod = function() {
    var weekStartDate = new Date(this.getLsItem('weekStartDate'));
    if (weekStartDate !== null) {
      var now = new Date();
      var days = Math.round((now.getTime() -
        weekStartDate.getTime()) / this.MILLISPERDAY);
      if (days > 7) { // If more than 1 week has passed, it's time to reset
        this.setLsItem('weekStartDate', now);
        this.setLsItem('usesWeek', 0);
        this.setLsItem('eventsWeek', 0);
      }
    }
  };

  // Shows the prompt to the user
  fxosRate.prompt = function() {
    this.setLsItem('promptDate', new Date());
    this.setLsItem('prompted', 'yes');
    this.setLsItem('weekStartDate', new Date());
    this.setLsItem('eventsWeek', 0);
    this.setLsItem('usesWeek', 0);

    var rateIt = window.confirm(navigator.mozL10n.get('wanttorate'));
    if (rateIt === true) {
      this.setLsItem('alreadyRated', 'yes');
      window.open(this.MARKETBASEURL + this.applicationName + '/ratings/add');
    } else {
      var later = window.confirm(navigator.mozL10n.get('wantremindlater'));
      if (later !== true) {
        this.setLsItem('rateRejected', 'yes');
      }
    }
  };

  // only for testing purposes
  fxosRate.clear = function() {
    this.setLsItem('usesWeek', 0);
    this.setLsItem('usedTimes', 0);
    this.setLsItem('firstUsageDate', new Date());
    this.setLsItem('eventsWeek', 0);
    this.setLsItem('events', 0);
    this.setLsItem('weekStartDate', null);
    this.setLsItem('promptDate', null);
    this.setLsItem('prompted', 'no');
    this.setLsItem('usesWeek', 0);
    this.setLsItem('alreadyRated', 'no');
    this.setLsItem('rateRejected', 'no');
  };

  return this;

}).call(this);
