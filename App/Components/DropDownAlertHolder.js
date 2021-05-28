// This file just holds the instance of DropDownAlert which is embeded in ReduxNavigationjs
// Just a helper File to make the ref accessible everywhere in the App
// see: https://github.com/testshallpass/react-native-dropdownalert/issues/73#issuecomment-330469356

export default class DropDownHolder {
  static dropDown;

  static setDropDown(dropDown) {
    this.dropDown = dropDown;
  }

  static getDropDown() {
    return this.dropDown;
  }
}
