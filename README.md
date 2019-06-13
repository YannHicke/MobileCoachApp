# MobileCoach Client Template

## Run

    react-native run-ios

or

    react-native run-android

## Cleanup

    ./cleanup.sh

If still problems occur:

    ./cleanup.sh hard

## Customization

```
./repackage.sh
./recolor.sh
./reicon.sh
```

### App Configuration:

Mainly in these files:

- `App/Config/AppConfig.js`
- `App/Themes/Brand.js`
- `App/Themes/Colors.js`
- `App/Themes/Fonts.js`
- `App/Themes/Images.js`

### APIs:

**Fabric Crashlytics:**  
API Key in `android/app/src/main/AndroidManifest.xml` and in
`ios/APP_FOLDER/Info.plist`

### Building keys (Android only):

`android/app/build.gradle`

### Versions:

Version and build in `android/app/build.gradle` and in
`ios/APP_FOLDER/Info.plist`

### Automatic formatting in VSCode:

Add the following snippet to your user settings:

```
    "saveAndRunExt": {
        "commands": [
            {
                "match": "\\.js[x]?$",
                "isShellCommand" : true,
                "cmd": "yarn fixfile '${file}'"
            },
            {
                "match": "\\.json?$",
                "isShellCommand" : true,
                "cmd": "yarn fixfile '${file}'"
            },
            {
                "match": "\\.htm[l]?$",
                "isShellCommand" : true,
                "cmd": "yarn fixfile '${file}'"
            },
            {
                "match": "\\.css$",
                "isShellCommand" : true,
                "cmd": "yarn fixfile '${file}'"
            },
            {
                "match": "\\.md$",
                "isShellCommand" : true,
                "cmd": "yarn fixfile '${file}'"
            }

        ]
    }
```

**Version 2.0**
