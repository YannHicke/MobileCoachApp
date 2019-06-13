import Brand from './Brand'
// leave off @2x/@3x
// Use thrifty, these images are held in memory (require)!
const images = {
  appLogo: Brand.images.logo,
  poweredByLogo: Brand.images.poweredBy,
  coaches: [
    require('../Images/Coaches/coach_male.png'),
    require('../Images/Coaches/coach_female.png')
  ],
  coachGeneric: require('../Images/Coaches/coach_generic.png'),
  chatBg: Brand.images.chatBackground,
  custom: {
    pyramidBg: require('../Images/Coaches/coach_generic.png'),
    pyramidFood: require('../Images/Coaches/coach_generic.png')
  },
  welcomeQr: require('./../Images/Onboarding/welcomeQR.png'),
  icons: {
    bloodPressure: require('../Images/Coaches/coach_generic.png'),
    bloodPressureColored: require('../Images/Coaches/coach_generic.png'),
    robot: require('../Images/Coaches/coach_generic.png')
  },
  misc: {
    panelToggle: require('./../Images/Misc/paneltoggle.png')
  }
}

export default images
