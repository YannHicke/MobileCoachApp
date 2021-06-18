# MobileCoach Client Template

## Development Tools

    As convention we always use yarn (you can also use npm, but just don't mix both and makes sure to never have both lockfiles).
    Just install yarn as a global npm module (https://classic.yarnpkg.com/en/docs/install/#mac-stable))
## Install Node Dependencies

    yarn install or just yarn
## Run

    yarn android

or

    yarn ios

## Clean Native Projects

    yarn clean:android 

or

    yarn clean:ios

### App Configuration:

Mainly in these files:

- `App/Config/AppConfig.js`
- `App/Themes/Brand.js`
- `App/Themes/Colors.js`
- `App/Themes/Fonts.js`
- `App/Themes/Images.js`

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
