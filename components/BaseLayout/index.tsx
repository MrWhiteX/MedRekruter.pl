import { useState, ReactNode } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import { signIn, signOut, useSession } from 'next-auth/client';

const TopNavigation = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [session, loading] = useSession();

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex items-center bg-gray-800 p-3 flex-wrap">
      <Link href="/">
        <a className="p-2 mr-4 inline-flex items-center">
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current text-white h-8 w-8 mr-2">
            <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
          </svg>
          <span className="text-xl text-white font-bold uppercase tracking-wide">
            MedRekruter.pl
          </span>
        </a>
      </Link>
      <button
        onClick={toggleMenu}
        className="text-white inline-flex p-3 hover:bg-gray-900 rounded lg:hidden ml-auto hover:text-white outline-none nav-toggler">
        Menu
      </button>
      <div
        className={classNames('top-navbar w-full lg:inline-flex lg:flex-grow lg:w-auto', {
          hidden: !isOpen
        })}
        id="navigation">
        <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto">
          <Link href="/offers">
            <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-gray-400 items-center justify-center hover:bg-gray-900 hover:text-white">
              <span>Wszystkie oferty</span>
            </a>
          </Link>
          <Link href="/offers/new">
            <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-gray-400 items-center justify-center hover:bg-gray-900 hover:text-white">
              <span>Dodaj ofertę</span>
            </a>
          </Link>

          {session && (
            <Link href="/offers/my">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-gray-400 items-center justify-center hover:bg-gray-900 hover:text-white">
                <span>Moje oferty</span>
              </a>
            </Link>
          )}

          {session && session.user.role === 'admin' && (
            <Link href="/admin/offers">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-gray-400 items-center justify-center hover:bg-gray-900 hover:text-white">
                <span>Admin</span>
              </a>
            </Link>
          )}
          {session && (
            <Link href="/offers/favourite">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-gray-400 items-center justify-center hover:bg-gray-900 hover:text-white">
                <span>Ulubione</span>
              </a>
            </Link>
          )}
          {session && (
            <a
              onClick={() => signOut()}
              className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-gray-400 items-center justify-center hover:bg-gray-900 hover:text-white">
              <span>Wyloguj</span>
            </a>
          )}

          {!session && !loading && (
            <Link href="/user/signin">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-gray-400 items-center justify-center hover:bg-gray-900 hover:text-white">
                <span>Zaloguj</span>
              </a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer
    className="fixed bottom-0 left-0 bg-white w-screen h-16.5 text-gray-600 body-font shadow-indigo-500/50	"
    style={{ height: '72px' }}>
    <div className="container px-5 h-full mx-auto flex items-center sm:flex-row flex-col">
      <a
        href="/"
        className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-current text-indigo-500 h-8 w-8 mr-2">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
        </svg>
        <span className="ml-3 text-xl">MedRekruter.pl</span>
      </a>
      <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
        © {new Date().getFullYear()}
      </p>
      <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
        <a aria-label="Facebook" href="/" className="text-gray-500">
          <svg
            fill="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-5 h-5"
            viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
          </svg>
        </a>
      </span>
    </div>
  </footer>
);

interface AuxProps {
  children: ReactNode;
}

export default function BaseLayout({ children }: AuxProps) {
  return (
    <>
      <div className="min-h-screen">
        <TopNavigation />
        {children}
        <Footer />
      </div>
    </>
  );
}
