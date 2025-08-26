import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { auth } from '@/lib/auth';

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-light font-playfair text-3xl text-gray-900 tracking-wide">
            Profile
          </h1>
          <div className="mx-auto mt-4 h-px w-16 bg-gray-300" />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="font-light font-outfit text-gray-900 text-xl">
                Personal Information
              </h2>
              <p className="mt-1 font-light font-outfit text-gray-600 text-sm">
                Manage your account details and preferences.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label className="block font-light font-outfit text-gray-700 text-sm">
                  Name
                </Label>
                <p className="mt-1 font-light font-outfit text-gray-900">
                  {session.user.name || 'Not provided'}
                </p>
              </div>

              <div>
                <Label className="block font-light font-outfit text-gray-700 text-sm">
                  Email
                </Label>
                <p className="mt-1 font-light font-outfit text-gray-900">
                  {session.user.email}
                </p>
              </div>

              <div className="sm:col-span-2">
                <Label className="block font-light font-outfit text-gray-700 text-sm">
                  Member Since
                </Label>
                <p className="mt-1 font-light font-outfit text-gray-900">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
