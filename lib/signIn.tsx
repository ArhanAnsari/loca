import { GoogleAuthProvider, signOut, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
const signIn = () => {
  const provider = new GoogleAuthProvider();
  // const router = useRouter();

  signInWithPopup(auth, provider)
    .then((res) => {
      const credential = GoogleAuthProvider.credentialFromResult(res);
      const token = credential?.accessToken;
      const user = res.user;
 

      setCookie('token', token, {
        maxAge: 60 * 3 * 24,
        expires: new Date(60 * 3 * 24)
      })
      // Cookies.set('token', String(token), {
      //   expires: 7,
      //   secure: true,
      //   sameSite: 'strict',
      // });
      window.localStorage.setItem('user', JSON.stringify(user));
      toast.success('SignIn successful');
      // router.push('/chat');
      window.location.href = "/chat"
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error(error, errorCode, errorMessage, email, credential);
      toast.error('SignIn failed');
    });
}

const SignOut = () => {
  signOut(auth)
    .then(() => {
      Cookies.remove('token');
      toast.success('SignOut successful');
      window.location.href = '/';
    })
    .catch((err) => {
      toast.error('SignOut failed');
    });
};

export { signIn as SignIn, SignOut };
