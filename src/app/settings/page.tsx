import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';

export default async function SettingsPage() {
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
            Settings
          </h1>
          <div className="mx-auto mt-4 h-px w-16 bg-gray-300" />
        </div>

        <div className="space-y-8">
          {/* Account Settings */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="font-light font-outfit text-gray-900 text-xl">
                Account Settings
              </h2>
              <p className="mt-1 font-light font-outfit text-gray-600 text-sm">
                Manage your account preferences and security.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-light font-outfit text-gray-900">
                    Email
                  </h3>
                  <p className="font-light font-outfit text-gray-600 text-sm">
                    {session.user.email}
                  </p>
                </div>
                <Button className="rounded-md border border-gray-300 bg-white px-4 py-2 font-light font-outfit text-gray-700 text-sm hover:bg-gray-50">
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-light font-outfit text-gray-900">
                    Password
                  </h3>
                  <p className="font-light font-outfit text-gray-600 text-sm">
                    Last updated recently
                  </p>
                </div>
                <Button className="rounded-md border border-gray-300 bg-white px-4 py-2 font-light font-outfit text-gray-700 text-sm hover:bg-gray-50">
                  Change
                </Button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="font-light font-outfit text-gray-900 text-xl">
                Preferences
              </h2>
              <p className="mt-1 font-light font-outfit text-gray-600 text-sm">
                Customize your experience.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-light font-outfit text-gray-900">
                    Notifications
                  </h3>
                  <p className="font-light font-outfit text-gray-600 text-sm">
                    Receive updates about new products and offers
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    className="peer sr-only"
                    defaultChecked
                    type="checkbox"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300" />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-light font-outfit text-gray-900">
                    Marketing
                  </h3>
                  <p className="font-light font-outfit text-gray-600 text-sm">
                    Receive promotional emails and special offers
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input className="peer sr-only" type="checkbox" />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300" />
                </label>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-8">
            <div className="mb-6">
              <h2 className="font-light font-outfit text-red-900 text-xl">
                Danger Zone
              </h2>
              <p className="mt-1 font-light font-outfit text-red-700 text-sm">
                Irreversible and destructive actions.
              </p>
            </div>

            <Button className="rounded-md border border-red-300 bg-white px-4 py-2 font-light font-outfit text-red-700 text-sm hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
