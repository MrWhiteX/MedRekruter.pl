import { useRef, useState } from 'react';
import BaseLayout from 'components/BaseLayout';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/client';

export default function OfferNew() {
  const userForm = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>();
  const [formProcessing, setFormProcessing] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formProcessing) return;
    setError(null);
    setFormProcessing(true);
    if (userForm.current) {
      const form = new FormData(userForm.current);
      const payload = {
        resetToken: router.query.token,
        password: form.get('password')
      };

      if (payload.password !== form.get('passwordConfirm')) {
        setError('Given passwords not match');
        setFormProcessing(false);
        return;
      }

      const response = await fetch('/api/users/resetPassword', {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const payload = await response.json();

        await signIn('credentials', {
          redirect: false,
          email: payload.user.email,
          password: form.get('password')
        });
        router.push('/');
      } else {
        const payload = await response.json();
        setFormProcessing(false);
        setError(payload.error);
      }
    }
  };

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Zmiana hasła
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              W celu zmiany hasła wprowadź nowe dane.
            </p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <form className="flex flex-wrap -m-2" ref={userForm} onSubmit={handleSubmit}>
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
                    Potwierdź hasło
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
                  className="disabled:opacity-50 flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                  {formProcessing ? 'Proszę czekać...' : 'Zmiana hasła'}
                </button>
                {error && (
                  <div className="flex justify-center w-full my-5">
                    <span className="bg-red-600 w-full rounded text-white px-3 py-3 text-center">
                      Bład podczas zmiany hasła: {error}
                    </span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
