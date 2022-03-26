# MobileCoach Client Template

## Terminology

| Term | Definition |
| --- | --- |
| Coach/Agent | The chatbot system interacting with the user of the MobileCoach application. |
| User | The individual interacting with the chatbot system by entering queries. |
| Digital Intervention | A series of communication messages between the user and the chatbot coach. |
| MobileCoach Web Designer | The server platform we hosted on the Cornell server. Controls the interaction between the user and the chatbot. |
| Configuration File | A .json file that contains a list of initial parameters and settings a project will need to get started.  |
| Yarn | A powerful package manager used to install dependencies for building the mobile applications.  |
| Dependency | An essential functionality, library or piece of code that is essential for a specific part of the code to work.  |
| Metro Bundler | A packager that starts up when building and running React Native project. It combines all the JavaScript files into a single file, translates it for the device, and converts assets into objects that can be displayed by an image component.  |

## (A.1) Interacting with the Staging Environment [iOS & Android Apps via Emulator]

1.   Downloading the Repository

    (1.1) Clone the GitHub repository containing the MobileCoach application files by running the following command,

          git clone https://bitbucket.org/mobilecoach/mobilecoach-mobile-app.git,

    in a Terminal window (MacOS) or in a Command Prompt window (Windows OS).


    (1.2) Now, you should have a folder named mobilecoach-mobile-app in your home directory.




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
