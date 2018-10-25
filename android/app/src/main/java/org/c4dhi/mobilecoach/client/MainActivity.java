package org.c4dhi.mobilecoach.client;

import com.facebook.react.ReactActivity;
import android.content.Intent;
import android.content.res.Configuration;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "MobileCoachClient";
    }

    // ADDED FOR REACT-NATIVE ORIENTATION - START
    @Override
     public void onConfigurationChanged(Configuration newConfig) {
       super.onConfigurationChanged(newConfig);
       Intent intent = new Intent("onConfigurationChanged");
       intent.putExtra("newConfig", newConfig);
       this.sendBroadcast(intent);
   }
   // ADDED FOR REACT-NATIVE ORIENTATION - END
}
