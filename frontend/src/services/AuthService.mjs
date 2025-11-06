import { signIn, signUp, fetchAuthSession } from "aws-amplify/auth";


export const SignUpService = async (email, password, username) => {
  try {
    const isSignedin = await signUp({
      username: email,
      password: password,
      options: {
        userAttributes: {
          name: username,
        },
      },
    });
    console.log(isSignedin);
  } catch (error) {
    console.log(error.message);
  }
};

export const LoginService = async (email, password) => {
  const isSignedin = await signIn({ username: email, password: password });
  console.log(isSignedin);
};


