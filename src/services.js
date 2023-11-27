import { Amplify } from "aws-amplify";

export function configureAmplify() {
  console.log("Configuring amplify");
  Amplify.configure({
    Auth: {
      identityPoolId: "ap-southeast-1:0216e8d1-361d-4888-a9df-ce08871407ac",
      region: "ap-southeast-1",
      userPoolId: "ap-southeast-1_ueuQvrYcn",
      userPoolWebClientId: "53e6b182hd0383i5pgruoe9ak1",
    },
  });
}
