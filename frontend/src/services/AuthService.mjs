import { signIn, signUp, signOut } from 'aws-amplify/auth';

export const SignUpService = async (email, password, username) => {
  let isSignedin = false;
  // console.log(email)
  try {
    const { isSignUpComplete } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          name: `${username}`,
        },
      },
    });
    isSignedin = isSignUpComplete;
    // console.log(isSignedin);
  } catch (error) {
    // console.log(error.message);
  }
  return isSignedin;
};

export const LoginService = async (email, password) => {
  const isSignedin = await signIn({ username: email, password: password });
  // console.log(isSignedin);

  return isSignedin.isSignedIn;
};

export async function handleSignOut() {
  await signOut({ global: true });
}
