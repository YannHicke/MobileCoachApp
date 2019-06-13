package org.c4dhi.mobilecoach.client;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import android.os.Bundle;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import org.devio.rn.splashscreen.SplashScreen;
import android.content.pm.ActivityInfo;

public class MainActivity extends ReactActivity {

  /**
    * Returns the name of the main component registered from JavaScript.
    * This is used to schedule rendering of the component.
    */
  @Override
  protected String getMainComponentName() {
    return "MobileCoachClient";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);
    super.onCreate(savedInstanceState);
    setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    Fabric.with(this, new Crashlytics());
  }
}
