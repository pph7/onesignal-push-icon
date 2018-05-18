var fs     = require('fs-extra');
var path   = require('path');
var ig     = require('imagemagick');
var colors = require('colors');
var _      = require('underscore');
var Q      = require('q');
var argv   = require('minimist')(process.argv);

/**
 * @var {Object} settings - names of the icon image
 */
var settings = {};
settings.ICON_FILE = argv.icon || 'push.png';
settings.SDK = argv.sdk || 'native';

/**
 * Get SDK specific settings
 *
 * @return {Promise} resolves with an array of platforms
 */
var getSDKSettings = function () {
  var deferred = Q.defer();
  var sdkSettings = {
    native : {
      name : 'Android Native',
      iconsPath : 'res/',
      icons : [
        { name : 'drawable-mdpi/ic_stat_onesignal_default.png',  size : 24 },
        { name : 'drawable-hdpi/ic_stat_onesignal_default.png',  size : 36 },
        { name : 'drawable-xhdpi/ic_stat_onesignal_default.png', size : 48 },
        { name : 'drawable-xxhdpi/ic_stat_onesignal_default.png', size : 72 },
        { name : 'drawable-xxxhdpi/ic_stat_onesignal_default.png', size : 96 }
      ]
    },
    unity : {
      name : 'Unity',
      iconsPath : 'Assets/Plugins/Android/OneSignalConfig/res',
      icons : [
        { name : 'drawable-mdpi/ic_stat_onesignal_default.png',  size : 24 },
        { name : 'drawable-hdpi/ic_stat_onesignal_default.png',  size : 36 },
        { name : 'drawable-xhdpi/ic_stat_onesignal_default.png', size : 48 },
        { name : 'drawable-xxhdpi/ic_stat_onesignal_default.png', size : 72 },
        { name : 'drawable-xxxhdpi/ic_stat_onesignal_default.png', size : 96 }
      ]
    },
    cordova : {
      name : 'PhoneGap, Cordova, Ionic',
      iconsPath : 'platforms/android/res/',
      icons : [
        { name : 'drawable-mdpi/ic_stat_onesignal_default.png',  size : 24 },
        { name : 'drawable-hdpi/ic_stat_onesignal_default.png',  size : 36 },
        { name : 'drawable-xhdpi/ic_stat_onesignal_default.png', size : 48 },
        { name : 'drawable-xxhdpi/ic_stat_onesignal_default.png', size : 72 },
        { name : 'drawable-xxxhdpi/ic_stat_onesignal_default.png', size : 96 }
      ]
    },
    ionic : {
      name : 'Ionic Package (Cloud Build)',
      iconsPath : 'resources/android/custom/',
      icons : [
        { name : 'drawable-xxhdpi/ic_stat_onesignal_default', size : 72 }
      ]
    },
    phonegap : {
      name : 'PhoneGap Build (PGB)',
      iconsPath : 'locales/android/',
      icons : [
        { name : 'drawable-mdpi/ic_stat_onesignal_default.png',  size : 24 },
        { name : 'drawable-hdpi/ic_stat_onesignal_default.png',  size : 36 },
        { name : 'drawable-xhdpi/ic_stat_onesignal_default.png', size : 48 },
        { name : 'drawable-xxhdpi/ic_stat_onesignal_default.png', size : 72 },
        { name : 'drawable-xxxhdpi/ic_stat_onesignal_default.png', size : 96 }
      ]
    },
    corona : {
      name : 'Corona',
      iconsPath : './',
      icons : [
        { name : 'IconNotificationDefault-ldpi.png',  size : 16 },
        { name : 'IconNotificationDefault-mdpi.png',  size : 24 },
        { name : 'IconNotificationDefault-hdpi.png',  size : 36 },
        { name : 'IconNotificationDefault-xhdpi.png', size : 48 },
        { name : 'IconNotificationDefault-xxhdpi.png', size : 72 }
      ]
    },
    xamarin : {
      name : 'Xamarin',
      iconsPath : 'Resources/',
      icons : [
        { name : 'drawable-mdpi/ic_stat_onesignal_default.png',  size : 24 },
        { name : 'drawable-hdpi/ic_stat_onesignal_default.png',  size : 36 },
        { name : 'drawable-xhdpi/ic_stat_onesignal_default.png', size : 48 },
        { name : 'drawable-xxhdpi/ic_stat_onesignal_default.png', size : 72 },
        { name : 'drawable-xxxhdpi/ic_stat_onesignal_default.png', size : 96 }
      ]
    }
  };

  if (typeof sdkSettings[settings.SDK] !== 'undefined') {
    display.success('SDK settings found: ' + sdkSettings[settings.SDK].name);
    deferred.resolve(sdkSettings[settings.SDK]);
  } else {
    display.error('No settings found for SDK: ' + settings.SDK);
    deferred.reject();
  }

  return deferred.promise;
};

/**
 * @var {Object} console utils
 */
var display = {};
display.success = function (str) {
  str = '✓  '.green + str;
  console.log('  ' + str);
};
display.error = function (str) {
  str = '✗  '.red + str;
  console.log('  ' + str);
};
display.header = function (str) {
  console.log('');
  console.log(' ' + str.cyan.underline);
  console.log('');
};

/**
 * Resizes, crops (if needed) and creates a new icon in the platform's folder.
 *
 * @param  {Object} platform
 * @param  {Object} icon
 * @return {Promise}
 */
var generateIcon = function (platform, icon) {
  var deferred = Q.defer();
  var srcPath = settings.ICON_FILE;
  var platformPath = srcPath.replace(/\.png$/, '-' + platform.name + '.png');
  if (fs.existsSync(platformPath)) {
    srcPath = platformPath;
  }
  var dstPath = platform.iconsPath + icon.name;
  var dst = path.dirname(dstPath);
  if (!fs.existsSync(dst)) {
    fs.mkdirsSync(dst);
  }
  ig.resize({
    srcPath: srcPath,
    dstPath: dstPath,
    quality: 1,
    format: 'png',
    width: icon.size,
    height: icon.size
  } , function(err, stdout, stderr){
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve();
      display.success(dstPath + ' created');
    }
  });
  if (icon.height) {
    ig.crop({
      srcPath: srcPath,
      dstPath: dstPath,
      quality: 1,
      format: 'png',
      width: icon.size,
      height: icon.height
    } , function(err, stdout, stderr){
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve();
        display.success(icon.name + ' cropped');
      }
    });
  }
  return deferred.promise;
};

/**
 * Generates icons based on the sdk settings
 *
 * @param  {Object} sdkSettings
 * @return {Promise}
 */
var generateIcons = function (sdkSettings) {
  display.header('Generating Push Icons for ' + sdkSettings.name);
  var all = [];
  var icons = sdkSettings.icons;
  icons.forEach(function (icon) {
    all.push(generateIcon(sdkSettings, icon));
  });
  return Promise.all(all);
};

/**
 * Checks if a valid icon file exists
 *
 * @return {Promise} resolves if exists, rejects otherwise
 */
var validIconExists = function () {
  var deferred = Q.defer();
  fs.exists(settings.ICON_FILE, function (exists) {
    if (exists) {
      display.success(settings.ICON_FILE + ' exists');
      deferred.resolve();
    } else {
      display.error(settings.ICON_FILE + ' does not exist');
      deferred.reject();
    }
  });
  return deferred.promise;
};

display.header('Checking Project & Icon');

validIconExists()
  .then(getSDKSettings)
  .then(generateIcons)
  .catch(function (err) {
    if (err) {
      console.log(err);
    }
  }).then(function () {
    console.log('');
  });
