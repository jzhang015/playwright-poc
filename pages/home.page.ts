import { Locator, Page } from "@playwright/test";
import { MenuPage } from "./menu.page"

export class HomePage {

  private constructor(
    private readonly orderNowLocator: Locator,
    private readonly headerGreetingLocator: Locator,

    private readonly pickUpLocator: Locator,
    private readonly searchRestaurantsLocator: Locator,
    private readonly orderFromLocator: Locator,
    private readonly confirmLocator: Locator,

    private readonly page: Page,
  ) {}

  static async load(page: Page): Promise<HomePage> {
    const orderNowButtonLocator = page.getByTestId('DashboardOrderNowBtn');
    const headerGreetingLocator = page.locator('.header__account');
    const pickUpButtonLocator = page.getByText('pickup');
    const searchRestaurantsInputLocator = page.getByPlaceholder('Search GYG Restaurants');
    const orderFromButtonLocator = page.getByText('ORDER FROM RESTAURANT');
    const confirmButtonLocator = page.getByText('Confirm');

    await Promise.all([
      orderNowButtonLocator.waitFor(),
      headerGreetingLocator.waitFor(),
    ]).catch(err => {
      throw 'GYG Home Page Loaing Failed !'
    })

    return new HomePage(
      orderNowButtonLocator,
      headerGreetingLocator,
      pickUpButtonLocator,
      searchRestaurantsInputLocator,
      orderFromButtonLocator,
      confirmButtonLocator,
      page,
    );
  }

  async clickOrderNow() {
    await this.orderNowLocator.click();
  }

  async clickPickUp() {
    await this.pickUpLocator.click();
    await this.searchRestaurantsLocator.fill('World Sqaure');
    await this.page.locator('.store-search__store-result').first().click();
    await this.orderFromLocator.click();
  }

  async confirmOrderSetUp(): Promise<MenuPage> {
    await this.confirmLocator.click();

    return await MenuPage.load(this.page);
  }
}
