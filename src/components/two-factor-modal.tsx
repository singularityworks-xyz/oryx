'use client';

import { Loader2Icon, Shield, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';

type TwoFactorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const TOTP_LENGTH: number = 6;
const BACKUP_CODE_LENGTH: number = 10;

export default function TwoFactorModal({
  isOpen,
  onClose,
  onSuccess,
}: TwoFactorModalProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [method, setMethod] = useState<'totp' | 'backup'>('totp');
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result =
        method === 'totp'
          ? await authClient.twoFactor.verifyTotp({
              code,
              trustDevice: true,
            })
          : await authClient.twoFactor.verifyBackupCode({
              code,
              trustDevice: true,
            });

      if (result.error) {
        setError(result.error.message || 'Verification failed');
      } else {
        onClose();
        onSuccess?.();
        router.refresh();
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseBackupCodes = () => {
    setMethod('backup');
    setCode('');
    setError('');
  };

  const handleClose = () => {
    setCode('');
    setError('');
    setMethod('totp');
    onClose();
  };

  return (
    <Dialog onOpenChange={handleClose} open={isOpen}>
      <DialogContent className="max-w-md rounded-none">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Shield className="h-8 w-8 text-gray-600" />
          </div>
          <DialogTitle className="text-center font-light font-playfair text-2xl text-gray-900 tracking-wide">
            Two-Factor Authentication
          </DialogTitle>
          <DialogDescription className="text-center font-light font-outfit text-gray-600">
            Enter your verification code to continue
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-600">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form className="space-y-4" onSubmit={handleVerify}>
          <div>
            <Label className="justify-center font-light font-outfit text-sm">
              {method === 'backup' ? 'Backup Code' : 'Verification Code'}
            </Label>
            <div className="mt-2 flex justify-center">
              <InputOTP
                maxLength={
                  method === 'backup' ? BACKUP_CODE_LENGTH : TOTP_LENGTH
                }
                onChange={(value) => setCode(value)}
                value={code}
              >
                <InputOTPGroup>
                  {Array.from({
                    length:
                      method === 'backup' ? BACKUP_CODE_LENGTH : TOTP_LENGTH,
                  }).map((_, index) => (
                    <InputOTPSlot
                      index={index}
                      key={`otp-${method}-slot-${index}-${Math.random()}`}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Button
              className="rounded-none bg-gray-900 px-8 font-light font-outfit text-white hover:bg-gray-800"
              disabled={
                isLoading ||
                code.length !==
                  (method === 'backup' ? BACKUP_CODE_LENGTH : TOTP_LENGTH)
              }
              type="submit"
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>
            <Button
              className="rounded-none border border-gray-300 bg-white px-8 font-light font-outfit text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
              onClick={handleClose}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>

        {method === 'totp' && (
          <div className="text-center">
            <Button
              className="font-light font-outfit text-sm"
              disabled={isLoading}
              onClick={handleUseBackupCodes}
              variant="link"
            >
              Use backup code instead
            </Button>
          </div>
        )}

        {method === 'backup' && (
          <div className="text-center">
            <Button
              className="font-light font-outfit text-sm"
              disabled={isLoading}
              onClick={() => setMethod('totp')}
              variant="link"
            >
              <Smartphone className="mr-2 h-4 w-4" />
              Use authenticator app instead
            </Button>
          </div>
        )}

        <DialogFooter className="text-center text-gray-500 text-sm">
          <p className="font-light font-outfit">
            {method === 'backup'
              ? 'Backup codes can only be used once. Make sure to generate new ones after login.'
              : "Can't access your authenticator app? Use a backup code instead."}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
