import './App.css';
import {Component} from 'react';
import axios from 'axios';

declare var ZoomMtg

ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.6/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');




function App() {


  var signatureEndpoint = 'http://zs.zinedu.com'
  var apiKey = 's_XzbkAkTIWfl2lYa4_DiA'
  var meetingNumber
  var role = 0
  var leaveUrl = 'https://main.zinedu.com'
  var userName = 'Chintan'
  var userEmail = 'chintan@zineduclasses.com'
  var passWord = '123456'

  //
  // useEffect(() => {
  //
  //   },[]);
  //

  function getSignature(e) {
    e.preventDefault();

    fetch(signatureEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role
      })
    }).then(res => res.json())
    .then(response => {
      startMeeting(response.signature)
    }).catch(error => {
      console.error(error)
    })
  }

  function startMeeting(signature) {
    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      isSupportAV: true,
      success: (success) => {
        console.log(success)

        ZoomMtg.join({
          signature: signature,
          meetingNumber: meetingNumber,
          userName: userName,
          apiKey: apiKey,
          userEmail: userEmail,
          passWord: passWord,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  return (
    <div className="App">
      <main>
        <h1>Zinedu's Live Class</h1>

        <button onClick={getSignature}>Join Meeting</button>
      </main>
    </div>
  );
}

export default App;
