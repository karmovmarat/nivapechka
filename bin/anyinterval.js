/* anyinterval.js
 * General JavaScript utilities
 *
 *autor karmov marat
 *2017.05.27
 *"version": "0.1.1"
 * MIT License
 *
 */

/*jslint          browser : true,  continue : true,
  devel  : true,  indent  : 2,     maxerr   : 50,
  newcap : true,  nomen   : true,  plusplus : true,
  regexp : true,  sloppy  : true,  vars     : false,
  white  : true
*/
/*global $, anyinterval */

// section TAIMES INTERVAL 

function anyinterval() {
  'use strict';
  var
  //options = 0,
    count = 0,           // count-REQUEST, option.
    timeoutId = 0,       // count, integer
    resolution = false,  // true -start, false - stop.
    time_msec_local,     // undefined,  1000 msec = 1 sec.
    f_myreqhttp_local,   // undefined, callbac function, 
                         // from user http request (type: GET, POST, HEAD, PUT and e.t.c)

    doAgain = function() {
      console.log(count + ': count-REQUEST');
      console.log(' current interval ==  ' + time_msec_local + ': mSEC');

      f_myreqhttp_local();
      if (count < 9999) {
        timeoutId = setTimeout(doAgain, time_msec_local);
        count++;
      } else {
        count = 0;
        timeoutId = setTimeout(doAgain, time_msec_local);
        count++;
      }
    };

  function start(req, res) {
    if (time_msec_local && f_myreqhttp_local) {
      if (timeoutId === 0) {
        timeoutId = setTimeout(doAgain, time_msec_local);
        console.log(' *** Your Timer just is STARTING ! ***');
        res.send(' *** Your Timer just is STARTING ! ***');
        //next();
      } else {
        console.log(' *** Your Timer is RUNNING ! *** ');
        res.send(' *** Your Timer is RUNNING ! *** ');
        //next();
      }
    } else {
      console.log(' *** Your Timer is NOT STARTED - missing config! ***');
      res.send(' *** Your Timer is NOT STARTED - missing config! ***');
      // next();
    }
  };

  function stop(req, res) {

    if (time_msec_local && f_myreqhttp_local) {
      if (timeoutId === 0) {
        console.log('Your Timer is STANDBY !');
        res.send(' *** Your Timer is STANDBY!! ***');
        // next();
      } else {
        console.log(timeoutId + ': ID before');
        clearTimeout(timeoutId);
        timeoutId = 0;
        console.log(timeoutId + ': ID after');
        console.log('Your Timer is STOPPED!');
        res.send(' *** Your Timer is STOPPED!! ***');
        //next();
      }
    } else {
      console.log(' *** Your Timer is NOT STOPPED and NOT STANDBY - missing config! ***');
      res.send(' *** Your Timer is NOT STOPPED and NOT STANDBY - missing config! ***');
      // next();
    }
  };

  function setConfig(time_msec, callbac) {
    time_msec_local = time_msec;
    f_myreqhttp_local = callbac;
  };

  function init() {

  };

  return {
    //sayHello: sayHello
    setConfig: setConfig,
    start: start,
    stop: stop,
    //init: init
  };

};
//************************************************
module.exports = anyinterval;

