const {Composite, Page, TextView, ImageView, WebView, Button, AlertDialog, ui} = require('tabris');

const postJSON = function(url, data) {
  return fetch(url, {
    body: JSON.stringify(data),
    cache: 'no-cache',
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
    redirect: 'follow'
  })
  .then(response => response.json())
}

module.exports = class WifiPage extends Page {

  constructor(properties) {
    super(Object.assign({autoDispose: false}, properties));
    this.createUI();
    this.applyLayout();
    this.applyStyles();
    this._updateNwStatus();
  }

  createUI() {
    this.append(
      this.content = new Composite()
    );
    this.content.append(
      new ImageView({id: 'mainImage', image: 'images/wifi.png'}),
      new TextView({id: 'nwStatus', text: 'Status: Unknown'}),
      new TextView({id: 'nwUsername', text: 'Username: Unknown'}),
      new TextView({id: 'nwIP', text: 'IP Address: Unknown'}),
      new TextView({id: 'nwMAC', text: 'MAC Address: Unknown'})
    );
    this.content.append(
      new Button({id: 'nwAction', text: 'Refresh'})
        .on('select', () => this._networkAction())
    );    
  }

  _updateNwStatus(next) {
    this._wifiStatus((s) => {
      if (!s.wifi){
        this.find('#nwStatus').first().text = 'Status: Not Connected to WiFi';
        this.find('#nwUsername').first().text = '';
        this.find('#nwIP').first().text = '';
        this.find('#nwMAC').first().text = '';
        this.find('#nwAction').first().text = 'Refresh';
      }else{
        if (!s.caligoo){
          this.find('#nwStatus').first().text = 'Status: Connected to Private WiFi';
          this.find('#nwUsername').first().text = '';
          this.find('#nwIP').first().text = '';
          this.find('#nwMAC').first().text = '';
          this.find('#nwAction').first().text = 'Refresh';
        }else{
          this.find('#nwStatus').first().text = 'Status: Connected to Caligoo WiFi';
          this.find('#nwUsername').first().text = s.whoami.username ? 'Username: '+s.whoami.username : 'Not Logged In';
          this.find('#nwIP').first().text = 'IP Address: '+s.whoami.ip;
          this.find('#nwMAC').first().text = 'MAC Address: '+s.whoami.mac;
          this.find('#nwAction').first().text = s.whoami.username ? 'Logout' : 'Login';
        }
      }
      if (next) next(s);
    });
  }

  _wifiStatus(callback) {
    var WIFI_STATUS = {
      wifi: false,
      caligoo: false,
      whoami: null
    }
    let state = navigator.connection.type;
    if (state && state == window.Connection.WIFI){
      WIFI_STATUS.wifi = true;
      fetch('https://aaa.caligoo.com/whoami')
      .then(response => response.json())
      .then((json) => {
        WIFI_STATUS.caligoo = true;
        WIFI_STATUS.whoami = json.clientResponse;
        callback(WIFI_STATUS);
      }).catch((err) => {
        WIFI_STATUS.caligoo = false;
        WIFI_STATUS.whoami = null;
        callback(WIFI_STATUS);
      });
    }else{
      callback(WIFI_STATUS);
    }
  }

  _networkAction() {
    this._updateNwStatus((s) => {
      if (s.caligoo && s.whoami){
        if (s.whoami.username){
          this._logout();
        }else{
          this._login();
        }
      }
    });
  }

  _loadProfile() {
    var stored = localStorage.getItem('user_profile');
    return stored ? JSON.parse(stored) : null;
  }

  _login() {
    var profile = this._loadProfile();
    var self = this;
    if (profile == null || profile.email == null){
      new AlertDialog({
        title: 'Error',
        message: 'You must have a valid E-Mail Address'
      }).open();
      return;
    }
    postJSON('https://aaa.caligoo.com/account', {
      seed: profile.email,
      metadata: { first_name: profile.first_name, last_name: profile.last_name, email: profile.email, source: 'Mobile App' }
    }).then(data => {
      if (data.clientResponse && data.clientResponse.username){
        //We've got a username!
        postJSON('https://aaa.caligoo.com/login', {username: data.clientResponse.username})
        .then(data => {
          if (!(data.clientResponse && data.clientResponse.username)){
            new AlertDialog({
              title: 'Error',
              message: JSON.stringify(data)
            }).open();
          };
          self._updateNwStatus();
        }).catch(error => {
          new AlertDialog({
            title: 'Error',
            message: JSON.stringify(error)
          }).open();
        })
      }else{
        new AlertDialog({
          title: 'Error',
          message: JSON.stringify(data)
        }).open();
      }
    }).catch(error => {
      new AlertDialog({
        title: 'Error',
        message: JSON.stringify(error)
      }).open();
    })
  }

  _logout() {
    var self = this;
    postJSON('https://aaa.caligoo.com/logout', {})
        .then(data => {
          if (!(data.errorCode == 0)){
            new AlertDialog({
              title: 'Error',
              message: JSON.stringify(data)
            }).open();
          };
          self._updateNwStatus();
        }).catch(error => {
          new AlertDialog({
            title: 'Error',
            message: JSON.stringify(error)
          }).open();
        });
  }

  applyLayout() {
    this.content.set({left: 0, top: 'prev() 8', right: 0, bottom: 0});
    this.content.apply({
      '#mainImage': {left: 16, top: 8, right: 16, width: 100, height: 100},
      '#nwStatus': {left: 16, top: 160, right: 16},
      '#nwUsername': {top: 'prev() 16', left: 16, right: 16},
      '#nwIP': {top: 'prev() 16', left: 16, right: 16},
      '#nwMAC': {top: 'prev() 16', left: 16, right: 16},
      '#nwAction': {bottom: 32, left: 16, right: 16}
    });
  }

  applyStyles() {
    
  }
};