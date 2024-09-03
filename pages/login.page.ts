import { Locator, Page } from "@playwright/test";
import { VerifyAccountPage } from "./verify-account.page";

const EMAIL_INPUT_PLACE_HOLDER = 'Enter your email address';
const PASSWORD_INPUT_PLACE_HOLDER = 'Enter your password';
const LOGIN_BUTTON_TEST_ID = 'primary-black-button';
const LOGIN_FAILURE_WARNING = 'Login details incorrect. Please try again.';

export class LoginPage {

  private constructor(
    private readonly emailLocator: Locator,
    private readonly passwordLocator: Locator,
    private readonly loginLocator: Locator,
    private readonly page: Page,
  ) {}

  static async load(page: Page): Promise<LoginPage> {
    const emailInputLocator = page.getByPlaceholder(EMAIL_INPUT_PLACE_HOLDER);
    const passwordInputLocator = page.getByPlaceholder(PASSWORD_INPUT_PLACE_HOLDER);
    const loginButtonLocator = page.getByTestId(LOGIN_BUTTON_TEST_ID);

    await Promise.all([
      emailInputLocator.waitFor(),
      passwordInputLocator.waitFor(),
      loginButtonLocator.waitFor(),
    ]).catch(err => {
      throw 'Login Page Loaing Failed !'
    })

    return new LoginPage(
      emailInputLocator,
      passwordInputLocator,
      loginButtonLocator,
      page,
    );
  }

  async login(email: string, password: string): Promise<VerifyAccountPage | LoginPage> {
    if (!email || !password) {
      throw 'Empty email or password is unacceptable !';
    }

    await this.emailLocator.fill(email);
    await this.passwordLocator.fill(password);
    await this.loginLocator.click();

    const isLoginFailed = await this.isStillLoginPage();
    return isLoginFailed ? this : VerifyAccountPage.load(this.page);
  }

  async getLoginFailureWarning(): Promise<string | null> {
    const loginFailureLocator = this.page.getByText(LOGIN_FAILURE_WARNING);
    await loginFailureLocator.waitFor();
    return await loginFailureLocator.isVisible() ? LOGIN_FAILURE_WARNING : null;
  }

  private async isStillLoginPage(): Promise<boolean> {
    return this.emailLocator.waitFor({
      state: 'hidden',
      timeout: 5000,
    })
    .then(() => false)
    .catch(() => true);
  }
}
