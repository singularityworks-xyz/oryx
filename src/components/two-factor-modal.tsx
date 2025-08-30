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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';

type TwoFactorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const TOTP_LENGTH: number = 6;

export default function TwoFactorModal({
  isOpen,
  onClose,
  onSuccess,
}: TwoFactorModalProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [method, setMethod] = useState<'totp' | 'otp'>('totp');
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
          : await authClient.twoFactor.verifyOtp({
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

  const handleSendOTP = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await authClient.twoFactor.sendOtp();

      if (result.error) {
        setError(result.error.message || 'Failed to send OTP');
      } else {
        setMethod('otp');
        setError('');
      }
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            <Label className="font-light font-outfit text-sm" htmlFor="code">
              Verification Code
            </Label>
            <Input
              className="mt-1 text-center font-mono text-lg tracking-widest"
              id="code"
              maxLength={6}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              required
              type="text"
              value={code}
            />
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 rounded-none"
              disabled={isLoading || code.length !== TOTP_LENGTH}
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
              className="rounded-none"
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
              onClick={handleSendOTP}
              variant="link"
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Smartphone className="mr-2 h-4 w-4" />
                  Send code to email instead
                </>
              )}
            </Button>
          </div>
        )}

        <DialogFooter className="text-center text-gray-500 text-sm">
          <p className="font-light font-outfit">
            Can't access your codes? Contact support for help.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
