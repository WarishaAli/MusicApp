package com.hiphopstreet;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.guichaguri.trackplayer.TrackPlayer;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.brentvatne.react.ReactVideoPackage;
import cl.json.RNSharePackage;
import com.reactnativecommunity.slider.ReactSliderPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.johnsonsu.rnsoundplayer.RNSoundPlayerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

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
            new TrackPlayer(),
            new SplashScreenReactPackage(),
            new ReactNativePushNotificationPackage(),
            new RNCWebViewPackage(),
            new ReactVideoPackage(),
            new RNSharePackage(),
            new ReactSliderPackage(),
            new RNGoogleSigninPackage(),
            new FBSDKPackage(),
            new DocumentPickerPackage(),
            new ImagePickerPackage(),
            new RNDeviceInfo(),
            new AsyncStoragePackage(),
            new RNSoundPlayerPackage(),
          new RNGestureHandlerPackage()
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
