import * as Animatable from 'react-native-animatable';

export const rotateLeft = {
  0: {
    rotate: '0deg',
  },
  1: {
    rotate: '45deg',
  },
};

export const rotateBack = {
  0: {
    rotate: '45deg',
  },
  1: {
    rotate: '0deg',
  },
};

export const customZoomOut = {
  from: {
    opacity: 1,
    scale: 1,
    rotate: '0deg',
  },
  0.5: {
    opacity: 0.4,
    scale: 0.3,
    rotate: '-45deg',
  },
  to: {
    opacity: 0,
    scale: 0,
    rotate: '-90deg',
  },
};

export const customFadeInUp = {
  from: {
    translateY: 40,
  },
  to: {
    translateY: 0,
  },
};

export const customFadeOutDown = {
  from: {
    translateY: 0,
  },
  to: {
    translateY: 40,
  },
};

export const zoomFadeOut = {
  from: {
    opacity: 1,
    scale: 1,
  },
  to: {
    opacity: 0,
    scale: 0.95,
  },
};

export const zoomPopIn = {
  from: {
    opacity: 0,
    scale: 0.9,
  },
  0.8: {
    opacity: 1,
    scale: 1.1,
  },
  to: {
    opacity: 1,
    scale: 1,
  },
};

Animatable.initializeRegistryWithDefinitions({
  rotateLeft,
  rotateBack,
  customZoomOut,
  customFadeInUp,
  customFadeOutDown,
  zoomFadeOut,
  zoomPopIn,
});
