'use client';

import { Loader2Icon, QrCode, Shield } from 'lucide-react';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';

type TwoFactorSettingsProps = {
  isEnabled: boolean | undefined;
  onStatusChange: (enabled: boolean) => void;
};

const TOTP_LENGTH: number = 6;

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TOTP length
export default function TwoFactorSettings({
  isEnabled = false,
  onStatusChange,
}: TwoFactorSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [totpUri, setTotpUri] = useState('');

  const handleEnable2FA = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await authClient.twoFactor.enable({
        password,
      });

      if (result.error) {
        setError(result.error.message || 'Failed to enable 2FA');
      } else {
        setTotpUri(result.data?.totpURI || '');
        setBackupCodes(result.data?.backupCodes || []);
        setSuccess(
          '2FA setup initiated. Please verify with your authenticator app.'
        );
        setShowSetup(true);
      }
    } catch {
      setError('Failed to enable 2FA. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyTOTP = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await authClient.twoFactor.verifyTotp({
        code: totpCode,
        trustDevice: true,
      });

      if (result.error) {
        setError(result.error.message || 'Verification failed');
      } else {
        onStatusChange(true);
        setSuccess('2FA has been successfully enabled!');
        setShowSetup(false);
        setPassword('');
        setTotpCode('');
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await authClient.twoFactor.disable({
        password,
      });

      if (result.error) {
        setError(result.error.message || 'Failed to disable 2FA');
      } else {
        onStatusChange(false);
        setSuccess('2FA has been successfully disabled.');
        setShowDisable(false);
        setPassword('');
      }
    } catch {
      setError('Failed to disable 2FA. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-light font-outfit text-gray-900">
            Two-Factor Authentication
          </h3>
          {isEnabled && (
            <Badge
              className="font-light font-outfit text-xs"
              variant="secondary"
            >
              <Shield className="mr-1 h-3 w-3" />
              Enabled
            </Badge>
          )}
        </div>
        <p className="font-light font-outfit text-gray-600 text-sm">
          {isEnabled
            ? 'Your account is protected with 2FA'
            : 'Add an extra layer of security to your account'}
        </p>
      </div>

      {isEnabled ? (
        <Dialog onOpenChange={setShowDisable} open={showDisable}>
          <DialogTrigger asChild>
            <Button
              className="border-red-300 bg-white font-light font-outfit text-red-600 hover:bg-red-50"
              variant="outline"
            >
              Disable
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-none">
            <DialogHeader>
              <DialogTitle className="font-light font-outfit">
                Disable Two-Factor Authentication
              </DialogTitle>
              <DialogDescription className="font-light font-outfit">
                This will remove the extra security layer from your account. Are
                you sure?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-600">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <Label
                  className="font-light font-outfit text-sm"
                  htmlFor="disable-password"
                >
                  Confirm your password
                </Label>
                <Input
                  className="mt-1"
                  id="disable-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                className="rounded-none"
                onClick={() => setShowDisable(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                className="rounded-none bg-red-600 hover:bg-red-700"
                disabled={isLoading || !password}
                onClick={handleDisable2FA}
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Disabling...
                  </>
                ) : (
                  'Disable 2FA'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog onOpenChange={setShowSetup} open={showSetup}>
          <DialogTrigger asChild>
            <Button className="rounded-none bg-gray-900 font-light font-outfit hover:bg-gray-800">
              Enable
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-none">
            <DialogHeader>
              <DialogTitle className="font-light font-outfit">
                Set up Two-Factor Authentication
              </DialogTitle>
              <DialogDescription className="font-light font-outfit">
                {totpUri
                  ? 'Scan the QR code with your authenticator app'
                  : 'Enter your password to begin setup'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-600">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-600">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {totpUri ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-white p-2">
                      {totpUri ? (
                        <QRCode
                          size={128}
                          style={{
                            height: 'auto',
                            maxWidth: '100%',
                            width: '100%',
                          }}
                          value={totpUri}
                          viewBox={'0 0 128 128'}
                        />
                      ) : (
                        <QrCode className="h-16 w-16 text-gray-600" />
                      )}
                    </div>
                    <p className="font-light font-outfit text-gray-600 text-sm">
                      {totpUri
                        ? 'Scan this QR code with your authenticator app'
                        : 'QR Code will be displayed here'}
                    </p>
                  </div>

                  <div>
                    <Label
                      className="font-light font-outfit text-sm"
                      htmlFor="totp-code"
                    >
                      Enter the 6-digit code from your app
                    </Label>
                    <Input
                      className="mt-1 text-center font-mono text-lg tracking-widest"
                      id="totp-code"
                      maxLength={6}
                      onChange={(e) => setTotpCode(e.target.value)}
                      placeholder="000000"
                      type="text"
                      value={totpCode}
                    />
                  </div>

                  <Button
                    className="w-full rounded-none"
                    disabled={isLoading || totpCode.length !== TOTP_LENGTH}
                    onClick={handleVerifyTOTP}
                  >
                    {isLoading ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Enable'
                    )}
                  </Button>

                  {backupCodes.length > 0 && (
                    <div className="rounded-lg bg-yellow-50 p-4">
                      <h4 className="font-light font-outfit text-sm text-yellow-800">
                        Backup Codes
                      </h4>
                      <p className="mt-1 font-light font-outfit text-xs text-yellow-700">
                        Save these codes in a safe place. You can use them to
                        access your account if you lose your device.
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-1">
                        {backupCodes.map((code) => (
                          <code
                            className="rounded bg-yellow-100 px-2 py-1 font-mono text-xs text-yellow-900"
                            key={code}
                          >
                            {code}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Label
                    className="font-light font-outfit text-sm"
                    htmlFor="setup-password"
                  >
                    Your password
                  </Label>
                  <Input
                    className="mt-1"
                    id="setup-password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                  />
                  <Button
                    className="mt-4 w-full rounded-none"
                    disabled={isLoading || !password}
                    onClick={handleEnable2FA}
                  >
                    {isLoading ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      'Continue'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
