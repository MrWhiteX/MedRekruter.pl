import { useRef, useState } from 'react';
import BaseLayout from 'components/BaseLayout';

export default function OfferNew() {
  const userForm = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>();
  const [confirmation, setConfirmation] = useState<string>('');
  const [formProcessing, setFormProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formProcessing) return;
    setError(null);
    setFormProcessing(true);
    if (userForm.current) {
      const form = new FormData(userForm.current);
      const payload = {
        email: form.get('email')
      };

      const response = await fetch('/api/users/resetPassword', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setConfirmation(
          'Jeśli podany adres e-mail istnieje w naszej bazie danych, wkrótce otrzymasz link resetujący.'
        );
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
              Restart hasła
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              W celu zresetowania hasła podaj swój adres email
            </p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <form className="flex flex-wrap -m-2" ref={userForm} onSubmit={handleSubmit}>
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
                {!confirmation && (
                  <button
                    disabled={formProcessing}
                    className="disabled:opacity-50 flex mx-auto text-white bg-indigo-700 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-900 rounded text-lg">
                    {formProcessing ? 'Proszę czkeać...' : 'Reset'}
                  </button>
                )}
                {error && (
                  <div className="flex justify-center w-full my-5">
                    <span className="bg-red-600 w-full rounded text-white px-3 py-3 text-center">
                      Wystąpił błąd podczas restartowania hasła: {error}
                    </span>
                  </div>
                )}
                {confirmation && (
                  <div className="flex justify-center w-full my-5">
                    <span className="bg-green-600 w-full rounded px-3 py-3 text-white text-center">
                      {confirmation}
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
