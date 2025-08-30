'use client';

import { useEffect, useState } from 'react';
import EditPhotoDialog from '@/components/profile/edit-photo-dialog';
import ChangeEmailDialog from '@/components/settings/change-email-dialog';
import ChangePasswordDialog from '@/components/settings/change-password-dialog';
import ConnectedAccounts from '@/components/settings/connected-accounts';
import DeleteAccountDialog from '@/components/settings/delete-account-dialog';
import LoginActivity from '@/components/settings/login-activity';
import TwoFactorSettings from '@/components/settings/two-factor-settings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import type { SessionResponse } from '@/lib/session-query';
import { useSessionQuery } from '@/lib/session-query';

type SettingsPageClientProps = {
  initialSession?: SessionResponse['session'];
};

export default function SettingsPageClient({
  initialSession,
}: SettingsPageClientProps) {
  const { data: session } = useSessionQuery(initialSession);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    if (session?.user.twoFactorEnabled != null) {
      setTwoFactorEnabled(session.user.twoFactorEnabled);
    } else {
      setTwoFactorEnabled(false);
    }
  }, [session?.user.twoFactorEnabled]);

  // With initial session data from server, we should always have session data
  // If for some reason we don't, it means there's an authentication issue
  if (!session) {
    // This shouldn't happen due to server-side redirect
    return null;
  }

  const initials = (session.user.name || 'User')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-light font-playfair text-3xl text-gray-900 tracking-wide">
            Settings
          </h1>
          <div className="mx-auto mt-4 h-px w-16 bg-gray-300" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6">
            <Card className="rounded-none border border-gray-200 shadow-sm">
              <CardHeader className="space-y-3">
                <CardTitle className="font-light font-outfit text-gray-900 text-xl">
                  Account
                </CardTitle>
                <p className="font-light font-outfit text-gray-600 text-sm">
                  Manage your identity and profile
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 rounded-none">
                    <AvatarImage
                      alt={session.user.name || 'User'}
                      src={session.user.image ?? undefined}
                    />
                    <AvatarFallback className="rounded-none bg-gray-100 font-light font-outfit text-gray-700">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-light font-outfit text-gray-900">
                      {session.user.name || 'Not provided'}
                    </p>
                    <p className="font-light font-outfit text-gray-600 text-sm">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <EditPhotoDialog />
                </div>
              </CardContent>
            </Card>

            <div className="hidden lg:block">
              <div className="space-y-6">
                <Card className="rounded-none border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-light font-outfit text-gray-900 text-lg">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        className="w-full rounded-none bg-gray-900 px-4 py-2 font-light font-outfit text-white hover:bg-gray-800"
                        type="button"
                      >
                        Change Password
                      </Button>
                      <Button
                        className="w-full rounded-none border border-gray-300 bg-white px-4 py-2 font-light font-outfit text-gray-900 hover:bg-gray-50"
                        type="button"
                        variant="outline"
                      >
                        Manage Notifications
                      </Button>
                      <Button
                        className="w-full rounded-none border border-gray-300 bg-white px-4 py-2 font-light font-outfit text-gray-900 hover:bg-gray-50"
                        type="button"
                        variant="outline"
                      >
                        Connected Apps
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-none border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-light font-outfit text-gray-900 text-lg">
                      Help & Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 font-light font-outfit text-gray-600 text-sm">
                      Need help with your account or settings?
                    </p>
                    <Button
                      className="w-full rounded-none bg-gray-900 px-4 py-2 font-light font-outfit text-white hover:bg-gray-800"
                      type="button"
                    >
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-2">
            <Card className="rounded-none border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="font-light font-outfit text-gray-900 text-xl">
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                    <ChangeEmailDialog />
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
                    <ChangePasswordDialog />
                  </div>

                  <TwoFactorSettings
                    isEnabled={twoFactorEnabled}
                    onStatusChange={setTwoFactorEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            <ConnectedAccounts />

            <Card className="rounded-none border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="font-light font-outfit text-gray-900 text-xl">
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                    <Switch defaultChecked />
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
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            <LoginActivity />

            <Card className="rounded-none border border-red-200 bg-red-50 shadow-sm">
              <CardHeader>
                <CardTitle className="font-light font-outfit text-red-900 text-xl">
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 font-light font-outfit text-red-700 text-sm">
                  Irreversible and destructive actions.
                </p>
                <DeleteAccountDialog />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
