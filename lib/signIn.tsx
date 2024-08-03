import { GoogleAuthProvider, signOut, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { setCookie, deleteCookie } from "cookies-next";
import toast from "react-hot-toast";

const signIn = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await user.getIdToken();

    const response = await fetch("/api/create-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    if (response.ok) {
      // Store user data in Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        },
        { merge: true },
      );

      setCookie("token", idToken, {
        maxAge: 60 * 60 * 24 * 3, // 3 days in seconds
        expires: new Date(Date.now() + 60 * 60 * 24 * 3 * 1000), // 3 days from now
      });

      window.localStorage.setItem("user", JSON.stringify(user));
      toast.success("SignIn successful! redirecting...");
      window.location.href = "/chat";
    } else {
      throw new Error("Failed to create session");
    }
  } catch (error) {
    console.error(error);
    toast.error("SignIn failed");
    throw error; // Re-throw the error so it can be caught in the HomePage component
  }
};

const SignOut = () => {
  signOut(auth)
    .then(() => {
      deleteCookie("token");
      toast.success("SignOut successful");
      window.location.href = "/";
    })
    .catch((err) => {
      toast.error("SignOut failed");
    });
};

export { signIn as SignIn, SignOut };
