'use client';

import MobileSearch from '@/components/search/mobile-search';

const lastPurchasedMock: Record<string, string> = {
  '1': '2025-01-10T00:00:00.000Z',
  '2': '2025-02-02T00:00:00.000Z',
};

export default function DesktopSearch({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }
  return (
    <div className="hidden md:block">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <MobileSearch
          autoFocus
          compact
          containerMaxWidthClass="max-w-none"
          lastPurchasedMap={lastPurchasedMock}
          onClose={onClose}
          squareImages
        />
      </div>
    </div>
  );
}
