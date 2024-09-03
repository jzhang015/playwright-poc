import { Locator, Page } from "@playwright/test";
import { PaymentPage } from "./payment.page";

export class OrderPage {

  private constructor(
    private readonly headerTitle: Locator,
    private readonly gotItLocator: Locator,
    private readonly checkOutLocator: Locator,

    private readonly page: Page,
  ) {}

  static async load(page: Page): Promise<OrderPage> {
    const headerTitleTextLocactor = page.getByText('ORDER SUMMARY');
    const gotItButtonLocator = page.getByText('GOT IT!');
    const checkOutButtonLocator = page.getByText('CHECKOUT');

    await Promise.all([
      headerTitleTextLocactor.waitFor(),
      checkOutButtonLocator.waitFor(),
    ]).catch(err => {
      throw 'Order Summary Page Loaing Failed !'
    })

    return new OrderPage(
      headerTitleTextLocactor,
      gotItButtonLocator,
      checkOutButtonLocator,
      page,
    );
  }

  async clickCheckOut(): Promise<PaymentPage> {
    await this.clickGotItForEstimatedTime();
    await this.checkOutLocator.click();
    return await PaymentPage.load(this.page);
  }

  private async clickGotItForEstimatedTime() {
    if (await this.isGotItDisplayed()) {
      await this.gotItLocator.click();
    }
  }
  private async isGotItDisplayed(): Promise<boolean> {
    return this.gotItLocator.waitFor({
      timeout: 1000,
    })
    .then(() => true)
    .catch(() => false);
  }
}
