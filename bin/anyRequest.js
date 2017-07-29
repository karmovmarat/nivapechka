/* anyRequest.js
 * General JavaScript utilities
 *
 *autor karmov marat
 *2017.05.27
 *"version": "0.1.1"
 * MIT License
 */

/*jslint          browser : true,  continue : true,
  devel  : true,  indent  : 2,     maxerr   : 50,
  newcap : true,  nomen   : true,  plusplus : true,
  regexp : true,  sloppy  : true,  vars     : false,
  white  : true
*/
/*global $, anyRequest*/

var http = require('http');
//*************************           
function anyRequest(zd) {
    'use strict';

    //  var  options = {},     // *** ????
    var configScheduleOptions, // рабочий массив хранения объектов "options" для запросов
        configScheduleFull, // полученый json объект с основной конфигурацией из удаленного сервера
        length; // длинна массива options (количество запросов)

    function setConfig(optn) { // установка конфигурации options, или configScheduleOptions
        configScheduleOptions = optn;
    }

    function getConfig() { // передача наружу основной конфигурации options, или configScheduleOptions
        if (!configScheduleFull) {
            configScheduleFull = configScheduleOptions;
        }
        return configScheduleFull;
    }

    function getStatusCycle() { // передача наружу состояния серии запросов
        return configScheduleOptions.statusCycle;
    }
    // ********* BEGIN FUNCTION SEND *****
    function send(req, res) {

        if (configScheduleOptions) {
            console.log(configScheduleOptions);
            configScheduleOptions.statusCycle = true; // серия запросов продолжается - true
            console.log('********  серия запросов началась *******');
            // Длина массива (кол-во адресов для запросов)
            length = configScheduleOptions.options.length;
            // обход адресов в цикле. Ме­тод forEach() пе­ре­дает функции три ар­гу­мен­та: 
            // зна­че­ние эле­мен­та мас­си­ва - configS, ин­декс эле­мен­та - i и сам мас­сив - a.
            configScheduleOptions.options.forEach(function(configS, i, a) {
                var str = '';
                var myJson;
                var myreq = http.request(configS, (res) => {
                    console.log(`STATUS: ${res.statusCode}`);
                    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

                    res.setEncoding('utf8');
                    res.on('data', (chunk) => {
                        str += chunk;
                        console.log(`BODY: ${chunk}`);
                    });
                    res.on('end', () => {
                        console.log('No more data in response.');
                        if (configS.typejson && res.statusCode === 200) {
                            configScheduleFull = JSON.parse(str);
                            console.log('******** РАСПАРСЕН в configScheduleFull  *******');
                            console.log(configS.typejson);
                        }
                        if ((length - 1) === i) {
                            configScheduleOptions.statusCycle = false; // серия запросов закончилась - false
                            console.log('********  серия из ' + length + ' запроса(ов) завершилась *******');
                        }
                        console.log('  **************** ' + i + ' configScheduleFULL  из anyRequest.js');
                        console.log('100500');
                    });

                });
                myreq.on('error', (e) => {
                    console.log('777 problem with request: ${e.message}');
                });
                // write data to request body
                // myreq.write("");
                myreq.end();
            });
        } else {
            return console.log(' configScheduleOptions видимо пустой');
        }
    }
    //********* END FUNCTION SEND *****

    return {
        send: send,
        setConfig: setConfig,
        getConfig: getConfig,
        getStatusCycle: getStatusCycle
    };

}
module.exports = anyRequest;