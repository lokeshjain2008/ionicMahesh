# ionicMahesh
- [link starter angular fire](https://github.com/aaronksaunders/ionic2-angularfire-sample)

### Problems :::
There is a big problem with login with Google, Facebook is not working at all. Firebase is at v3, angularfire is at v2, and ionic is going for v2 and angular is at 2.
There is lot of disconnect.
see this comment

 - [authentication provider is not enabled](https://github.com/angular/angularfire2/issues/189)
 - [They are working](https://github.com/angular/angularfire2/issues/180#issuecomment-220723884)




#### solutions
---
There are many other and beautiful solutions.

- https://www.quora.com/Whats-the-closest-open-source-alternative-to-Firebase
-

---
#### Create

Do it in the steps

- `cordova build --release android`

-  Now create the `keytool change`. That will be used always.
	`keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000`

- `cd platforms/android/build/outputs/apk/`

- `jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../../../../../mahesh-release-key.keystore android-release-unsigned.apk alias_name`

- `~/Library/Android/sdk/build-tools/23.0.3/zipalign  -v 4 android-release-unsigned.apk MaheshCanteen.apk`

- For ADMob links App ID: ca-app-pub-0016905624286295~7021382249
	Ad unit ID: ca-app-pub-0016905624286295/8498115449


To add add support in the app.
https://www.thepolyglotdeveloper.com/2016/02/monetize-google-admob-ionic-2-mobile-app/



