const {Composite, Page, TextView, ImageView, WebView, ui} = require('tabris');

module.exports = class AboutPage extends Page {

  constructor(properties) {
    super(Object.assign({autoDispose: false}, properties));
    this.createUI();
    this.applyLayout();
    this.applyStyles();
  }

  createUI() {
    this.append(
      this.content = new Composite()      
    );
    this.content.append(
      new ImageView({id: 'mainImage', image: 'images/caligoo@2x.png'}),
      new TextView({id: 'mainContent', text: '© 2018 CALIGOO INC.', alignment: 'center'})
    );
  }

  applyLayout() {
    this.content.set({left: 0, top: 'prev() 8', right: 0, bottom: 0});
    this.content.apply({
      '#mainImage': {left: 8, top: 8, right: 8},
      '#mainContent': {left: 16, bottom: 32, right: 16}
    });
  }

  applyStyles() {
  }

};