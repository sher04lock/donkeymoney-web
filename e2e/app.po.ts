import { browser, by, element } from 'protractor';

/**
 * Page Object for E2E tests
 */
export class AppPage {
  navigateTo() {
    return browser.get('https://donkeymoney-app.herokuapp.com/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
