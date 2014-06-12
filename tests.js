QUnit.test("Test1 - No limits - prompt", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test1", "1.0", 0, 0, 0, 0, 0,0);
 assert.equal(rate.shouldPrompt(), true);
});

QUnit.test("Test2 - Limits: 10 uses // Used 1 - NO prompt", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test2", "1.0", 0, 10, 0, 0, 0,0);
 assert.equal(rate.shouldPrompt() , false);
 rate.setLsItem("usedTimes", 0);
});

QUnit.test("Test3 - Limits: 10 uses // Used 10 - NO prompt", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test3", "1.0", 0, 10, 0, 0, 0,0);
 assert.equal(rate.shouldPrompt() , false);
 rate.setLsItem("usedTimes", 0);
});

QUnit.test("Test4 - Limits: 10 uses // Used 11 - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test4", "1.0", 0, 10, 0, 0, 0,0);
 rate.setLsItem("usedTimes", 11);
 assert.equal(rate.shouldPrompt() , true);
 rate.setLsItem("usedTimes", 0);
});

QUnit.test("Test5 - Limits: 10 uses, 7 days // Used 1 time, 0 day - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test5", "1.0", 7, 10, 0, 0, 0,0);
 assert.equal(rate.shouldPrompt() , false);
 rate.setLsItem("usedTimes", 0);
});

QUnit.test("Test6 - Limits: 10 uses, 7 days // Used 10 times, 0 day - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test6", "1.0", 7, 10, 0, 0, 0,0);
 assert.equal(rate.shouldPrompt() , false);
 rate.setLsItem("usedTimes", 0);
});

QUnit.test("Test7 - Limits: 10 uses, 7 days // Used 11 times, 0 day - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test7", "1.0", 7, 10, 0, 0, 0,0);
 rate.setLsItem("usedTimes", 11);
 assert.equal(rate.shouldPrompt() , false);
 rate.setLsItem("usedTimes", 0);
});

QUnit.test("Test8 - Limits: 10 uses, 7 days // Used 11 times, 6 days - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test8", "1.0", 7, 10, 0, 0, 0,0);
 rate.setLsItem("usedTimes", 11);
 var nearlyoneWeekAgo = new Date();
 nearlyoneWeekAgo.setDate(nearlyoneWeekAgo.getDate() - 6);
 rate.setLsItem("firstUsageDate", nearlyoneWeekAgo);
 assert.equal(rate.shouldPrompt() , false);
 rate.setLsItem("usedTimes", 0);
 rate.setLsItem("firstUsageDate", new Date());
});

QUnit.test("Test9 - Limits: 10 uses, 7 days // Uses 11 times, 7 days - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test9", "1.0", 7, 10, 0, 0, 0,0);
 rate.setLsItem("usedTimes", 11);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 assert.equal(rate.shouldPrompt() , true);
 rate.setLsItem("usedTimes", 0);
 rate.setLsItem("firstUsageDate", new Date());
});


QUnit.test("Test10 - Limits: 10 uses, 7 days, 100 events // Uses 11 times, 6 days, 101 events - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test10", "1.0", 7, 10, 100, 0, 0,0);
 rate.logEvent(101);
 rate.setLsItem("usedTimes", 11);
 var nearlyoneWeekAgo = new Date();
 nearlyoneWeekAgo.setDate(nearlyoneWeekAgo.getDate() - 6);
 rate.setLsItem("firstUsageDate", nearlyoneWeekAgo);
 assert.equal(rate.shouldPrompt() , false);
 rate.setLsItem("usedTimes", 0);
 rate.setLsItem("events", 0);
 rate.setLsItem("eventsWeek", 0);
 rate.setLsItem("firstUsageDate", new Date());
});

QUnit.test("Test11 - Limits: 10 uses, 7 days, 100 events // Uses 11 times, 7 days, 99 events - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test11", "1.0", 7, 10, 100, 0, 0,0);
 rate.logEvent(99);
 rate.setLsItem("usedTimes", 11);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 assert.equal(rate.shouldPrompt() , false);
 rate.setLsItem("usedTimes", 0);
 rate.setLsItem("events", 0);
 rate.setLsItem("eventsWeek", 0);
 rate.setLsItem("firstUsageDate", new Date());
});

QUnit.test("Test12 - Limits: 10 uses, 7 days, 100 events // Uses 11 times, 7 days, 101 events - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test12", "1.0", 7, 10, 100, 0, 0,0);
 rate.logEvent(101);
 rate.setLsItem("usedTimes", 11);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 assert.equal(rate.shouldPrompt() , true);
 rate.setLsItem("usedTimes", 0);
 rate.setLsItem("events", 0);
 rate.setLsItem("eventsWeek", 0);
 rate.setLsItem("firstUsageDate", new Date());
});

QUnit.test("Test13 - Limits: 10 uses, 7 days, 100 events, weekly limits // Uses 11 times, 7 days, 101 events - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test13", "1.0", 7, 10, 100, 4000, 4000, 4000);
 rate.setLsItem("usedTimes", 11);
 rate.logEvent(101);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 assert.equal(rate.shouldPrompt() , true);
 rate.setLsItem("usedTimes", 0);
 rate.setLsItem("firstUsageDate", new Date());
 rate.setLsItem("events", 0);
 rate.setLsItem("eventsWeek", 0);
});

QUnit.test("Test14 - Limits: 10 uses, 7 days, 100 events. Wait Time: 400 days// Uses 11 times, 7 days, 101 events - wait 7 days - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test14", "1.0", 7, 10, 100, 0, 0, 4000);
 rate.setLsItem("usedTimes", 11);
 rate.logEvent(101);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 rate.setLsItem("promptDate", oneWeekAgo);
 assert.equal(rate.shouldPrompt() , false);
 rate.setLsItem("usedTimes", 0);
 rate.setLsItem("firstUsageDate", new Date());
 rate.setLsItem("promptDate", new Date());
 rate.setLsItem("events", 0);
 rate.setLsItem("eventsWeek", 0);
});

QUnit.test("Test15 - Limits: 10 uses, 7 days, 100 events. Wait Time: 400 days// Uses 11 times, 7 days, 101 events - wait 399 days - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test15", "1.0", 7, 10, 100, 0, 0, 400);
 rate.setLsItem("usedTimes", 11);
 rate.logEvent(101);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 399);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 rate.setLsItem("promptDate", oneWeekAgo);
 assert.equal(rate.shouldPrompt() , false);
 rate.setLsItem("usedTimes", 0);
 rate.setLsItem("firstUsageDate", new Date());
 rate.setLsItem("promptDate", new Date());
 rate.setLsItem("events", 0);
 rate.setLsItem("eventsWeek", 0);
});

QUnit.test("Test16 - Limits: 10 uses, 7 days, 100 events. Wait Time: 400 days// Uses 11 times, 7 days, 101 events - wait 400 days - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test16", "1.0", 7, 10, 100, 0, 0, 400);
 rate.setLsItem("usedTimes", 11);
 rate.logEvent(101);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 400);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 rate.setLsItem("promptDate", oneWeekAgo);
 assert.equal(rate.shouldPrompt() , true);
 rate.setLsItem("usedTimes", 0);
 rate.setLsItem("firstUsageDate", new Date());
 rate.setLsItem("promptDate", new Date());
 rate.setLsItem("events", 0);
 rate.setLsItem("eventsWeek", 0);
});

QUnit.test("Test17 - Limits: 10 uses, 7 days, 100 events. Weekly: 20 events, Wait Time: 0 days// Wait 1 day, 10 weekly events . - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test17", "1.0", 7, 10, 10, 0, 20, 400);
 rate.setLsItem("usedTimes", 11);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 399);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 rate.setLsItem("promptDate", oneWeekAgo);
 rate.setLsItem("weekStartDate", new Date());
 rate.logEvent(10);
 assert.equal(rate.shouldPrompt() , false);
 rate.setLsItem("usedTimes", 0);
 rate.setLsItem("firstUsageDate", new Date());
 rate.setLsItem("promptDate", new Date());
 rate.setLsItem("events", 0);
 rate.setLsItem("eventsWeek", 0);
});


QUnit.test("Test18 - Limits: 10 uses, 7 days, 100 events. Weekly: 20 events, Wait Time: 0 days// Wait 1 day, 21 weekly events . - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test18", "1.0", 7, 10, 10, 0, 20, 400);
 rate.setLsItem("usedTimes", 11);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 400);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 rate.setLsItem("promptDate", oneWeekAgo);
 rate.setLsItem("weekStartDate", new Date());
 rate.logEvent(21);
 assert.equal(rate.shouldPrompt() , true);
 rate.setLsItem("usedTimes", 0);
 rate.setLsItem("firstUsageDate", new Date());
 rate.setLsItem("promptDate", new Date());
 rate.setLsItem("events", 0);
 rate.setLsItem("eventsWeek", 0);
});

QUnit.test("Test19 - Limits: 10 uses, 7 days, 10 events. Weekly: 10 days, 20 events, Wait Time: 0 days// Wait 1 day, 10 weekly events . - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test19", "1.0", 7, 10, 10, 10, 20, 0);
 rate.setLsItem("usedTimes", 11);
 rate.setLsItem("usesWeek", 11); 
 rate.setLsItem("events", 21);
 rate.setLsItem("eventsWeek", 19);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 rate.setLsItem("promptDate", oneWeekAgo);
 rate.setLsItem("weekStartDate", oneWeekAgo);
 assert.equal(rate.shouldPrompt() , false);
 rate.setLsItem("usedTimes", 0);
 rate.setLsItem("firstUsageDate", new Date());
 rate.setLsItem("promptDate", new Date());
 rate.setLsItem("events", 0);
 rate.setLsItem("eventsWeek", 0);
});

QUnit.test("Test20 - Limits: 10 uses, 7 days, 10 events. Weekly: 10 days, 20 events, Wait Time: 10 days// Wait 14 day, 10 weekly events . - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test20", "1.0", 7, 10, 10, 10, 20, 10);
 rate.setLsItem("usedTimes", 11);
 rate.setLsItem("events", 21);
 rate.setLsItem("eventsWeek", 9);
 rate.setLsItem("usesWeek", 11); 
 var twoWeekAgo = new Date();
 twoWeekAgo.setDate(twoWeekAgo.getDate() - 14);
 rate.setLsItem("firstUsageDate", twoWeekAgo);
 rate.setLsItem("promptDate", twoWeekAgo);
 rate.setLsItem("weekStartDate", twoWeekAgo);
 assert.equal(rate.shouldPrompt() , false);
 rate.setLsItem("usedTimes", 0);
 rate.setLsItem("firstUsageDate", new Date());
 rate.setLsItem("promptDate", new Date());
 rate.setLsItem("events", 0);
 rate.setLsItem("eventsWeek", 0);
 rate.setLsItem("usesWeek", 0);
});

QUnit.test("Test21 - Limits: 10u, 7d, 10e ** Weekly : 10 uses, 20 events, Wait Time: 10 days// Wait 14 day, 11 weekly uses, 21 weekly events . - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test21", "1.0", 7, 10, 10, 10, 20, 10);
 rate.setLsItem("usedTimes", 11);
 rate.setLsItem("events", 21);
 rate.setLsItem("eventsWeek", 21);
 rate.setLsItem("usesWeek", 11);
 var twoWeekAgo = new Date();
 twoWeekAgo.setDate(twoWeekAgo.getDate() - 14);
 rate.setLsItem("firstUsageDate", twoWeekAgo);
 rate.setLsItem("promptDate", twoWeekAgo);
 rate.setLsItem("weekStartDate", twoWeekAgo);
 assert.equal(rate.shouldPrompt() , true);
 rate.setLsItem("usedTimes", 0);
 rate.setLsItem("firstUsageDate", new Date());
 rate.setLsItem("promptDate", new Date());
 rate.setLsItem("events", 0);
 rate.setLsItem("eventsWeek", 0);
 rate.setLsItem("usesWeek", 0);
});

