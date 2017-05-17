'use strict';

const _mergeWith = require('lodash/mergeWith');

const DEV_ENV = 'development';
const DEF_HOST_PREFIX = 'development';
const DEV_CONFIG = 'development';
const PROD_CONFIG = 'production';
const NODE_ENV = process.env.NODE_ENV || DEV_ENV;
const HOST_PREFIX = process.env.HOST_PREFIX || DEF_HOST_PREFIX;
const DEV = ( NODE_ENV === DEV_ENV );

const mainConfig = DEV ? DEV_CONFIG : PROD_CONFIG;
const hostRe = /#\{host\}/g;

const mainConfigPath = `../config/${mainConfig}`;
const appConfigPath = `../config/${HOST_PREFIX}`;

let config = require(mainConfigPath), appConfig;

if (DEV) {

  let host = HOST_PREFIX.split('.')[0]; // the part of the HOST_PREFIX before first point
  config = JSON.parse(
    JSON.stringify(config).replace(hostRe, host)
  )

  if (HOST_PREFIX !== DEF_HOST_PREFIX) {
    // with safety importing app config
    try { 
      appConfig = require(appConfigPath); 
    } catch (err) { 
       if (err.code !== 'MODULE_NOT_FOUND') {
         throw err
       }
    };

    // merging base config with an app config
    if (appConfig) {
      console.log(`Merging config <${mainConfigPath}> with <${appConfigPath}>`);
      _mergeWith(config, appConfig, (ov, sv) => {
        if (ov && Array.isArray(ov)) return ov.concat(sv);
      });
    }
  }
}

module.exports = config;
