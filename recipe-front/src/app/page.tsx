import { redirect } from 'next/navigation';

// Reason: The root page should redirect to the main recipe list.
export default function HomePage() {
  redirect('/recipes');

  // Note: This component will technically never render anything
  // because the redirect happens server-side before rendering.
  // You could return null or a simple loading message if needed,
  // but it's generally not necessary with server-side redirects.
  // return null;
}
