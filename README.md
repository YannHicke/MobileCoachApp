# MobileCoach Client & Researcher Documentation

This ReadMe file contains the documentation for the setup of the Android and iOS mobile applications for reproducibility. In section (A.1), the steps for setting up the staged applications (from which you can run both Android and iOS apps) are detailed, and in section (A.2), the steps for installing the native Android application reserved for testing purposes are detailed. The documentation starts by defining the appropriate terminology in order to introduce clients, users, or researchers to the necessary background before they begin the system installation phase.

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

&nbsp;&nbsp;&nbsp;

1. Downloading the Repository

    (1.1) Clone the GitHub repository containing the MobileCoach application files by running the following command,

          git clone https://bitbucket.org/mobilecoach/mobilecoach-mobile-app.git,

    in a Terminal window (MacOS) or in a Command Prompt window (Windows OS).

    &nbsp;
    
    (1.2) Now, you should have a folder named `mobilecoach-mobile-app` in your home directory.

&nbsp;&nbsp;&nbsp;

2. Installing all necessary dependencies

   &nbsp;
   
   (2.1) Navigate inside the repository, and execute yarn install to install the Node dependencies.
  
&nbsp;&nbsp;&nbsp;

3. Running the current state of the application

&nbsp;&nbsp;&nbsp;

4. Changing the Conversational Flow in MobileCoach Web Designer

   *Currently, the client has been connected to the PROTOTYPE intervention. This intervention is for the client to add their own conversational flow(s).*

&nbsp;&nbsp;&nbsp;

5. Changing the `interventionPattern` variable in `AppConfig.js` from `PROTOTYPE`

&nbsp;&nbsp;&nbsp;

<img width="392" alt="Fig_1" src="https://media.github.coecis.cornell.edu/user/7644/files/c218ba98-9f7b-48bb-bcb9-4b1351ad1609">

&nbsp;&nbsp;

6. Re-executing the iOS/Android application

   (6.1) The iOS Application
   
   ***![#c5f015](Prerequisites:)** For this step, you will need to have the XCode application installed and an emulator running iOS set up.*

   &nbsp;
   
   (6.1.1) Once inside the mobilecoach-mobile-app repository, run yarn ios.
   
   
   <img width="723" alt="Fig_2" src="https://media.github.coecis.cornell.edu/user/7644/files/c5c0c60d-ba8d-4242-b983-fd29fecd18f2">
   
   &nbsp;
    
   (6.1.2) Run yarn start to allow the application to connect to the application Bundle.

      ***![#f03c15](Warning:)** If you do not perform this step correctly, you will run into a bundle error when opening the application.*


   <img width="721" alt="Fig_3" src="https://media.github.coecis.cornell.edu/user/7644/files/7b917bed-3586-4490-a2cf-f98b95e025ec">

  &nbsp;&nbsp;

  (6.2) The Android Application
  
  For this step, you will need to have the Android Studio application installed and an emulator running Android OS set up.
  
  &nbsp;
  
      (6.2.1) Once inside the mobilecoach-mobile-app repository, run yarn android.
  
      (6.2.2) Run yarn start to allow the application to connect to the application bundle.
    
  &nbsp;

  <img width="636" alt="Fig_4" src="https://media.github.coecis.cornell.edu/user/7644/files/2dfc1b8b-09f3-4ed0-b0b7-5fb83261b394">
  
&nbsp;&nbsp;&nbsp;

## (A.2) Interacting with the Testing Environment [native Android application]
 
*The testing environment, unlike the staging environment, does not require the client to install any dependencies. Rather, they can simply download the testing 
version of the app on Google Play Store and test the application on an Android device.*

&nbsp;

  1. Visit https://play.google.com/apps/internaltest/4701582881664393291, which when clicked on, will download and install the MobileCoach application.
  2. Open the installed MobileCoach application and you may begin using it!

&nbsp;&nbsp;&nbsp;

## (A.3) Releasing an Android app on the Google Play Store

  1. Generating an upload key; execute the following command:
  
      `keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000 `
  
  &nbsp;&nbsp;&nbsp;
  
  2. Setting up gradle variables

     (2.1) Place the `my-upload-key.keystore` in the `android/app` folder.

     (2.2) Edit the file `~/.gradle/gradle.properties` or `android/gradle.properties`, and add the following:
    
          MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
          MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
          MYAPP_UPLOAD_STORE_PASSWORD=*****
          MYAPP_UPLOAD_KEY_PASSWORD=*****
  
  &nbsp;&nbsp;&nbsp;
  
  3. Adding signing config to the app’s Gradle config
 
     (3.1) Edit the file android/app/build.gradle in your project folder, and add the signing config:
    
    
          ...
          android {
             ...
             defaultConfig { ... }
             signingConfigs {
                 release {
                     if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                         storeFile file(MYAPP_UPLOAD_STORE_FILE)
                         storePassword MYAPP_UPLOAD_STORE_PASSWORD
                         keyAlias MYAPP_UPLOAD_KEY_ALIAS
                         keyPassword MYAPP_UPLOAD_KEY_PASSWORD
                     }
                 }
             }
             buildTypes {
                 release {
                     ...
                     signingConfig signingConfigs.release
                 }
             }
          }
          ...

  &nbsp;&nbsp;&nbsp;

  4. Generating the release AAB

      (4.1) Run the following commands in a Terminal window:

            cd android
            ./gradlew bundleRelease
       
      (4.2) The  generated AAB can be found under android/app/build/outputs/bundle/release/app-release.aab and is ready to be uploaded to Google Play.

  &nbsp;&nbsp;&nbsp;
  
  5. Testing the release build of the app

      (5.1) Before uploading the release build to the Play Store, make sure you test it thoroughly. First uninstall any previous version of the app you already           have installed. Install it on the device using the following command in the project root:
      
            npx react-native run-android --variant=release
  
  &nbsp;&nbsp;&nbsp;
  
  6. Creating a developer account on the Google Play console

     (6.1) Navigate to https://play.google.com/.
  
  &nbsp;&nbsp;&nbsp;

  7. Creating the app and follow the steps on the Google Play console

     (7.1) Navigate to the "All Apps" tab.

<hr>
 
# Basic Documentation

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
