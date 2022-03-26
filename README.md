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

1. Downloading the Repository

    (1.1) Clone the GitHub repository containing the MobileCoach application files by running the following command,

          git clone https://bitbucket.org/mobilecoach/mobilecoach-mobile-app.git,

    in a Terminal window (MacOS) or in a Command Prompt window (Windows OS).


    (1.2) Now, you should have a folder named mobilecoach-mobile-app in your home directory.


2. Installing all necessary dependencies

   (2.1) Navigate inside the repository, and execute yarn install to install the Node dependencies.
  

3. Running the current state of the application


4. Changing the Conversational Flow in MobileCoach Web Designer

*Currently, the client has been connected to the PROTOTYPE intervention. This intervention 
is for the client to add their own conversational flow(s).*


5. Changing the interventionPattern variable in  AppConfig.js  from PROTOTYPE


6. Re-executing the iOS/Android application

   (6.1) The iOS Application
   
   ***Prerequisites:** For this step, you will need to have the XCode application installed and an emulator running iOS set up.*

      (6.1.1) Once inside the mobilecoach-mobile-app repository, run yarn ios.
      
      (6.1.2) Run yarn start to allow the application to connect to the application Bundle.

      ***Warning:** If you do not perform this step correctly, you will run into a bundle error when opening the application.*


  (6.2) The Android Application
  
  For this step, you will need to have the Android Studio application installed and an emulator running Android OS set up.
  
      (6.2.1) Once inside the mobilecoach-mobile-app repository, run yarn android.
  
      (6.2.2) Run yarn start to allow the application to connect to the application bundle.
      

## (A.2) Interacting with the Testing Environment [native Android application]
 
*The testing environment, unlike the staging environment, does not require the client to install any dependencies. Rather, they can simply download the testing 
version of the app on Google Play Store and test the application on an Android device.*

  1. Visit , which by clicking on, will download and install the MobileCoach application.
  2. Open the installed MobileCoach application and you may begin using it!


## (A.3) Releasing an Android app on the Google Play Store

  1. Generating an upload key; execute the following command:
  
      keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
  
  
  2. Setting up gradle variables

     (2.1) Place the my-upload-key.keystore in the android/app folder.

     (2.2) Edit the file ~/.gradle/gradle.properties or android/gradle.properties, and add the following:
    
          MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
          MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
          MYAPP_UPLOAD_STORE_PASSWORD=*****
          MYAPP_UPLOAD_KEY_PASSWORD=*****
  
  
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


  4. Generating the release AAB

      (4.1) Run the following commands in a Terminal window:

            cd android
            ./gradlew bundleRelease
       
      (4.2) The  generated AAB can be found under android/app/build/outputs/bundle/release/app-release.aab and is ready to be uploaded to Google Play.

  
  5. Testing the release build of the app

      (5.1) Before uploading the release build to the Play Store, make sure you test it thoroughly. First uninstall any previous version of the app you already           have installed. Install it on the device using the following command in the project root:
      
            npx react-native run-android --variant=release
  
  
  6. Creating a developer account on the Google Play console

     (6.1) Navigate to https://play.google.com/.
  
  
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
