import { Locator, Page } from "@playwright/test";
import { StatusPage } from "./status.page";

export class PaymentPage {

  private constructor(
    private readonly contactDetailsTitle: Locator,
    private readonly cardOption: Locator,
    private readonly cardNumberInput: Locator,
    private readonly cardExpirationInput: Locator,
    private readonly cvvInput: Locator,
    private readonly recaptchaCheckbox: Locator,
    private readonly payNowButton: Locator,

    private readonly page: Page,
  ) {}

  static async load(page: Page): Promise<PaymentPage> {
    const contactDetailsTitleLocator = page.getByText('contact details');
    const cardOptionLocator = page.locator('.braintree-option__card');
    const cardNumberInputLocator = page.locator('#credit-card-number');
    const cardExpirationInputLocator = page.locator('#expiration');
    const cvvInputLocator = page.locator('#cvv');
    const recaptchaCheckboxLocator = page.locator('span[role="checkbox"]');
    const payNowButtonLocator = page.getByTestId('PAY NOW');

    await Promise.all([
      contactDetailsTitleLocator.waitFor({ timeout: 30000 }),
    ]).catch(err => {
      throw 'Payment/Checkout Page Loaing Failed !'
    })

    return new PaymentPage(
      contactDetailsTitleLocator,
      cardOptionLocator,
      cardNumberInputLocator,
      cardExpirationInputLocator,
      cvvInputLocator,
      recaptchaCheckboxLocator,
      payNowButtonLocator,
      page,
    );
  }

  async enterContactDetails() {
    await this.page.getByTestId('TextInput').first().fill('Jie');
    await this.page.locator('[data-testid="TextInput"]').nth(1).fill('Test');
    await this.page.locator('[data-testid="TextInput"]').nth(2).fill('0426966111');
    await this.page.locator('[data-testid="TextInput"]').nth(3).fill('jie@gyg.com.au');
  }

  async enterPaymentDetails() {
    await this.cardOption.click({delay: 2000});
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const cardNumberFrame = this.page.frameLocator('iframe[name="braintree-hosted-field-number"]');
    await cardNumberFrame.locator('#credit-card-number').fill('4111111111111111');
    
    const expirationDateFrame = this.page.frameLocator('iframe[name="braintree-hosted-field-expirationDate"]');
    await expirationDateFrame.locator('.expirationDate').fill('12/28');
    
    const cvvFrame = this.page.frameLocator('iframe[name="braintree-hosted-field-cvv"]');
    await cvvFrame.locator('.cvv').fill('123');
  }

  async solveRecaptcha() {
    const frame = this.page.frameLocator('iframe[title="reCAPTCHA"]');
    await frame.locator('span[role="checkbox"]').click({delay: 1000});
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  async clickPayNow(): Promise<StatusPage> {
    await this.payNowButton.click();
    return await StatusPage.load(this.page);
  }
}
