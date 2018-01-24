import { AppPage } from './app.po';
import { element, by, $, $$, browser, ExpectedConditions as until } from 'protractor';

describe('web-app App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should login', () => {
    page.navigateTo();
    element(by.id('email')).sendKeys('donkeymoneyapp@gmail.com');
    element(by.id('password')).sendKeys('12345678');
    $('.btn.btn-success').click();
    browser.wait(until.visibilityOf(element(by.id('logout'))), 25 * 1000);
  });

  it('should add new expense', () => {
    element(by.id('operations')).click();
    element(by.name("amount")).sendKeys(1.23);
    element(by.name("name")).sendKeys("e2e");
    $('.btn.btn-primary').click();
    browser.driver.sleep(2 * 1000);
  });

  it('should edit expense', () => {
    $$('.btn.btn-info').first().click();
    element(by.name("amount")).sendKeys(3.21);
    element(by.name("name")).sendKeys("e2e update");
    $('.btn.btn-primary').click();
    browser.driver.sleep(2 * 1000);
  });

  it('should delete expense', () => {
    $$('.btn.btn-danger').first().click();
    browser.driver.sleep(2 * 1000);
  });

  it('should logout', () => {
    element(by.id('logout')).click();
    browser.wait(until.visibilityOf(element(by.id("login"))), 25 * 1000);
  });
});
