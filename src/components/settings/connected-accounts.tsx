import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ConnectedAccounts() {
  // For now static states; wire later
  const providers = [
    { id: 'email', name: 'Email', linked: true },
    { id: 'google', name: 'Google', linked: false },
  ];

  return (
    <Card className="rounded-none border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="font-light font-outfit text-gray-900 text-xl">
          Connected Accounts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-gray-200">
          {providers.map((p) => (
            <div className="flex items-center justify-between py-3" key={p.id}>
              <div>
                <p className="font-light font-outfit text-gray-900 text-sm">
                  {p.name}
                </p>
                <p className="font-light font-outfit text-gray-600 text-xs">
                  {p.linked ? 'Linked' : 'Not linked'}
                </p>
              </div>
              {p.linked ? (
                <Button
                  className="rounded-none border border-gray-300 bg-white px-4 py-2 font-light font-outfit text-gray-700 text-sm hover:bg-gray-50"
                  variant="outline"
                >
                  Unlink
                </Button>
              ) : (
                <Button className="rounded-none bg-gray-900 px-4 py-2 font-light font-outfit text-white hover:bg-gray-800">
                  Link
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
