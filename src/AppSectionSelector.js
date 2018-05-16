const {Composite, ImageView, TextView, ui} = require('tabris');
const AboutPage = require('./AboutPage');
const WifiPage = require('./WifiPage');
const ProfilePage = require('./ProfilePage');

const SECTION_DATA = [{
  title: 'Profile',
  drawerIcon: 'images/profile.png',
  page: function(){ return new ProfilePage(); }
}, {
  title: 'WiFi',
  drawerIcon: 'images/wifi.png',
  page: function(){ return new WifiPage(); }
}, {
  title: 'About',
  drawerIcon: 'images/caligoo.png',
  page: function(){ return new AboutPage(); }
}];

module.exports = class AppSectionSelector extends Composite {

  constructor(properties) {
    super(properties);
    this._createUI();
    this._applyLayout();
    this._applyStyles();
  }

  _createUI() {
    this.append(
      SECTION_DATA.map(data =>
        new Composite({class: 'sectionEntry', highlightOnTouch: true}).append(
          new ImageView({class: 'image', image: data.drawerIcon}),
          new TextView({class: 'sectionTitle', text: data.title})
        ).on('tap', () => this._open(data.page()))
      )
    );
    this._open(SECTION_DATA[0].page());
  }

  _open(page) {
    let navigationView = ui.find('NavigationView').first();
    navigationView.pageAnimation = 'none';
    tabris.ui.drawer.close();
    navigationView.pages().dispose();
    page.appendTo(navigationView);
    navigationView.pageAnimation = 'default';
  }

  _applyLayout() {
    this.apply({
      '.sectionEntry': {left: 0, top: 'prev()', right: 0, height: device.platform === 'iOS' ? 40 : 48},
      '.image': {left: 16, top: 10, bottom: 10},
      '.sectionTitle': {left: 72, centerY: 0}
    });
  }

  _applyStyles() {
    this.apply({
      '.sectionTitle': {
        font: device.platform === 'iOS' ? '17px .HelveticaNeueInterface-Regular' : 'medium 14px',
        textColor: device.platform === 'iOS' ? 'rgb(22, 126, 251)' : '#212121'
      }
    });
  }

};