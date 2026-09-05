/** There is no public marketing site — send `/` to the admin login. */
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/admin/login');
}
