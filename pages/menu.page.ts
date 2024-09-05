import { Locator, Page } from "@playwright/test";
import { UpsellPage } from "./upsell.page";

export class MenuPage {

  private constructor(
    private readonly burritosLocator: Locator,
    private readonly headerLocator: Locator,
    private readonly itemOnlyLocator: Locator,
    private readonly chickenLocator: Locator,
    private readonly spicyLocator: Locator,
    private readonly addToCartLocator: Locator,
    private readonly gotItLocator: Locator,
    private readonly cartIconLocator: Locator,

    private readonly page: Page,
  ) {}

  static async load(page: Page): Promise<MenuPage> {
    const burritosMenuLocator = page.getByTestId('MenuListItem-Burritos');
    const headermenuLocator = page.getByTestId('scrollable-header-white');
    const itemOnlyButtonLocator = page.getByTestId('0RadioItem');
    const chickenButtonLocator = page.getByTestId('Grilled ChickenRadioItem');
    const spicyButtonLocator = page.getByTestId('SpicyRadioItem');
    const addToCartButtonLocator = page.getByTestId('PrimaryAddItemToCartButton');
    const gotItButtonLocator = page.getByText('GOT IT!');
    const cartIconButtonLocator = page.getByTestId('cart-yellow-button');

    await Promise.all([
      headermenuLocator.waitFor(),
      burritosMenuLocator.waitFor(),
    ]).catch(err => {
      throw 'Menu Page Loaing Failed !'
    })

    return new MenuPage(
      burritosMenuLocator,
      headermenuLocator,
      itemOnlyButtonLocator,
      chickenButtonLocator,
      spicyButtonLocator,
      addToCartButtonLocator,
      gotItButtonLocator,
      cartIconButtonLocator,
      page,
    );
  }

  async selectItem() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await this.burritosLocator.click({delay: 1000});
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await this.itemOnlyLocator.click({delay: 1000});
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await this.chickenLocator.click({delay: 1000});
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await this.spicyLocator.click({delay: 1000});
  }

  async clickAddToYourOrder() {
    await this.addToCartLocator.click();
    await this.clickGotItForEstimatedTime();
  }

  async clickViewOrder(): Promise<UpsellPage> {
    await this.cartIconLocator.click();
    return await UpsellPage.load(this.page);
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
