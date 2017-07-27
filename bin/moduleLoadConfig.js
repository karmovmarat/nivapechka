/* moduleLoadConfig.js
 * General JavaScript utilities
 *
 *autor karmov marat
 *2017.06.09
 *
 * MIT License
 */

/*jslint          browser : true,  continue : true,
  devel  : true,  indent  : 2,     maxerr   : 50,
  newcap : true,  nomen   : true,  plusplus : true,
  regexp : true,  sloppy  : true,  vars     : false,
  white  : true
*/
/*global $, moduleLoadConfig */


function moduleLoadConfig() {
'use strict';

    // section settings param TAIMERS INTERVAL ( myInterval: time - msec, and f - callback)
app.use(function(req, res, next) {
  'use strict';
  //11* Загрузка с локального диска базовой конфигурации  *****
  // И отправка запроса на удаленный сервер 
  // Для получения основной конфигурации расписания
  if (!configSchedule) {

    fs.readFile(urlPathToConfig, 'utf8', function(err, data) {
      if (err) {
        throw err;
      }
      configSchedule = JSON.parse(data);
      //     myRequest = anyRequest(configSchedule); // first load
      console.log(configSchedule.timeIntervalMsec + "  первая загрузка");
      // myInterval.setConfig(configSchedule.timeIntervalMsec, myRequest.send);
      myRequest.setConfig(configSchedule);
      myRequest.send();
      console.log('myRequest.getConfig()');
      console.log(myRequest.getConfig());
    });
  }
  //22* Загрузка основной конфигурации в модуль ИНТЕРВАЛ ****
  // и в модуль ЗАПРОС, Установка счетчика для обновления 
  //  основной конфигурации через каждые N раз
  else if (configSchedule.firstLoad || (countRepeatLoadSheduleEvery > 10)) {
    countRepeatLoadSheduleEvery = 0;
    configSchedule = myRequest.getConfig();
    console.log(configSchedule.timeIntervalMsec + "  вторая загрузка");
    myInterval.setConfig(configSchedule.timeIntervalMsec, myRequest.send);
    myRequest.setConfig(configSchedule);
    //configSchedule.firstLoad = false;
    console.log(configSchedule.firstLoad);
  }
  //**********************
  countRepeatLoadSheduleEvery += 1;
  console.log(' countRepeatLoadSheduleEvery  ' + countRepeatLoadSheduleEvery);
  next();
});
//******************* end section settings param TAIMERS INTERVAL



};

module.exports = moduleLoadConfig;












