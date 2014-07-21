// Config tests
QUnit.test("Direct passed arguments work", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np1", "1.0", 1, 2, 3, 4, 5, 6);

 assert.equal(rate.daysUntilPrompt, 1);
 assert.equal(rate.usesUntilPrompt, 2);
 assert.equal(rate.eventsUntilPrompt, 3);
 assert.equal(rate.usesPerWeekForPrompt, 4);
 assert.equal(rate.eventsPerWeekForPrompt, 5);
 assert.equal(rate.remindPeriod, 6);
 rate.clear();
});

QUnit.test("Dictionary passed arguments work", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np1", "1.0", {
   daysUntilPrompt: 1,
   usesUntilPrompt: 2,
   eventsUntilPrompt: 3,
   usesPerWeekForPrompt: 4,
   eventsPerWeekForPrompt: 5,
   remindPeriod: 6
 });

 assert.equal(rate.daysUntilPrompt, 1);
 assert.equal(rate.usesUntilPrompt, 2);
 assert.equal(rate.eventsUntilPrompt, 3);
 assert.equal(rate.usesPerWeekForPrompt, 4);
 assert.equal(rate.eventsPerWeekForPrompt, 5);
 assert.equal(rate.remindPeriod, 6);
 rate.clear();
});

QUnit.test("Defaults work for missed keys", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np1", "1.0", {
   daysUntilPrompt: 1,
   usesPerWeekForPrompt: 4,
   eventsPerWeekForPrompt: 5,
   remindPeriod: 6
 });

 assert.equal(rate.daysUntilPrompt, 1);
 assert.equal(rate.usesUntilPrompt, 0);
 assert.equal(rate.eventsUntilPrompt, 0);
 assert.equal(rate.usesPerWeekForPrompt, 4);
 assert.equal(rate.eventsPerWeekForPrompt, 5);
 assert.equal(rate.remindPeriod, 6);
 rate.clear();
});

QUnit.test("Defaults work for missed config object", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np1", "1.0");

 assert.equal(rate.daysUntilPrompt, 0);
 assert.equal(rate.usesUntilPrompt, 0);
 assert.equal(rate.eventsUntilPrompt, 0);
 assert.equal(rate.usesPerWeekForPrompt, 0);
 assert.equal(rate.eventsPerWeekForPrompt, 0);
 assert.equal(rate.remindPeriod, 0);
 rate.clear();
});

// Not Prompted tests
QUnit.test("No Prompted ** Limit: Days 7/1 Uses 0/0, Events 0/1 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np1", "1.0", 7, 0, 0, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 1);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("events", 1);
 rate.setLsItem("usedTimes", 0);

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("No Prompted ** Limit: Days 7/6 Uses 0/1 Events 0/2 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np2", "1.0", 7, 0, 0, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 6);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("events", 2);
 rate.setLsItem("usedTimes", 1);

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("No Prompted ** Limit: Days 7/7 Uses 0/1 Events 0/5 - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np3", "1.0", 7, 0, 0, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 7);
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("events", 5);
 rate.setLsItem("usedTimes", 1);

 assert.equal(rate.shouldPrompt() , true);
 rate.clear();
});

QUnit.test("No Prompted ** Limit: Days 0/1 Uses 5/4 Events 0/1 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np4", "1.0", 0, 5, 0, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 1);
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("events", 1);
 rate.setLsItem("usedTimes", 4);

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("No Prompted ** Limit: Days 0/1 Uses 5/6 Events 0/2 - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np5", "1.0", 0, 5, 0, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 1);
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("events", 2);
 rate.setLsItem("usedTimes", 6);

 assert.equal(rate.shouldPrompt() , true);
 rate.clear();
});


QUnit.test("No Prompted ** Limit: Days 2/1 Uses 2/3 Events 0/1 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np6", "1.0", 2, 2, 0, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 1);
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("events", 2);
 rate.setLsItem("usedTimes", 6);

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("No Prompted ** Limit: Days 2/3 Uses 2/3 Events 0/1 - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np7", "1.0", 2, 2, 0, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 3);
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("events", 1);
 rate.setLsItem("usedTimes", 3);

 assert.equal(rate.shouldPrompt() , true);
 rate.clear();
});

QUnit.test("No Prompted ** Limit: Days 2/3 Uses 2/1 Events 0/1 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np8", "1.0", 2, 2, 0, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 3);
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("events", 1);
 rate.setLsItem("usedTimes", 1);

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});


QUnit.test("No Prompted ** Limit: Days 0/3 Uses 2/3 Events 3/4 - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np9", "1.0", 0, 2, 0, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 1);
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("events", 4);
 rate.setLsItem("usedTimes", 3);

 assert.equal(rate.shouldPrompt() , true);
 rate.clear();
});

QUnit.test("No Prompted ** Limit: Days 0/3 Uses 2/1 Events 3/4 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np10", "1.0", 0, 2, 3, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 3);
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("events", 4);
 rate.setLsItem("usedTimes", 1);

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("No Prompted ** Limit: Days 0/3 Uses 2/3 Events 3/2 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np11", "1.0", 0, 2, 3, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 3);
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("events", 2);
 rate.setLsItem("usedTimes", 3);

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("No Prompted ** Limit: Days 2/3 Uses 3/2 Events 2/1 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np13", "1.0", 2, 3, 2, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 3);
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("events", 1);
 rate.setLsItem("usedTimes", 2);

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("No Prompted ** Limit: Days 2/3 Uses 3/4 Events 2/1 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np14", "1.0", 2, 3, 2, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 3);
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("events", 1);
 rate.setLsItem("usedTimes", 4);

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});


QUnit.test("No Prompted ** Limit: Days 2/3 Uses 3/4 Events 2/3 - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np15", "1.0", 2, 3, 2, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 3);
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("events", 3);
 rate.setLsItem("usedTimes", 4);

 assert.equal(rate.shouldPrompt() , true);
 rate.clear();
});

QUnit.test("No Prompted ** Limit: Days 2/3 Uses 3/2 Events 2/3 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np16", "1.0", 2, 3, 2, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 3);
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("events", 3);
 rate.setLsItem("usedTimes", 2);

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("No Prompted ** Limit: Days 2/1 Uses 3/2 Events 2/3 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np17", "1.0", 2, 3, 2, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 1);
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("events", 3);
 rate.setLsItem("usedTimes", 2);

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("No Prompted ** Limit: Days 2/1 Uses 3/3 Events 2/3 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("np18", "1.0", 2, 3, 2, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 1);
 rate.setLsItem("firstUsageDate", pDate);
 rate.setLsItem("prompted", "no");
 rate.setLsItem("events", 3);
 rate.setLsItem("usedTimes", 3);

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

// Already Prompted tests

// weekly ** uses: 2/3 ** events 2/3 ** delay: 7/8
QUnit.test("Prompted Once ** Weekly: Uses 2/3, Events 2/3, delay 7/8 - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("ap1", "1.0", 0, 0, 0, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 8);
 rate.setLsItem("promptDate", pDate);
 rate.setLsItem("eventsWeek", 3);
 rate.setLsItem("prompted", "yes");
 rate.setLsItem("usesWeek", 3);

 assert.equal(rate.shouldPrompt() , true);
 rate.clear();
});

// weekly ** uses: 2/3 ** events 2/3 ** delay: 7/5
QUnit.test("Prompted Once ** Weekly: Uses 2/3, Events 2/3, delay 7/5 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("ap2", "1.0", 0, 0, 0, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 5);
 rate.setLsItem("promptDate", pDate);
 rate.setLsItem("eventsWeek", 3);
 rate.setLsItem("prompted", "yes");
 rate.setLsItem("usesWeek", 3);

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

// weekly ** uses: 2/1 ** events 2/1 ** delay: 7/8
QUnit.test("Prompted Once ** Weekly: Uses 2/1, Events 2/1, delay 7/8 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("ap3", "1.0", 0, 0, 0, 2, 2, 7);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 8);
 rate.setLsItem("promptDate", pDate);
 rate.setLsItem("eventsWeek", 1);
 rate.setLsItem("prompted", "yes");
 rate.setLsItem("usesWeek", 1);

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

// weekly ** uses: 0/5 ** events 10/12 ** delay: 0/2
QUnit.test("Prompted Once ** Weekly: Uses 0/5, Events 10/12, delay 0/2 - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("ap4", "1.0", 0, 0, 0, 0, 10, 0);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 2);
 rate.setLsItem("promptDate", pDate);
 rate.setLsItem("prompted", "yes");
 rate.setLsItem("usesWeek", 5);
 rate.setLsItem("eventsWeek", 12) ;

 assert.equal(rate.shouldPrompt() , true);
 rate.clear();
});

// weekly ** uses: 0/5 ** events 10/12 ** delay: 0/2
QUnit.test("Prompted Once ** Weekly: Uses 0/5, Events 10/12, delay 0/2 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("ap5", "1.0", 0, 0, 0, 0, 10, 0);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 2);
 rate.setLsItem("promptDate", pDate);
 rate.setLsItem("prompted", "yes");
 rate.setLsItem("usesWeek", 1);
 rate.setLsItem("eventsWeek", 8) ;

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

// weekly ** uses: 5/4 ** events 10/11 ** delay: 0/2
QUnit.test("Prompted Once ** Weekly: Uses 5/4, Events 10/11, delay 0/2 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("ap6", "1.0", 0, 0, 0, 5, 10, 0);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 2);
 rate.setLsItem("promptDate", pDate);
 rate.setLsItem("prompted", "yes");
 rate.setLsItem("usesWeek", 4);
 rate.setLsItem("eventsWeek", 11) ;

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

// weekly ** uses: 5/6 ** events 10/11 ** delay: 0/2
QUnit.test("Prompted Once ** Weekly: Uses 5/6, Events 10/11, delay 0/2 - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("ap7", "1.0", 0, 0, 0, 5, 10, 0);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 2);
 rate.setLsItem("promptDate", pDate);
 rate.setLsItem("prompted", "yes");
 rate.setLsItem("usesWeek", 6);
 rate.setLsItem("eventsWeek", 11) ;

 assert.equal(rate.shouldPrompt() , true);
 rate.clear();
});

// weekly ** uses: 6/5 ** events 10/8 ** delay: 0/2
QUnit.test("Prompted Once ** Weekly: Uses 6/5, Events 10/8, delay 0/2 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("ap8", "1.0", 0, 0, 0, 6, 10, 0);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 2);
 rate.setLsItem("promptDate", pDate);
 rate.setLsItem("prompted", "yes");
 rate.setLsItem("usesWeek", 5);
 rate.setLsItem("eventsWeek", 8) ;

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});



// weekly ** uses: 20/19 ** events 30/29 ** delay: 10/9
QUnit.test("Prompted Once ** Weekly: Uses 20/19, Events 30/29, delay 10/9 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("ap9", "1.0", 0, 0, 0, 20, 30, 10);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 9);
 rate.setLsItem("promptDate", pDate);
 rate.setLsItem("prompted", "yes");
 rate.setLsItem("usesWeek", 19);
 rate.setLsItem("eventsWeek", 29) ;

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});


// weekly ** uses: 20/19 ** events 30/31 ** delay: 10/9
QUnit.test("Prompted Once ** Weekly: Uses 20/19, Events 30/31, delay 10/9 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("ap10", "1.0", 0, 0, 0, 20, 30, 10);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 9);
 rate.setLsItem("promptDate", pDate);
 rate.setLsItem("prompted", "yes");
 rate.setLsItem("usesWeek", 19);
 rate.setLsItem("eventsWeek", 31) ;

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

// weekly ** uses: 20/19 ** events 30/29 ** delay: 10/11
QUnit.test("Prompted Once ** Weekly: Uses 20/19, Events 30/29, delay 10/11 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("ap11", "1.0", 0, 0, 0, 20, 30, 10);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 11);
 rate.setLsItem("promptDate", pDate);
 rate.setLsItem("prompted", "yes");
 rate.setLsItem("usesWeek", 19);
 rate.setLsItem("eventsWeek", 29) ;

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});


// weekly ** uses: 20/19 ** events 30/31 ** delay: 10/11
QUnit.test("Prompted Once ** Weekly: Uses 20/19, Events 30/31, delay 10/11 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("ap12", "1.0", 0, 0, 0, 20, 30, 10);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 11);
 rate.setLsItem("promptDate", pDate);
 rate.setLsItem("prompted", "yes");
 rate.setLsItem("usesWeek", 19);
 rate.setLsItem("eventsWeek", 31) ;

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});


// weekly ** uses: 20/21 ** events 30/29 ** delay: 10/9
QUnit.test("Prompted Once ** Weekly: Uses 20/21, Events 30/29, delay 10/9 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("ap13", "1.0", 0, 0, 0, 20, 30, 10);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 9);
 rate.setLsItem("promptDate", pDate);
 rate.setLsItem("prompted", "yes");
 rate.setLsItem("usesWeek", 21);
 rate.setLsItem("eventsWeek", 29) ;

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

// weekly ** uses: 20/21 ** events 30/31 ** delay: 10/9
QUnit.test("Prompted Once ** Weekly: Uses 20/21, Events 30/31, delay 10/9 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("ap14", "1.0", 0, 0, 0, 20, 30, 10);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 9);
 rate.setLsItem("promptDate", pDate);
 rate.setLsItem("prompted", "yes");
 rate.setLsItem("usesWeek", 21);
 rate.setLsItem("eventsWeek", 31) ;

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

// weekly ** uses: 20/21 ** events 30/31 ** delay: 10/11
QUnit.test("Prompted Once ** Weekly: Uses 20/21, Events 30/31, delay 10/11 - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("ap15", "1.0", 0, 0, 0, 20, 30, 10);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 11);
 rate.setLsItem("promptDate", pDate);
 rate.setLsItem("prompted", "yes");
 rate.setLsItem("usesWeek", 21);
 rate.setLsItem("eventsWeek", 31) ;

 assert.equal(rate.shouldPrompt() , true);
 rate.clear();
});

// weekly ** uses: 20/21 ** events 30/29 ** delay: 10/11
QUnit.test("Prompted Once ** Weekly: Uses 20/21, Events 30/29, delay 10/11 - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("ap16", "1.0", 0, 0, 0, 20, 30, 10);

 var pDate = new Date();
 pDate.setDate(pDate.getDate() - 9);
 rate.setLsItem("promptDate", pDate);
 rate.setLsItem("prompted", "yes");
 rate.setLsItem("usesWeek", 21);
 rate.setLsItem("eventsWeek", 29) ;

 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});
