'use server'
import { GoogleAuthProvider, signOut, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { cookies } from "next/headers";

const SignUpAction = () => {
  const provider = new GoogleAuthProvider();
  // const router = useRouter();
  const cook = cookies()
  signInWithPopup(auth, provider)
    .then((res) => {
      const credential = GoogleAuthProvider.credentialFromResult(res);
      const token = credential?.accessToken;
      const user = res.user;
      console.log(user);
      console.log(token);
      if (token) {
        console.log("Token received from Firebase:", token);

        // Set the token as an HTTP-only cookie
        // setCookie('token', token, {
        //   maxAge: 7 * 24 * 60 * 60, // 7 days
        //   path: '/',
        //   secure: process.env.NODE_ENV === 'production',
        //   httpOnly: true,
        //   sameSite: 'strict'
        // });
        cook.set({
          name: "token",
          value: token,
          path: "/",
          httpOnly: true,
        });

        console.log("Cookie set with token");

        // window.localStorage.setItem("user", JSON.stringify(user));
        toast.success("SignIn successful");
        // router.push("/chat");
      } else {
        console.error("No token received from Firebase");
        toast.error("SignIn failed: No token received");
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error(error, errorCode, errorMessage, email, credential);
      toast.error("SignIn failed");
    });
};

export default SignUpAction