import { getSession } from '../../lib/getSession';

export default async function ProtectedPage() {
  const session = await getSession();

  if (!session) {
    // Redirect or show a message if not authenticated
    return <div>You need to be logged in to view this page.</div>;
  }

  return <div>Welcome, user ID: {session.userId}!</div>;
}
