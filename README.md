# Rating and Comment System

A comprehensive rating and comment system for e-commerce products, built with Next.js, MongoDB, and NextAuth.

## Overview

This system allows users to rate products (1-5 stars) and leave comments, with the business rule that users can only comment after rating a product. The system includes like/dislike functionality for comments and ensures users can manage their own content.

## Key Features

- **Product Ratings**: 1-5 star rating system with average calculations
- **Product Comments**: Text-based comments with like/dislike functionality
- **User Authentication**: Secure access using NextAuth
- **Business Rules**: Users must rate before commenting
- **Content Management**: Users can edit and delete their own comments
- **Like/Dislike System**: Users can like or dislike comments (mutually exclusive)
- **Pagination**: Efficient loading of comments and ratings
- **Real-time Updates**: Automatic recalculation of product ratings

## Database Models

### Rating Model
```typescript
interface IRating {
  user: mongoose.Types.ObjectId;      // Reference to User
  product: mongoose.Types.ObjectId;    // Reference to Product
  rating: number;                      // 1-5 star rating
  createdAt: Date;
  updatedAt: Date;
}
```

**Features:**
- Compound unique index on user + product (prevents multiple ratings)
- Automatic product average rating updates
- Validation for rating range (1-5)

### Comment Model
```typescript
interface IComment {
  user: mongoose.Types.ObjectId;      // Reference to User
  product: mongoose.Types.ObjectId;    // Reference to Product
  content: string;                     // Comment text (max 1000 chars)
  isEdited: boolean;                   // Track edit status
  editedAt?: Date;                     // Edit timestamp
  likes: mongoose.Types.ObjectId[];    // Array of user IDs who liked
  dislikes: mongoose.Types.ObjectId[]; // Array of user IDs who disliked
  createdAt: Date;
  updatedAt: Date;
}
```

**Features:**
- Content validation and length limits
- Edit tracking with timestamps
- Like/dislike system (mutually exclusive)
- Business rule enforcement (rating required before commenting)

### Updated User Model
```typescript
interface IUser {
  // ... existing fields
  ratings: mongoose.Types.ObjectId[];  // References to Rating documents
  comments: mongoose.Types.ObjectId[]; // References to Comment documents
}
```

### Updated Product Model
```typescript
interface IProduct {
  // ... existing fields
  averageRating: number;               // Calculated average rating
  totalRatings: number;                // Count of total ratings
  ratings: mongoose.Types.ObjectId[];  // References to Rating documents
  comments: mongoose.Types.ObjectId[]; // References to Comment documents
}
```

## API Endpoints

### Ratings
- `GET /api/ratings?productId={id}` - Get product ratings and statistics
- `POST /api/ratings` - Create or update user rating
- `DELETE /api/ratings?productId={id}` - Delete user rating

### Comments
- `GET /api/comments?productId={id}&page={page}&limit={limit}&sortBy={field}&sortOrder={asc|desc}` - Get product comments
- `POST /api/comments` - Create new comment
- `PUT /api/comments` - Update existing comment
- `DELETE /api/comments?commentId={id}` - Delete comment

### Comment Reactions
- `POST /api/comments/like` - Toggle like on comment
- `POST /api/comments/dislike` - Toggle dislike on comment

### User Data
- `GET /api/user/ratings?page={page}&limit={limit}` - Get user's rating history
- `GET /api/user/comments?page={page}&limit={limit}` - Get user's comment history
- `GET /api/user/can-comment?productId={id}` - Check if user can comment

## Frontend Components

### RatingSystem Component
- Displays product rating statistics
- Interactive star rating input
- Rating distribution chart
- User rating management

### CommentSystem Component
- Comment list with pagination
- Comment creation form (requires rating)
- Like/dislike buttons for each comment
- Edit and delete functionality for user's own comments
- Sorting options (date, likes)

## Custom Hook

### useRatingsAndComments
Provides a unified interface for all rating and comment operations:
- `rateProduct()` - Submit product rating
- `getProductRatings()` - Fetch rating data
- `deleteRating()` - Remove user rating
- `getProductComments()` - Fetch paginated comments
- `createComment()` - Add new comment
- `updateComment()` - Edit existing comment
- `deleteComment()` - Remove comment
- `toggleCommentLike()` - Like/unlike comment
- `toggleCommentDislike()` - Dislike/undislike comment
- `checkCanComment()` - Verify comment permission
- `getUserRatings()` - Fetch user rating history
- `getUserComments()` - Fetch user comment history

## Business Rules

1. **Rating Requirement**: Users must rate a product before commenting
2. **Single Rating**: Users can only rate each product once
3. **Content Ownership**: Users can only edit/delete their own comments
4. **Mutual Exclusivity**: Users cannot like and dislike the same comment simultaneously
5. **Content Limits**: Comments limited to 1000 characters

## Security Features

- **Authentication Required**: All operations require valid user session
- **Ownership Validation**: Users can only modify their own content
- **Input Validation**: Server-side validation of all inputs
- **Rate Limiting**: Built-in protection against abuse
- **XSS Prevention**: Proper content sanitization

## Performance Optimizations

- **Database Indexing**: Strategic indexes on frequently queried fields
- **Pagination**: Efficient loading of large datasets
- **Population**: Smart population of related data
- **Caching**: Next.js built-in caching mechanisms
- **Middleware**: Efficient pre/post-save operations

## Usage Examples

### Basic Rating
```typescript
const { rateProduct } = useRatingsAndComments();
const result = await rateProduct('product123', 5);
```

### Adding Comment
```typescript
const { createComment } = useRatingsAndComments();
const comment = await createComment('product123', 'Great product!');
```

### Liking a Comment
```typescript
const { toggleCommentLike } = useRatingsAndComments();
await toggleCommentLike('comment123');
```

### Fetching Comments
```typescript
const { getProductComments } = useRatingsAndComments();
const result = await getProductComments('product123', 1, 10, 'createdAt', 'desc');
```

## Future Enhancements

- **Comment Moderation**: Admin tools for content management
- **Rating Analytics**: Advanced rating insights and trends
- **Notification System**: Alerts for replies and reactions
- **Content Filtering**: Spam detection and content moderation
- **Mobile Optimization**: Enhanced mobile user experience

## Testing

- **Unit Tests**: Model validation and business logic
- **Integration Tests**: API endpoint functionality
- **E2E Tests**: Complete user workflows
- **Performance Tests**: Database query optimization

## Deployment

- **Environment Variables**: Configure MongoDB connection and NextAuth
- **Database Setup**: Ensure proper indexes and collections
- **Monitoring**: Track system performance and user engagement
- **Backup**: Regular database backups and recovery procedures

## Dependencies

- **Next.js 14**: React framework with API routes
- **MongoDB**: Document database with Mongoose ODM
- **NextAuth**: Authentication and session management
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling

## Getting Started

1. Install dependencies: `npm install`
2. Configure environment variables
3. Set up MongoDB database
4. Run development server: `npm run dev`
5. Access the application at `http://localhost:3000`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Submit a pull request
5. Ensure all tests pass

## License

This project is licensed under the MIT License.
