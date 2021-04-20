// Client ID and API key from the Developer Console
var SHEET_ID = '1bt_HyPQHIFkGvspWv7JVGn--RghFyyeprkw4kEbXnlM';
var CLIENT_ID = '558640850297-6eb63kf1lv4ot8v6erem7ltlov0gdons.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDhSOBf84ka9Bv1E8sYQxAz6cXpp1jiZEc';
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    getInitData();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function getInitData() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Categories!A2:A119',
  }).then(function(response) {
    var range = response.result.values;
    range.forEach((item, i) => {
      categories.push(item[0]);
    });
  }, function(response) {
    console.log('error' + response);
  });
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Payees!A:A',
  }).then(function(response) {
    var range = response.result.values;
    range.forEach((item, i) => {
      payees.push(item[0]);
    });
  }, function(response) {
    console.log('error' + response);
  });
}
function addPayee(value){
  addRows('Payees!A:A',[[value]],false);
}
function addRows(range,values,isfinal) {
     var params = {
       spreadsheetId: SHEET_ID,
       range: range,
       valueInputOption: 'USER_ENTERED',
       insertDataOption: 'INSERT_ROWS',
     };

     var valueRangeBody = {
        "values": values
     };

     var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
     request.then(function(response) {
       // TODO: Change code below to process the `response` object:
       console.log(response.result);
       state |= true;
       if(isfinal && state){
         document.getElementById('suc').style.top='0px';
         state = false;
       }
     }, function(reason) {
       console.error('error: ' + reason.result.error.message);
     });
   }
