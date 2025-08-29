'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PastPurchases from '@/components/past-purchases';
import EditPhotoDialog from '@/components/profile/edit-photo-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSessionQuery } from '@/lib/session-query';

export default function ProfilePage() {
  const { data: session, isPending } = useSessionQuery();
  const router = useRouter();

  useEffect(() => {
    if (!(isPending || session)) {
      router.replace('/auth/login');
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-10 w-32 animate-pulse bg-gray-200" />
        </div>
      </div>
    );
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
            Profile
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
                  Manage your personal details
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
                        Edit Profile
                      </Button>
                      <Button
                        className="w-full rounded-none border border-gray-300 bg-white px-4 py-2 font-light font-outfit text-gray-900 hover:bg-gray-50"
                        type="button"
                        variant="outline"
                      >
                        View Orders
                      </Button>
                      <Button
                        className="w-full rounded-none border border-gray-300 bg-white px-4 py-2 font-light font-outfit text-gray-900 hover:bg-gray-50"
                        type="button"
                        variant="outline"
                      >
                        Manage Addresses
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
                      Have questions about your orders or account? We’re here to
                      help.
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
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label className="block font-light font-outfit text-gray-700 text-sm">
                      Full name
                    </Label>
                    <Input
                      className="mt-2 rounded-none border-gray-300 focus:border-gray-900 focus:ring-0"
                      defaultValue={session.user.name || ''}
                      disabled
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label className="block font-light font-outfit text-gray-700 text-sm">
                      Email address
                    </Label>
                    <Input
                      className="mt-2 rounded-none border-gray-300 focus:border-gray-900 focus:ring-0"
                      defaultValue={session.user.email || ''}
                      disabled
                      placeholder="your@email.com"
                      type="email"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="font-light font-outfit text-gray-900 text-xl">
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label className="block font-light font-outfit text-gray-700 text-sm">
                      Address line 1
                    </Label>
                    <Input
                      className="mt-2 rounded-none border-gray-300 focus:border-gray-900 focus:ring-0"
                      placeholder="Street address, P.O. box"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="block font-light font-outfit text-gray-700 text-sm">
                      Address line 2
                    </Label>
                    <Input
                      className="mt-2 rounded-none border-gray-300 focus:border-gray-900 focus:ring-0"
                      placeholder="Apartment, suite, unit"
                    />
                  </div>
                  <div>
                    <Label className="block font-light font-outfit text-gray-700 text-sm">
                      City
                    </Label>
                    <Input
                      className="mt-2 rounded-none border-gray-300 focus:border-gray-900 focus:ring-0"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label className="block font-light font-outfit text-gray-700 text-sm">
                      State/Province
                    </Label>
                    <Input
                      className="mt-2 rounded-none border-gray-300 focus:border-gray-900 focus:ring-0"
                      placeholder="State or province"
                    />
                  </div>
                  <div>
                    <Label className="block font-light font-outfit text-gray-700 text-sm">
                      Postal code
                    </Label>
                    <Input
                      className="mt-2 rounded-none border-gray-300 focus:border-gray-900 focus:ring-0"
                      placeholder="Postal code"
                    />
                  </div>
                  <div>
                    <Label className="block font-light font-outfit text-gray-700 text-sm">
                      Country
                    </Label>
                    <Input
                      className="mt-2 rounded-none border-gray-300 focus:border-gray-900 focus:ring-0"
                      placeholder="Country"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="block font-light font-outfit text-gray-700 text-sm">
                      Delivery instructions
                    </Label>
                    <Textarea
                      className="mt-2 rounded-none border-gray-300 focus:border-gray-900 focus:ring-0"
                      placeholder="Add any helpful delivery notes..."
                      rows={4}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Button
                      className="rounded-none bg-gray-900 px-5 py-2 font-light font-outfit text-white hover:bg-gray-800"
                      type="button"
                    >
                      Save Address
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="font-light font-outfit text-gray-900 text-xl">
                  Past Purchases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PastPurchases />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
