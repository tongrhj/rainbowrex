Rainbow Rex
=====================

[![Join the chat at https://gitter.im/tongrhj/rainbowrex](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/tongrhj/rainbowrex?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

An addictive, fast-paced :rainbow: colour picker game by @tongrhj

* [Play in Browser](http://rainbowrex.herokuapp.com)
* [Android app on Google Play (free)](https://play.google.com/store/apps/details?id=com.sotonggames.rainbowrex&hl=en)

![Rainbow Rex Screenshot](https://lh3.googleusercontent.com/O7fvBAJ_knaILjTDMg1pOJiDCktcK1rbsmhA6-3TDtryZ54jtWY6-UGsEuNrIIGPyUA=h900-rw)

## Development

```
npm install && npm dev
```

## Deployment to Android
See Instructions here: http://ionicframework.com/docs/guide/publishing.html
```
// Alias for keystore: jaredtong
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -tsa http://timestamp.digicert.com -keystore my-release-key.keystore android-release-unsigned.apk jaredtong
// To zipalign
~/Library/Android/sdk/build-tools/23.0.2/zipalign -v 4 android-release-unsigned.apk rainbowRex.apk
```

## Product Roadmap:
1. Port to iOS
1. Colorblind friendly EMOJI mode

### Recently Implemented Features
1. Implement watchify and browserify for JS into ionic serve command
1. Overhaul UI
1. Include loading splashscreen for Android app
