# onesignal-push-icon

Automatic android push icon generation for the OneSignal push notification platform as described here: [Android Notification Icons](https://documentation.onesignal.com/v3.0/docs/customize-notification-icons)

Create an icon in the root folder of your project and use onesignal-push-icon to automatically resize and copy it for the android platform and the SDK you are using.

### Installation

```bash
$ sudo apt-get install imagemagick
$ # on Mac: brew install imagemagick
$ # on Windows: http://www.imagemagick.org/script/binary-releases.php#windows (check "Legacy tools")

$ sudo npm install onesignal-push-icon -g
```

### Requirements

- **ImageMagick installed**

### Usage

Create a `push.png` file in the root folder of your project.

To create the push icons for android native run:

     $ onesignal-cordova-icon

The different sizes of the push notification will then be created with the appropriate paths and filenames.

You also can specify an SDK or a location for the icon file manually:

     $ onesignal-cordova-icon --sdk=cordova --icon=mypush.png

Available values for the`--sdk` option:

        --sdk=native    Android Native (default)
        --sdk=unity     Unity
        --sdk=cordova   PhoneGap, Cordova, Ionic
        --sdk=ionic     Ionic Package (Cloud Build)
        --sdk=phonegap  PhoneGap Build (PGB)
        --sdk=corona    Corona
        --sdk=xamarin   Xamarin

For good results, your file should be:

- square
- at least 96\*96 (512\*512px recommended to be future-proof)

**Note:** Android 5.0+ enforces your icon to only be white and transparent however it still allows tinting on the notification shown in the shade, known as the "accent color" (see [Small Icon Accent Color](https://documentation.onesignal.com/v3.0/docs/customize-notification-icons#section-small-icon-accent-color)).

### Creating a cordova-cli hook

Since the execution of cordova-icon is pretty fast, you can add it as a cordova-cli hook to execute before every build.
To create a new hook, go to your cordova project and run:

    $ mkdir hooks/after_prepare
    $ vi hooks/after_prepare/onesignal-cordova-icon.sh

Paste the following into the hook script:

    #!/bin/bash
    onesignal-cordova-icon

Then give the script +x permission:

    $ chmod +x hooks/after_prepare/onesignal-cordova-icon.sh

That's it. Now every time you `cordova build`, the icons will be auto generated.

### Credits

This project is based on [cordova-icon](https://github.com/AlexDisler/cordova-icon) by Alex Disler (https://github.com/AlexDisler).

### License

MIT
