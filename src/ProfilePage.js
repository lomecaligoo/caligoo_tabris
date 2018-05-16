const {Composite, Page, TextView, ImageView, WebView, Button, TextInput, ui} = require('tabris');

module.exports = class ProfilePage extends Page {

  constructor(properties) {
    super(Object.assign({autoDispose: false}, properties));

    this.profile = this._loadProfile();
    this.editStatus = !this.profile;

    this.createUI();
    this.applyLayout();
    this.applyStyles();
    
  }

  createUI() {
    this.append(
      this.content = new Composite()      
    ); 

    this.content.append(
      new ImageView({id: 'mainImage', image: 'images/profile.png'}),
      new TextView({
        id: 'firstNameLabel',
        text: 'First Name:'
      }),
      new TextInput({
        id: 'firstName',
        text: this.profile ? this.profile.first_name : null,
        enabled: this.editStatus
      }),
      new TextView({
        id: 'lastNameLabel',
        text: 'Last Name:'
      }),
      new TextInput({ 
        id: 'lastName',
        text: this.profile ? this.profile.last_name : null,
        enabled: this.editStatus
      }),
      new TextView({
        id: 'emailLabel',
        text: 'Email:'
      }),
      new TextInput({
        id: 'email',
        text: this.profile ? this.profile.email : null,
        enabled: this.editStatus
      }),
      new Button({id: 'updateProfileButton', text: this.editStatus ? 'Save': 'Edit'})
        .on('select', () => this._updateProfile()),
      /*new TextView({
        id: 'debug',
        text: this.profile == null ? 'NULL' : JSON.stringify(this.profile)
      }),*/
    );
  }

  _loadProfile() {
    var stored = localStorage.getItem('user_profile');
    return stored ? JSON.parse(stored) : null;
  } 

  _updateProfile() {
    if (this.editStatus){
      //save
      this.profile = {
        'first_name': this.find('#firstName').first().text,
        'last_name': this.find('#lastName').first().text,
        'email': this.find('#email').first().text
      } 
      localStorage.setItem('user_profile',JSON.stringify(this.profile));
      this.editStatus = false;
      this.find('#firstName').first().enabled = false;
      this.find('#lastName').first().enabled = false;
      this.find('#email').first().enabled = false;
      this.find('#updateProfileButton').first().text = 'Edit';
      //this.find('#debug').first().text = JSON.stringify(this._loadProfile());
    }else{
      this.find('#firstName').first().enabled = true;
      this.find('#lastName').first().enabled = true;
      this.find('#email').first().enabled = true;
      this.find('#updateProfileButton').first().text = 'Save';
      this.editStatus = true;
    }
  }

  applyLayout() {
    this.content.set({left: 0, top: 'prev() 8', right: 0, bottom: 0});
    this.content.apply({
      '#mainImage': {left: 16, top: 8, right: 16, width: 100, height: 100},
      '#firstNameLabel': {left: 16, top: 'prev() 16', right: 16},
      '#firstName': {left: 16, top: 'prev() 16', right: 16},
      '#lastNameLabel': {left: 16, top: 'prev() 16', right: 16},
      '#lastName': {left: 16, top: 'prev() 16', right: 16},
      '#emailLabel': {left: 16, top: 'prev() 16', right: 16},
      '#email': {left: 16, top: 'prev() 16', right: 16},
      '#updateProfileButton': {left: 16, bottom: 32, right: 16},
      '#debug': {left: 16, top: 'prev() 16', right: 16},
    });
  }

  applyStyles() {
  }

};