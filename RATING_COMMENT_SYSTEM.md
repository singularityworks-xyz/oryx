# Rating and Comment System

This document describes the comprehensive rating and comment system implemented for the Oryx e-commerce platform.

## Overview

The system allows users to:
- Rate products on a 1-5 star scale
- Comment on products (only after rating them)
- View their rating and comment history
- Reply to comments
- Edit and delete their own comments
- See average ratings and comment counts on product pages

## Key Features

### 1. Rating System
- **Scale**: 1-5 stars (whole numbers only)
- **Validation**: Users can only rate each product once
- **Updates**: Users can change their rating
- **Deletion**: Users can remove their ratings
- **Automatic Updates**: Product average ratings update automatically

### 2. Comment System
- **Prerequisite**: Users must rate a product before commenting
- **Content**: Up to 1000 characters per comment
- **Replies**: Support for nested comments
- **Editing**: Users can edit their own comments
- **Deletion**: Users can delete their own comments
- **Moderation**: Admins can delete any comment

### 3. User Experience
- **History**: Users can view all their ratings and comments
- **Pagination**: Efficient loading with pagination
- **Sorting**: Comments can be sorted by date or likes
- **Real-time Updates**: UI updates immediately after actions

## Database Models

### Rating Model (`src/models/Rating.ts`)
```typescript
interface IRating {
  user: mongoose.Types.ObjectId;      // Reference to User
  product: mongoose.Types.ObjectId;   // Reference to Product
  rating: number;                     // 1-5 star rating
  createdAt: Date;
  updatedAt: Date;
}
```

**Features:**
- Compound unique index on user + product
- Automatic product rating updates
- Rating distribution calculations
- User rating history methods

### Comment Model (`src/models/Comment.ts`)
```typescript
interface IComment {
  user: mongoose.Types.ObjectId;      // Reference to User
  product: mongoose.Types.ObjectId;   // Reference to Product
  content: string;                    // Comment text (max 1000 chars)
  isEdited: boolean;                  // Edit tracking
  editedAt?: Date;                    // Last edit timestamp
  likes: mongoose.Types.ObjectId[];   // User likes
  replies: mongoose.Types.ObjectId[]; // Nested comments
  parentComment?: mongoose.Types.ObjectId; // For replies
  createdAt: Date;
  updatedAt: Date;
}
```

**Features:**
- Nested comment support
- Edit tracking
- Like system
- Pagination and sorting methods
- User comment history

### Updated User Model
```typescript
interface IUser {
  // ... existing fields
  ratings: mongoose.Types.ObjectId[];  // User's ratings
  comments: mongoose.Types.ObjectId[]; // User's comments
}
```

### Updated Product Model
```typescript
interface IProduct {
  // ... existing fields
  averageRating: number;              // Calculated average
  totalRatings: number;               // Total rating count
  ratings: mongoose.Types.ObjectId[]; // Rating references
  comments: mongoose.Types.ObjectId[]; // Comment references
}
```

## API Endpoints

### Ratings API (`/api/ratings`)
- `GET` - Get product ratings and statistics
- `POST` - Create or update a rating
- `DELETE` - Delete a rating

### Comments API (`/api/comments`)
- `GET` - Get product comments with pagination
- `POST` - Create a comment or reply
- `PUT` - Update a comment
- `DELETE` - Delete a comment

### User API (`/api/user/`)
- `GET /ratings` - Get user's rating history
- `GET /comments` - Get user's comment history
- `GET /can-comment` - Check if user can comment on a product

## Frontend Components

### RatingSystem Component
- Displays overall product rating
- Shows rating distribution
- Allows users to rate/update/delete ratings
- Real-time updates

### CommentSystem Component
- Comment form (only visible after rating)
- Comment list with pagination
- Reply functionality
- Edit/delete options for own comments
- Sorting options

### UserProfile Component
- User's rating history
- User's comment history
- Tabbed interface
- Pagination for both sections

## Custom Hook

### useRatingsAndComments
Provides all the functionality for:
- Rating management
- Comment management
- Permission checking
- User history
- Error handling
- Loading states

## Business Rules

### Rating Requirements
1. Users must be authenticated to rate products
2. One rating per user per product
3. Ratings must be whole numbers 1-5
4. Product average ratings update automatically

### Comment Requirements
1. Users must be authenticated to comment
2. Users must rate a product before commenting
3. Comments have a 1000 character limit
4. Users can only edit/delete their own comments
5. Admins can delete any comment

### Data Integrity
- Automatic reference updates when ratings/comments are created/deleted
- Cascade updates for nested comments
- Edit tracking for comments
- Timestamp tracking for all actions

## Security Features

- Authentication required for all write operations
- User ownership validation for edits/deletes
- Input validation and sanitization
- Rate limiting considerations (can be added)
- SQL injection protection via Mongoose

## Performance Optimizations

- Database indexes on frequently queried fields
- Pagination for large datasets
- Efficient aggregation queries for statistics
- Lazy loading of comment replies
- Optimized database queries with population

## Usage Examples

### Adding a Rating
```typescript
const { rateProduct } = useRatingsAndComments();
const result = await rateProduct(productId, 5);
```

### Creating a Comment
```typescript
const { createComment } = useRatingsAndComments();
const result = await createComment(productId, "Great product!");
```

### Checking Comment Permission
```typescript
const { checkCanComment } = useRatingsAndComments();
const { canComment, userRating } = await checkCanComment(productId);
```

## Future Enhancements

1. **Moderation System**: Admin tools for comment moderation
2. **Spam Protection**: Rate limiting and content filtering
3. **Rich Content**: Image and emoji support in comments
4. **Notification System**: Notify users of replies and likes
5. **Analytics**: Detailed rating and comment analytics
6. **Export**: User data export functionality
7. **Mobile Optimization**: Touch-friendly rating interface

## Testing

The system includes comprehensive error handling and validation:
- Input validation
- Permission checks
- Database constraint handling
- User feedback for all operations
- Loading states and error messages

## Deployment Notes

1. Ensure MongoDB indexes are created
2. Monitor database performance with new collections
3. Consider implementing caching for frequently accessed ratings
4. Set up monitoring for comment spam and abuse
5. Regular database maintenance for comment cleanup

## Support

For technical support or questions about the rating and comment system, please refer to the codebase or contact the development team.

