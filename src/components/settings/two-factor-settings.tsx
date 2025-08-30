'use client';

import {
  CopyIcon,
  DownloadIcon,
  Loader2Icon,
  QrCode,
  Shield,
} from 'lucide-react';
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';

type TwoFactorSettingsProps = {
  isEnabled: boolean | undefined;
  onStatusChange: (enabled: boolean) => void;
};

const TOTP_LENGTH: number = 6;
const COPY_SUCCESS_TIMEOUT: number = 2000;

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
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [existingBackupCodes, setExistingBackupCodes] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyCodes = async (codes: string[]) => {
    try {
      const codesText = codes.join('\n');
      await navigator.clipboard.writeText(codesText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), COPY_SUCCESS_TIMEOUT);
    } catch (err) {
      console.error('Failed to copy codes:', err);
    }
  };

  const handleDownloadCodes = (codes: string[]) => {
    const codesText = codes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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

  const handleGenerateBackupCodes = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await authClient.twoFactor.generateBackupCodes({
        password,
      });

      if (result.error) {
        setError(result.error.message || 'Failed to generate backup codes');
      } else {
        setExistingBackupCodes(result.data?.backupCodes || []);
        setShowBackupCodes(true);
        setSuccess('New backup codes generated successfully!');
      }
    } catch {
      setError('Failed to generate backup codes. Please try again.');
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
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Dialog onOpenChange={setShowBackupCodes} open={showBackupCodes}>
            <DialogTrigger asChild>
              <Button
                className="rounded-none border border-gray-300 bg-white px-6 py-3 font-light font-outfit text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setExistingBackupCodes([]);
                  setPassword('');
                  setError('');
                  setSuccess('');
                }}
                variant="outline"
              >
                Backup Codes
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-none">
              <DialogHeader>
                <DialogTitle className="font-light font-outfit">
                  {existingBackupCodes.length > 0
                    ? 'Manage Backup Codes'
                    : 'Generate New Backup Codes'}
                </DialogTitle>
                <DialogDescription className="font-light font-outfit">
                  {existingBackupCodes.length > 0
                    ? 'View your existing backup codes or generate new ones.'
                    : 'Generate new backup codes for account recovery.'}
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

                <div>
                  <Label
                    className="font-light font-outfit text-sm"
                    htmlFor="manage-backup-password"
                  >
                    Your password
                  </Label>
                  <Input
                    className="mt-1"
                    id="manage-backup-password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                  />
                </div>

                {existingBackupCodes.length > 0 && (
                  <div className="rounded-lg bg-yellow-50 p-4">
                    <h4 className="font-light font-outfit text-sm text-yellow-800">
                      Your Backup Codes
                    </h4>
                    <p className="mt-1 font-light font-outfit text-xs text-yellow-700">
                      Save these codes in a safe place. Each code can only be
                      used once.
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      {existingBackupCodes.map((code) => (
                        <code
                          className="rounded bg-yellow-100 px-2 py-1 font-mono text-xs text-yellow-900"
                          key={code}
                        >
                          {code}
                        </code>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <Button
                        className="w-full rounded-none bg-gray-900 font-light font-outfit text-white text-xs hover:bg-gray-800 sm:w-auto"
                        onClick={() => handleCopyCodes(existingBackupCodes)}
                        size="sm"
                        type="button"
                      >
                        <CopyIcon className="mr-2 h-3 w-3" />
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button
                        className="w-full rounded-none border border-gray-300 bg-white font-light font-outfit text-gray-700 text-xs hover:bg-gray-50 sm:w-auto"
                        onClick={() => handleDownloadCodes(existingBackupCodes)}
                        size="sm"
                        type="button"
                        variant="outline"
                      >
                        <DownloadIcon className="mr-2 h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  className="rounded-none border border-gray-300 bg-white px-6 py-3 font-light font-outfit text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowBackupCodes(false)}
                  variant="outline"
                >
                  Close
                </Button>
                {existingBackupCodes.length > 0 && (
                  <Button
                    className="rounded-none bg-gray-900 px-6 py-3 font-light font-outfit text-white hover:bg-gray-800"
                    onClick={() => {
                      setExistingBackupCodes([]);
                      setPassword('');
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Generate New Codes
                  </Button>
                )}
                <Button
                  className="rounded-none bg-gray-900 px-6 py-3 font-light font-outfit text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading || !password}
                  onClick={handleGenerateBackupCodes}
                >
                  {isLoading ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                    // biome-ignore lint/style/noNestedTernary: required
                  ) : existingBackupCodes.length > 0 ? (
                    'Replace Codes'
                  ) : (
                    'Generate Codes'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog onOpenChange={setShowDisable} open={showDisable}>
            <DialogTrigger asChild>
              <Button
                className="rounded-none border border-gray-300 bg-white px-6 py-3 font-light font-outfit text-gray-700 hover:bg-gray-50"
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
                  This will remove the extra security layer from your account.
                  Are you sure?
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
                  className="rounded-none border border-gray-300 bg-white font-light font-outfit text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowDisable(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-none bg-gray-900 font-light font-outfit text-white hover:bg-gray-800"
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
        </div>
      ) : (
        <Dialog onOpenChange={setShowSetup} open={showSetup}>
          <DialogTrigger asChild>
            <Button className="rounded-none bg-gray-900 px-6 py-3 font-light font-outfit text-white hover:bg-gray-800">
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
                    <Label className="font-light font-outfit text-sm">
                      Enter the 6-digit code from your app
                    </Label>
                    <div className="mt-2">
                      <InputOTP
                        maxLength={6}
                        onChange={(value) => setTotpCode(value)}
                        value={totpCode}
                      >
                        <InputOTPGroup>
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot
                              index={index}
                              key={`totp-slot-${index}-${Math.random()}`}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <Button
                    className="w-full rounded-none bg-gray-900 font-light font-outfit text-white hover:bg-gray-800"
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
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <Button
                          className="w-full rounded-none bg-gray-900 font-light font-outfit text-white text-xs hover:bg-gray-800 sm:w-auto"
                          onClick={() => handleCopyCodes(backupCodes)}
                          size="sm"
                          type="button"
                        >
                          <CopyIcon className="mr-2 h-3 w-3" />
                          {copySuccess ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button
                          className="w-full rounded-none border border-gray-300 bg-white font-light font-outfit text-gray-700 text-xs hover:bg-gray-50 sm:w-auto"
                          onClick={() => handleDownloadCodes(backupCodes)}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          <DownloadIcon className="mr-2 h-3 w-3" />
                          Download
                        </Button>
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
                    className="mt-4 w-full rounded-none bg-gray-900 font-light font-outfit text-white hover:bg-gray-800"
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
