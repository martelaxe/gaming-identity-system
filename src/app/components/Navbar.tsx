import Link from 'next/link';

const Navbar = () => (
  <nav>
    <Link href="/">Home</Link>
    <Link href="/create-avatar">Create Avatar</Link>
    {/* Add more links as needed */}
  </nav>
);

export default Navbar;
