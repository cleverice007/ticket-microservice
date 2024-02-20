import Link from 'next/link';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="list-none mr-6">
          <Link href={href}>
            <a className="text-blue-500 hover:text-blue-800">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="bg-gray-100 p-5">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="text-xl font-semibold text-gray-900 hover:text-gray-600">GitTix</a>
        </Link>

        <ul className="flex justify-end items-center space-x-4">{links}</ul>
      </div>
    </nav>
  );
};
