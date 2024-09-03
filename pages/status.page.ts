import { Locator, Page } from "@playwright/test";

export class StatusPage {

  private constructor(
    private readonly headerTitleText: Locator,
    private readonly orderStatusText: Locator,

    private readonly page: Page,
  ) {}

  static async load(page: Page): Promise<StatusPage> {
    const headerTitleTextLocactor = page.getByText('ORDER STATUS');
    const orderStatusTextLocator = page.getByText('IN PROGRESS');

    await Promise.all([
      headerTitleTextLocactor.waitFor(),
      orderStatusTextLocator.waitFor(),
    ]).catch(err => {
      throw 'Order Status Page Loaing Failed !'
    })

    return new StatusPage(
      headerTitleTextLocactor,
      orderStatusTextLocator,
      page,
    );
  }
}
