const {Action, NavigationView, ui} = require('tabris');
const AppSectionSelector = require('./AppSectionSelector');

let navigationView = new NavigationView({
  left: 0, top: 0, right: 0, bottom: 0,
  drawerActionVisible: true
}).appendTo(ui.contentView);

ui.drawer.enabled = true;
ui.drawer.append(
  new AppSectionSelector({
    left: 0, top: 16, right: 0, bottom: 0
  })
);
