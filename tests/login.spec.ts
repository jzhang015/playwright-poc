import { expect, test,  } from '@playwright/test';
import { getTestUser, TestUser } from '../utils/login.svc';
import { LoginPage } from '../pages/login.page';
import { VerifyAccountPage } from '../pages/verify-account.page';

const INVALID_USER_EMAIL = 'whatever-invalid-user-name@domain.com';
const INVALID_USER_PASSWORD = 'whatever-invalid-user-password';

const VERIFY_ACCOUNT_PROMPT_TEXT = `We've sent a time-sensitive verification code to your mobile; Please enter the code to log into your account:`;
const LOGIN_FAILURE_WARNING = 'Login details incorrect. Please try again.'

test.describe('Login', () => {
  let validTestUser: TestUser;
  let loginPage: LoginPage;

  test.beforeAll(() => {
    validTestUser = getTestUser();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/authenticate');
    loginPage = await LoginPage.load(page);
  });

  test('Login Success: should further ask the user to verify their account', async () => {
    const { email, password } = validTestUser;
    const pageAfterLogin = await loginPage.login(email, password);
    expect(pageAfterLogin).toBeInstanceOf(VerifyAccountPage);

    const verifyAccountPage = pageAfterLogin as VerifyAccountPage;
    expect(verifyAccountPage.promptMessage()).toContain(VERIFY_ACCOUNT_PROMPT_TEXT);
  });

  test.skip('Login Failure: should display the generic `Login details incorrect` warning, given the wrong username', async () => {
    const pageAfterLogin = await loginPage.login(INVALID_USER_EMAIL, validTestUser.password);
    expect(pageAfterLogin).toBeInstanceOf(LoginPage);

    const failedLoginPage = pageAfterLogin as LoginPage;
    const failedLoginMsg = await failedLoginPage.getLoginFailureWarning();
    expect(failedLoginMsg).toEqual(LOGIN_FAILURE_WARNING)
  });

  test.skip('Login Failure: should display the generic `Login details incorrect` warning, given the wrong password', async () => {
    const pageAfterLogin = await loginPage.login(validTestUser.email, INVALID_USER_PASSWORD);
    expect(pageAfterLogin).toBeInstanceOf(LoginPage);

    const failedLoginPage = pageAfterLogin as LoginPage;
    const failedLoginMsg = await failedLoginPage.getLoginFailureWarning();
    expect(failedLoginMsg).toEqual(LOGIN_FAILURE_WARNING)
  });
});
