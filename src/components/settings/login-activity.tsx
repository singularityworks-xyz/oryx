import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const mockLogins = [
  {
    id: '1',
    location: 'Doha, QA',
    device: 'Chrome on Windows',
    time: '2 hours ago',
    current: true,
  },
  {
    id: '2',
    location: 'Doha, QA',
    device: 'Safari on iPhone',
    time: 'Yesterday',
    current: false,
  },
  {
    id: '3',
    location: 'Al Wakrah, QA',
    device: 'Chrome on Mac',
    time: '3 days ago',
    current: false,
  },
];

export default function LoginActivity() {
  return (
    <Card className="rounded-none border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="font-light font-outfit text-gray-900 text-xl">
          Login Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-gray-200">
          {mockLogins.map((entry) => (
            <div
              className="flex items-center justify-between py-3"
              key={entry.id}
            >
              <div>
                <p className="font-light font-outfit text-gray-900 text-sm">
                  {entry.device}
                </p>
                <p className="font-light font-outfit text-gray-600 text-xs">
                  {entry.location} • {entry.time}
                </p>
              </div>
              {entry.current && (
                <span className="rounded-none bg-gray-900 px-2 py-1 font-light font-outfit text-[10px] text-white uppercase tracking-wide">
                  Current
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
