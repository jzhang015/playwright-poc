import { Locator, Page } from "@playwright/test";
import { OrderPage } from "./order.page";

export class UpsellPage {

  private constructor(
    private readonly headerTitleLocator: Locator,
    private readonly noThanksLocator: Locator,

    private readonly page: Page,
  ) {}

  static async load(page: Page): Promise<UpsellPage> {
    const headerTitleTextLocator = page.getByText('WOULD YOU LIKE TO ADD?');
    const noThanksButtonLocator = page.getByText('NO, THANKS');

    await Promise.all([
      headerTitleTextLocator.waitFor(),
      noThanksButtonLocator.waitFor(),
    ]).catch(err => {
      throw 'Upsell Page Loaing Failed !'
    })

    return new UpsellPage(
      headerTitleTextLocator,
      noThanksButtonLocator,
      page,
    );
  }

  async clickNoThanks(): Promise<OrderPage> {
    await this.noThanksLocator.click();
    return await OrderPage.load(this.page);
  }

}
