import { AppPage } from './app.po';
import { element, by, $, browser } from 'protractor';

describe('web-app App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should login', () => {
    page.navigateTo();
    element(by.id('email')).sendKeys('test@gmail.com');
    element(by.id('password')).sendKeys('pass');
    $('.btn.btn-success').click();
    expect(element(by.id('logout')).isDisplayed()).toBe(true);
  });

  it('should add new expense', () => {
    browser.get('https://donkeymoney-app.herokuapp.com/operations');
    $('.btn.btn-success').click();
    element(by.name("amount")).sendKeys(10.00);
    element(by.name("description")).sendKeys("e2e");
    $('.btn.btn-primary').click();
    browser.driver.sleep(2 * 1000);
  });
});
