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
  var currentlocation = window.location.href;
try{
  var b = currentlocation.split('=');
  console.log(b);
  let id = b[b.length -1];
  console.log(id);
}
catch{
  console.log("Invalid URL");
}
  async function getdata(){
    var requestOptions1 = {
     redirect: 'follow',
     headers:{
         'Accept': 'application/json',
         'Content-Type': 'application/json',
     },
    };
    const resp = await axios.get('https://ap.zinedu.com/student/get-live-class-join-status/?status_id='+id,requestOptions1)
  return(resp.data);
  }
  async function main() {
    let abc = await getdata();
    console.log(abc);
    let meetinglink  = abc.live_class_assoc.live_class_link;
    console.log(meetinglink);
    try{
      meetingNumber = meetinglink.split('/')[4];
        console.log(meetingNumber);
    }
    catch{
      alert('meeting number not correct');
    }
    if(abc.is_disabled=="Yes"){
      alert('Already in this meeting with this user');
      window.location.href = 'https://main.zinedu.com/';
    }
    userName = abc.student_assoc.name;
    mobilenumber = abc.student_assoc.mobile_number;
    liveclassid = abc.live_class_assoc.id;
    var formdata = new FormData();
    formdata.append('is_disabled',"Yes");
    var requestOptions = {
       method: 'PUT',
       body: formdata,
       redirect: 'follow',
       headers:{
           // 'Authorization': 'Token '+ this.state.token
       },
     };
    fetch('https://ap.zinedu.com/student/update-live-class-join-status/'+id+'/',requestOptions)
    .then(response => response.json())
    .then(json => {console.log(json.Success);

       })
      .catch(error => {
        console.log(error);
    });
  }
  main();


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
