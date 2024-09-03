type TestUser = {
  email: string,
  password: string,
};

const DUMMY_USER = 'dummy_user@xyz.com';
const DUMMY_PASSWORD = 'dummy_user_password';

function getTestUser(): TestUser {
  const email = process.env.TEST_EMAIL || DUMMY_USER;
  const password = process.env.TEST_PASSWORD || DUMMY_PASSWORD;

  return {
    email,
    password,
  }
}

export {
  TestUser,
  getTestUser,
}
