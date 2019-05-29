import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import firebase  from  'firebase';


class LoginScreen extends Component {

     isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
      }


     onSignIn = googleUser => {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!this.isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken,
                );
            // Sign in with credential from the Google user.
            firebase.auth().signInAndRetrieveDataWithCredential(credential)
            .then(
                function(result){
                console.log('user signed in');
                if(result.additionalUserInfo.isNewUser)
                {
                  firebase.database().ref('/users/'+ result.user.uid).set({
                    gmail: result.user.email,
                    profilPicture: result.additionalUserInfo.profile.picture,
                    locale: result.additionalUserInfo.profile.locale,
                    firstName: result.additionalUserInfo.profile.given_name,
                    lastName: result.additionalUserInfo.profile.family_name,
                    createdAt: Date.now(),
                  })
                  .then(function(snapshor){
                    //
                  })
                }else{
                  firebase.database().ref('/users/'+ result.user.uid).update({
                    lastLoggedIn: Date.now()
                  })
                }

            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
          } else {
            console.log('User already signed-in Firebase.');
          }
        }.bind(this));
      };





     signInWithGoogleAsync = async ()=>{
        try{
            
            const clientId = '173882404308-rn3heh5858h3563ig1dehccm54ueeo4m.apps.googleusercontent.com';//isoClientId

             //const clientId = '173882404308-tsu3puci6ncdl08e9q4poqj6f0at0nv3.apps.googleusercontent.com'; //web
            const result = await Expo.Google.logInAsync({ clientId });
            if (result.type === 'success') {
                clientId2 =clientId;
                abc = result.accessToken;

                this.onSignIn(result);
                console.log(result.user);
                console.log('accessToken:', result.accessToken);
                console.log('type:', result.type);
                return result.accessToken;
                /* Log-Out */
                // await Expo.Google.logOutAsync({ clientId, accessToken });
                /* `accessToken` is now invalid and cannot be used to get data from the Google API with HTTP requests */
              }
              else{
                console.log('type:', type)
                  return {cancelled:true};

              }
        }
        catch(e){
            return {error:true};
        }
    }

    render() {
        return (
            <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>


              <Button title='Login Google' onPress = {()=> this.signInWithGoogleAsync()} />
              <Text>
                WelcomeScreen:
              </Text>
              <Button title='Continue without logging' onPress = {()=> this.props.navigation.navigate('Dashboard') } />
            </View>
            
          );
    }

}


export default LoginScreen;