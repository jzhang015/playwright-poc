import { Page } from "@playwright/test";

const FIRST_PROMPT_MSG = `We've sent a time-sensitive verification code to your mobile`;
const SECOND_PROMPT_MSG = `Please enter the code to log into your account:`;

export class VerifyAccountPage {

  private constructor(private readonly page: Page) {
  }

  static async load(page: Page): Promise<VerifyAccountPage> {
    const firstPromptLocator = page.getByText(FIRST_PROMPT_MSG);
    const secondPromptLocator = page.getByText(SECOND_PROMPT_MSG);

    await Promise.all([
    
      firstPromptLocator.waitFor(),
      secondPromptLocator.waitFor(),
    ]).catch(err => {
      throw 'Verify-Account Page Loaing Failed !'
    })

    return new VerifyAccountPage(page);
  }

  promptMessage(): string {
    return `${FIRST_PROMPT_MSG}; ${SECOND_PROMPT_MSG}`;
  }
}
