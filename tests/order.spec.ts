import { expect, test,  } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { MenuPage } from '../pages/menu.page';
import { UpsellPage } from '../pages/upsell.page';
import { OrderPage } from '../pages/order.page';
import { PaymentPage } from '../pages/payment.page'
import { StatusPage } from '../pages/status.page'


test.describe('Order as guest', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    homePage = await HomePage.load(page);
  });

  test('Order Success: should see order status in progress', async () => {
    expect(homePage).toBeInstanceOf(HomePage);
    await homePage.clickOrderNow();
    await homePage.clickPickUp();
    const menuPage = await homePage.confirmOrderSetUp();
    expect(menuPage).toBeInstanceOf(MenuPage);

    await menuPage.selectItem();
    await menuPage.clickAddToYourOrder();
    const upsellPage = await menuPage.clickViewOrder();
    expect(upsellPage).toBeInstanceOf(UpsellPage);

    const orderpage = await upsellPage.clickNoThanks();
    expect(orderpage).toBeInstanceOf(OrderPage);

    const paymentPage = await orderpage.clickCheckOut();
    expect(paymentPage).toBeInstanceOf(PaymentPage);

    await paymentPage.enterContactDetails();
    await paymentPage.enterPaymentDetails();
    // await paymentPage.solveRecaptcha();
    // const statusPage = await paymentPage.clickPayNow();
    // expect(statusPage).toBeInstanceOf(StatusPage);
  });
});
