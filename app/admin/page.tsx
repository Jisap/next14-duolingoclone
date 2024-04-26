import { isAdmin } from '@/lib/admin';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

const App = dynamic(() => import("./app"), {ssr: false});

export const metadata = {
  title: "Lingo | Admin page",
  description: "Only admins can access this page.",
};

const AdminPage = () => {

  if (!isAdmin()) {
    redirect("/");
  }

  return (
    <main>
      <App />
    </main>
  )
}

export default AdminPage