QUnit.test("TC1 - Limit: 0u, 0d, 0e ** Weekly: 0u, 0e ** Wait: 0d *-*-*-*  Use: 0u, 0e, 0d - WeekUse: 0u, 0e - Wait: 0d - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test1", "1.0", 0, 0, 0, 0, 0,0);
 assert.equal(rate.shouldPrompt(), true);
});

////
QUnit.test("TC2 - Limit: 10u, 0d, 10e ** Weekly: 0u, 0e ** Wait: 0d *-*-*-*  Use: 0u, 10e, 0d - WeekUse: 0u, 0e - Wait: 0d - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test2", "1.0", 0, 10, 10, 0, 0,0);
 rate.setLsItem("events", 11);
 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("TC3 - Limit: 10u, 0d, 0e ** Weekly: 0u, 0e ** Wait: 0d *-*-*-*  Use: 0u, 0e, 0d - WeekUse: 0u, 0e - Wait: 0d - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test3", "1.0", 0, 10, 0, 0, 0,0);
 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("TC4 - Limit: 10u, 0d, 0e ** Weekly: 0u, 0e ** Wait: 0d *-*-*-*  Use: 11u, 0e, 0d - WeekUse: 0u, 0e - Wait: 0d - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test4", "1.0", 0, 10, 0, 0, 0,0);
 rate.setLsItem("usedTimes", 11);
 assert.equal(rate.shouldPrompt() , true);
 rate.clear();
});

QUnit.test("TC5 - Limit: 10u, 7d, 10e ** Weekly: 0u, 0e ** Wait: 0d *-*-*-*  Use: 0u, 11e, 0d - WeekUse: 0u, 0e - Wait: 0d - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test5", "1.0", 7, 10, 0, 0, 0,0);
 rate.setLsItem("events", 11);
 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("TC6 - Limit: 10u, 7d, 0e ** Weekly: 0u, 0e ** Wait: 0d *-*-*-*  Use: 0u, 0e, 0d - WeekUse: 0u, 0e - Wait: 0d - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test6", "1.0", 7, 10, 0, 0, 0,0);
 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("TC7 - Limit: 10u, 7d, 0e ** Weekly: 0u, 0e ** Wait: 0d *-*-*-*  Use: 11u, 0e, 0d - WeekUse: 0u, 0e - Wait: 0d - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test7", "1.0", 7, 10, 0, 0, 0,0);
 rate.setLsItem("usedTimes", 11);
 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("TC8 - Limit: 10u, 7d, 0e ** Weekly: 0u, 0e ** Wait: 0d *-*-*-*  Use: 11u, 0e, 6d - WeekUse: 0u, 0e - Wait: 6d - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test8", "1.0", 7, 10, 0, 0, 0,0);
 rate.setLsItem("usedTimes", 11);
 var nearlyoneWeekAgo = new Date();
 nearlyoneWeekAgo.setDate(nearlyoneWeekAgo.getDate() - 6);
 rate.setLsItem("firstUsageDate", nearlyoneWeekAgo);
 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("TC9 - Limit: 10u, 7d, 0e ** Weekly: 0u, 0e ** Wait: 0d *-*-*-*  Use: 11u, 0e, 7d - WeekUse: 0u, 0e - Wait: 7d - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test9", "1.0", 7, 10, 0, 0, 0,0);
 rate.setLsItem("usedTimes", 11);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 assert.equal(rate.shouldPrompt() , true);
 rate.clear();
});


QUnit.test("TC10 - Limit: 10u, 7d, 100e ** Weekly: 0u, 0e ** Wait: 0d *-*-*-*  Use: 11u, 101e, 7d - WeekUse: 0u, 101e - Wait: 6d - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test10", "1.0", 7, 10, 100, 0, 0,0);
 rate.logEvent(101);
 rate.setLsItem("usedTimes", 11);
 var nearlyoneWeekAgo = new Date();
 nearlyoneWeekAgo.setDate(nearlyoneWeekAgo.getDate() - 6);
 rate.setLsItem("firstUsageDate", nearlyoneWeekAgo);
 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("TC11 - Limit: 10u, 7d, 100e ** Weekly: 0u, 0e ** Wait: 0d *-*-*-*  Use: 11u, 99e, 7d - WeekUse: 0u, 99e - Wait: 7d - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test11", "1.0", 7, 10, 100, 0, 0,0);
 rate.logEvent(99);
 rate.setLsItem("usedTimes", 11);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("TC12 - Limit: 10u, 7d, 100e ** Weekly: 0u, 0e ** Wait: 0d *-*-*-*  Use: 11u, 101e, 7d - WeekUse: 0u, 101e - Wait: 7d - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test12", "1.0", 7, 10, 100, 0, 0,0);
 rate.logEvent(101);
 rate.setLsItem("usedTimes", 11);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 assert.equal(rate.shouldPrompt() , true);
 rate.clear();
});

QUnit.test("TC13 - Limit: 10u, 7d, 100e ** Weekly: 4000u, 4000e ** Wait: 5d *-*-*-*  Use: 11u, 101e, 7d - WeekUse: 0u, 101e - Wait: 7d - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test13", "1.0", 7, 10, 100, 4000, 4000, 5);
 rate.setLsItem("usedTimes", 11);
 rate.logEvent(101);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("TC14 - Limit: 10u, 7d, 100e ** Weekly: 0u, 0e ** Wait: 400d *-*-*-*  Use: 11u, 101e, 7d - WeekUse: 0u, 101e - Wait: 7d - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test14", "1.0", 7, 10, 100, 0, 0, 400);
 rate.setLsItem("usedTimes", 11);
 rate.logEvent(101);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 rate.setLsItem("promptDate", oneWeekAgo);
 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("TC15 - Limit: 10u, 7d, 100e ** Weekly: 0u, 0e ** Wait: 400d *-*-*-*  Use: 11u, 101e, 399d - WeekUse: 0u, 101e - Wait: 399d - NO PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test15", "1.0", 7, 10, 100, 0, 0, 400);
 rate.setLsItem("usedTimes", 11);
 rate.logEvent(101);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 399);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 rate.setLsItem("promptDate", oneWeekAgo);
 assert.equal(rate.shouldPrompt() , false);
 rate.clear();
});

QUnit.test("TC16 - Limit: 10u, 7d, 100e ** Weekly: 0u, 0e ** Wait: 400d *-*-*-*  Use: 11u, 101e, 400d - WeekUse: 0u, 101e - Wait: 400d - PROMPT", function (assert){
 var rate = Object.create(fxosRate);
 rate.init("test16", "1.0", 7, 10, 100, 0, 0, 400);
 rate.setLsItem("usedTimes", 11);
 rate.logEvent(101);
 var oneWeekAgo = new Date();
 oneWeekAgo.setDate(oneWeekAgo.getDate() - 400);
 rate.setLsItem("firstUsageDate", oneWeekAgo);
 rate.setLsItem("promptDate", oneWeekAgo);
 assert.equal(rate.shouldPrompt() , true);
 rate.clear();
});

QUnit.test("TC17 - Limit: 10u, 7d, 10e ** Weekly: 0u, 20e ** Wait: 400d *-*-*-*  Use: 11u, 10e, 7d - WeekUse: 0u, 10e - Wait: 399d - NO PROMPT", function (assert){
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
 rate.clear();
});

QUnit.test("TC18 - Limit: 10u, 7d, 10e ** Weekly: 0u, 20e ** Wait: 400d *-*-*-*  Use: 11u, 21e, 7d - WeekUse: 0u, 21e - Wait: 400d - PROMPT", function (assert){
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
 rate.clear();
});

QUnit.test("TC19 - Limit: 10u, 7d, 10e ** Weekly: 10u, 20e ** Wait: 0d *-*-*-*  Use: 11u, 21e, 7d - WeekUse: 11u, 19e - Wait: 7d - NO PROMPT", function (assert){
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
 rate.clear();
});

QUnit.test("TC20 - Limit: 10u, 7d, 10e ** Weekly: 10u, 20e ** Wait: 10d *-*-*-*  Use: 11u, 21e, 14d - WeekUse: 11u, 9e - Wait: 14d - NO PROMPT", function (assert){
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
 rate.clear();
});

QUnit.test("TC21 - Limit: 10u, 7d, 10e ** Weekly: 10u, 20e ** Wait: 10d *-*-*-*  Use: 11u, 21e, 14d - WeekUse: 11u, 21e - Wait: 14d - PROMPT", function (assert){
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
 rate.clear();
});

