# Hybrid Cart System Implementation

This document describes the production-grade hybrid cart system that combines local storage with database storage for optimal user experience and data persistence.

## Overview

The hybrid cart system provides:
- **Fast local operations** for immediate user feedback
- **Database persistence** for cross-device synchronization
- **Automatic synchronization** between local and server data
- **Offline capability** when internet is unavailable
- **Conflict resolution** for data consistency

## Architecture

### Components

1. **Cart Store (Zustand)** - Local state management with persistence
2. **Cart Model (MongoDB)** - Database schema and operations
3. **Cart API Routes** - Server-side cart operations
4. **Cart Sync Hook** - React hook for synchronization logic
5. **Cart Service** - API client with retry logic and validation
6. **Cart Provider** - Global cart context and auto-sync
7. **Cart Sync Status Component** - UI for sync status and controls

### Data Flow

```
User Action → Local Store → Debounced Sync → API → Database
     ↓              ↓           ↓         ↓       ↓
  Immediate    Persist to    Send to    Store    Persist
  Feedback    localStorage   Server     Data     Changes
```

## Features

### Local Storage Benefits
- ✅ Instant cart operations (add, remove, update)
- ✅ Works offline
- ✅ Persistent across browser sessions
- ✅ Fast performance
- ⚠️ **Authentication required** - Cart only accessible to signed-in users

### Database Storage Benefits
- ✅ Cross-device synchronization
- ✅ User-specific carts
- ✅ Analytics and reporting
- ✅ Data backup and recovery
- ✅ Multi-user support

### Hybrid Benefits
- ✅ Best of both worlds
- ✅ Automatic conflict resolution
- ✅ Graceful degradation
- ✅ Optimized network usage
- ✅ Production-ready error handling

## Implementation Details

### Cart Store Structure

```typescript
interface CartStore {
  items: CartItem[];
  isSyncing: boolean;
  lastSynced: Date | null;
  syncError: string | null;
  
  // Local operations
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Sync operations
  syncWithServer: () => Promise<void>;
  mergeServerCart: (serverItems: CartItem[]) => void;
}
```

### Database Schema

```typescript
interface ICart {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  itemCount: number;
  lastSynced: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ICartItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sku: string;
}
```

### API Endpoints

- `GET /api/cart` - Retrieve user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item quantity
- `DELETE /api/cart` - Remove item from cart
- `POST /api/cart/sync` - Synchronize local and server carts
- `GET /api/cart/sync` - Get server cart for sync

## Usage

### Basic Cart Operations

```typescript
import { useAuthenticatedCart } from '@/hooks/useAuthenticatedCart';

const { addItem, removeItem, updateQuantity, isAuthenticated } = useAuthenticatedCart();

// All operations automatically check authentication
// Unauthenticated users are redirected to sign-in

// Add item (automatically triggers sync after 1 second)
addItem({
  id: 'product-123',
  name: 'Product Name',
  price: 29.99,
  image: '/product-image.jpg',
  sku: 'PROD-123'
});

// Update quantity (automatically triggers sync)
updateQuantity('product-123', 3);

// Remove item (automatically triggers sync)
removeItem('product-123');
```

### Cart Synchronization

```typescript
import { useCartSync } from '@/hooks/useCartSync';

const { sync, isSyncing, lastSynced, syncError } = useCartSync({
  autoSync: true,
  syncInterval: 30000, // 30 seconds
  onSyncError: (error) => console.error('Sync failed:', error)
});

// Manual sync
await sync();
```

### Cart Provider Setup

```typescript
// In your app layout
import { CartProvider } from '@/providers/CartProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

// Cart context is only provided to authenticated users
// Unauthenticated users will not have access to cart operations
```

### Protected Cart Route

```typescript
import { ProtectedCartRoute } from '@/components/ProtectedCartRoute';

// Wrap cart pages with authentication protection
<ProtectedCartRoute>
  <CartPage />
</ProtectedCartRoute>

// Custom fallback for unauthenticated users
<ProtectedCartRoute 
  fallback={<CustomSignInPrompt />}
>
  <CartPage />
</ProtectedCartRoute>
```

### Sync Status Component

```typescript
import { CartSyncStatus } from '@/components/CartSyncStatus';

// Show sync button and status (only for authenticated users)
<CartSyncStatus showSyncButton={true} />

// Show only status (no button)
<CartSyncStatus showSyncButton={false} />
```

## Synchronization Strategy

### Automatic Sync Triggers
1. **User Actions** - Add, remove, update items (debounced by 1 second)
2. **Login** - Sync local cart with server when user authenticates
3. **Periodic** - Sync every 30 seconds for authenticated users
4. **Page Focus** - Sync when user returns to the app

### Conflict Resolution
- **Quantity Conflicts** - Take the higher quantity between local and server
- **New Items** - Merge items from both sources
- **Removed Items** - Remove from both sources
- **Price Updates** - Use server prices for accuracy

### Error Handling
- **Network Errors** - Retry with exponential backoff
- **Validation Errors** - Skip invalid items and continue
- **Authentication Errors** - Queue sync for when user logs in
- **Server Errors** - Log error and show user-friendly message

## Performance Optimizations

### Debouncing
- Cart operations are debounced by 1 second to prevent excessive API calls
- Multiple rapid changes result in a single sync operation

### Batch Operations
- Cart service supports batch updates for multiple items
- Reduces network overhead for bulk operations

### Smart Sync
- Only sync when there are actual changes
- Skip sync if last sync was recent
- Prevent multiple simultaneous syncs

### Caching
- Local storage serves as cache for immediate access
- Server data is fetched only when needed
- Optimistic updates for better UX

## Security Considerations

### Authentication
- **All cart operations require valid session**
- **Cart pages are protected routes**
- **Unauthenticated users are redirected to sign-in**
- User can only access their own cart
- Session validation on every request
- Cart data is isolated per user

### Data Validation
- Input validation on both client and server
- SKU-based product identification
- Quantity limits (1-99 items)

### Rate Limiting
- Built-in debouncing prevents abuse
- API endpoints can be rate-limited
- Exponential backoff for retries

## Monitoring and Analytics

### Sync Metrics
- Last sync timestamp
- Sync success/failure rates
- Sync duration
- Items synced per operation

### Error Tracking
- Network error logging
- Validation error reporting
- Server error monitoring
- User impact assessment

### Performance Metrics
- Cart operation response times
- Sync operation latency
- Database query performance
- Memory usage patterns

## Troubleshooting

### Common Issues

1. **Sync Not Working**
   - Check user authentication
   - Verify network connectivity
   - Check browser console for errors

2. **Items Not Persisting**
   - Verify localStorage is enabled
   - Check for storage quota issues
   - Ensure proper error handling

3. **Cross-Device Sync Issues**
   - Verify user is logged in on both devices
   - Check sync timestamps
   - Manually trigger sync if needed

### Debug Mode

Enable debug logging by setting environment variable:
```bash
NEXT_PUBLIC_CART_DEBUG=true
```

## Future Enhancements

### Planned Features
- **Real-time Sync** - WebSocket-based live updates
- **Conflict Resolution UI** - User choice for conflicts
- **Sync History** - Track all sync operations
- **Bulk Operations** - Import/export cart data
- **Advanced Analytics** - User behavior insights

### Scalability Improvements
- **Redis Caching** - Faster cart operations
- **Queue System** - Background sync processing
- **CDN Integration** - Faster image loading
- **Database Sharding** - Horizontal scaling

## Testing

### Unit Tests
- Cart store operations
- API endpoint functionality
- Validation logic
- Error handling

### Integration Tests
- End-to-end cart flow
- Sync operations
- Authentication flows
- Error scenarios

### Performance Tests
- Load testing with multiple users
- Sync performance under load
- Memory usage patterns
- Network latency impact

## Conclusion

The hybrid cart system provides a robust, scalable solution that balances performance with data persistence. It ensures users have a smooth shopping experience while maintaining data consistency across devices and sessions.

The implementation follows production-grade practices including:
- Comprehensive error handling
- Performance optimization
- Security best practices
- Monitoring and analytics
- Scalable architecture
- Comprehensive testing
