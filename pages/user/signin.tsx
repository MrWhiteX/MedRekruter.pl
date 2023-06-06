import { useRef, useState } from 'react';
import BaseLayout from 'components/BaseLayout';
import { useRouter, NextRouter } from 'next/router';
import Link from 'next/link';
import { signIn } from 'next-auth/client';

type ErrorType = string | null;

export default function SignIn() {
  const loginForm = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<ErrorType>(null);
  const [formProcessing, setFormProcessing] = useState<boolean>(false);
  const router: NextRouter = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formProcessing) return;
    setError(null);
    setFormProcessing(true);
    if (loginForm.current) {
      const form = new FormData(loginForm.current);

      const response = await signIn('credentials', {
        redirect: false,
        email: form.get('email'),
        password: form.get('password')
      });

      if (response && response.ok) {
        router.push('/');
      } else {
        setError('Podano błędne dane logowania');
      }
      setFormProcessing(false);
    }
  };

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Zaloguj się
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              W celu dodania oferty zaloguj się
            </p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <form className="flex flex-wrap -m-2" ref={loginForm} onSubmit={handleSubmit}>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="email" className="leading-7 text-sm text-gray-600">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="password" className="leading-7 text-sm text-gray-600">
                    Hasło
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="passwordConfirm" className="leading-7 text-sm text-gray-600">
                    Potwierdź Hasło
                  </label>
                  <input
                    type="password"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div className="p-2 w-full">
                <button
                  disabled={formProcessing}
                  className="disabled:opacity-50 flex mx-auto text-white bg-indigo-700 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-900 rounded text-lg">
                  {formProcessing ? 'Ładowanie...' : 'Zaloguj się'}
                </button>
                {error && (
                  <div className="flex justify-center w-full my-5">
                    <span className="bg-red-600 w-full rounded text-white px-3 py-3 text-center">
                      Błąd logowania: {error}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <Link href="/user/resetPassword">
                  <a className="pt-8">
                    <span className="hover:text-indigo-600 transition duration-300 font-bold">
                      Nie pamiętasz hasła?
                    </span>
                  </a>
                </Link>
                <Link href="/user/register">
                  <a className="pt-3">
                    <span className="hover:text-indigo-600 transition duration-300 font-bold">
                      Zarejestruj się
                    </span>
                  </a>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
