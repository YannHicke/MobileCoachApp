package org.c4dhi.mobilecoach.client;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import org.reactnative.camera.RNCameraPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.smixx.fabric.FabricPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rnfs.RNFSPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.zmxv.RNSound.RNSoundPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.brentvatne.react.ReactVideoPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativecommunity.webview.RNCWebViewPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNGestureHandlerPackage(),
            new AsyncStoragePackage(),
            new NetInfoPackage(),
            new ReactNativeAudioPackage(),
            new RNCameraPackage(),
            new RNExitAppPackage(),
            new FabricPackage(),
            new RNSpinkitPackage(),
            new RNFetchBlobPackage(),
            new RNFSPackage(),
            new ImageResizerPackage(),
            new RNI18nPackage(),
            new ReactNativePushNotificationPackage(),
            new RNSoundPackage(),
            new SplashScreenReactPackage(),
            new VectorIconsPackage(),
            new ReactVideoPackage(),
            new RNSensitiveInfoPackage(),
            new RNCWebViewPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
