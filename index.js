/**
 * @format
 */
import 'react-native-polyfill-globals/auto';
import 'react-native-fetch-api';
import 'fast-text-encoding';
import {AppRegistry, Linking} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DelegationChain, DelegationIdentity, ECDSAKeyIdentity } from '@dfinity/identity';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Actor, HttpAgent, toHex } from '@dfinity/agent';
import { createActor, idlFactory } from './src/declarations/backend';
import { createContext } from 'react';
import PolyfillCrypto from 'react-native-webview-crypto';

const Stack=createNativeStackNavigator()
const errors={
    agentCreationErr:"Some error occured while creating agent",
    keygenerationErr:"Some error occured while key pair generation",
    deeplinkErr:"Unable to handle deeplink, inApp browser returned error",
    actorCallingErr:"Unable to call actor, verify the agent creation process"
}

const linking = {
    prefixes: ['nfid://'],
  };
  async function handleLogin(){
    let testing=true
    return new Promise(async(resolve,reject)=>{
      let baseURL=testing?"http://127.0.0.1:4943/?canisterId=bkyz2-fmaaa-aaaaa-qaaaq-cai&":"https://sldpd-dyaaa-aaaag-acifq-cai.icp0.io?"
      let host=testing?"http://127.0.0.1:4943":"https://icp-api.io"
      await ECDSAKeyIdentity.generate({extractable: true}).then(async(keyp)=>{
  
      generatedKeyPair=keyp
      console.log('running handle login', toHex(keyp.getPublicKey().toDer()));
      try {
        const url = `${baseURL}publicKey=${toHex(
          keyp.getPublicKey().toDer(),
        )}`;
        if (await InAppBrowser.isAvailable()) {
          const result = await InAppBrowser.open(url, {
            // iOS Properties
            dismissButtonStyle: 'cancel',
            preferredBarTintColor: '#453AA4',
            preferredControlTintColor: 'white',
            readerMode: false,
            animated: true,
            modalPresentationStyle: 'fullScreen',
            modalTransitionStyle: 'coverVertical',
            modalEnabled: true,
            enableBarCollapsing: false,
            // Android Properties
            showTitle: true,
            toolbarColor: '#6200EE',
            secondaryToolbarColor: 'black',
            navigationBarColor: 'black',
            navigationBarDividerColor: 'white',
            enableUrlBarHiding: true,
            enableDefaultShare: true,
            forceCloseOnRedirection: false,
            animations: {
              startEnter: 'slide_in_right',
              startExit: 'slide_out_left',
              endEnter: 'slide_in_left',
              endExit: 'slide_out_right',
            },
            headers: {
              'my-custom-header': 'my custom header value',
            },
          });
          Linking.addEventListener('url', handleDeepLink);
          await this.sleep(800);
        } else Linking.openURL(url);
      } catch (error) {
        console.log(error);
        // reject(errors.deeplinkErr)
      }
    }).catch((err)=>{
        console.log(err)
      reject(errors.keygenerationErr)
    })
  })
      
    };
  
    async function handleDeepLink(event){
      try{
          const deepLink = event.url;
          const urlObject = new URL(deepLink);
          const delegation = urlObject.searchParams.get('delegation');
          console.log("del",delegation)
          const chain = DelegationChain.fromJSON(
          JSON.parse(decodeURIComponent(delegation)),
          );
          console.log("chain",chain)
          console.log('\ngeneratedKeyPair',generatedKeyPair)
          const middleIdentity = DelegationIdentity.fromDelegation(
          generatedKeyPair,
          chain,
          );
          console.log("midid",middleIdentity)
          
          const agent = new HttpAgent({
          identity: middleIdentity,
          fetchOptions: {
              reactNative: {
              __nativeResponseType: 'base64',
              },
          },
          callOptions: {
              reactNative: {
              textStreaming: true,
              },
          },
          blsVerify: () => true,
          host: 'http://127.0.0.1:4943',
          });
          // let pubKey = toHex(await crypto.subtle.exportKey("pkcs8",middleIdentity._inner._keyPair.publicKey));
          // let priKey = toHex(await crypto.subtle.exportKey("pkcs8",middleIdentity._inner._keyPair.privateKey));
          console.log("agent",agent)
          // let actor =createActor("be2us-64aaa-aaaaa-qaabq-cai",{agent});
          // console.log('actor: ',actor)
          // console.log("whoami func",actor.whoami)
  
          // await actor.whoami()
          // console.log(principle)
          // storeInAsyncStorage("pubkey",pubKey)
          // storeInAsyncStorage("prikey",priKey)
          // storeInAsyncStorage("delegation",delegation)
          // return("successful")
      }catch(err){
          console.log(err)
          return err
      }
      
    };
    export const Context=createContext(null)
const Root=()=>{
  return(
    <Context.Provider value={{handleLogin}}>
        <PolyfillCrypto/>
    <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName='main'>
            <Stack.Screen options={{headerShown:false}} name='main' component={App}/>
        </Stack.Navigator>
    </NavigationContainer>
    </Context.Provider>
  )
}

AppRegistry.registerComponent(appName, () => Root);
