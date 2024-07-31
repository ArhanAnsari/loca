import { GoogleAuthProvider, signOut, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';
import { setCookie, deleteCookie } from 'cookies-next';
import toast from 'react-hot-toast';

const signIn = () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((res) => {
      const credential = GoogleAuthProvider.credentialFromResult(res);
      const token = credential?.accessToken;
      const user = res.user;

      setCookie('token', token, {
        maxAge: 60 * 3 * 24,
        expires: new Date(60 * 3 * 24), // should be a Date object relative to now
      });

      window.localStorage.setItem('user', JSON.stringify(user));
      toast.success('SignIn successful');
      window.location.href = "/chat";
    })
    .catch((error) => {
      console.error(error);
      toast.error('SignIn failed');
    });
}

const SignOut = () => {
  signOut(auth)
    .then(() => {
      deleteCookie('token');
      toast.success('SignOut successful');
      window.location.href = '/';
    })
    .catch((err) => {
      toast.error('SignOut failed');
    });
};

export { signIn as SignIn, SignOut };
