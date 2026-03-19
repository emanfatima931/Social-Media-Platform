# SocialNetwork Platform

A real-time social media platform with posts, friend connections, image sharing, and interactive engagement features.

## Features

- User Authentication: Register and login with email and password
- Post Creation: Share text posts with optional image attachments
- Friend System: Send friend requests, accept/reject, and manage friend list
- Engagement: Like posts and add comments
- Real-time Updates: WebSocket support for live notifications and updates
- User Profiles: View and edit user profiles with bio and profile pictures
- Search Functionality: Find and connect with other users
- Responsive Design: Works on desktop and mobile devices
- Local Storage: All data persists using browser local storage

## Project Structure

```
Social Media Platform/
├── index.html              # Home page with feed and post creation
├── css/
│   └── style.css          # Main styling for all pages
├── js/
│   ├── app.js             # Main application logic
│   ├── auth.js            # Authentication and user management
│   └── data.js            # Database and data management
├── pages/
│   ├── login.html         # Login page
│   ├── register.html      # User registration page
│   ├── profile.html       # User profile page
│   └── friends.html       # Friends management page
├── server.js              # WebSocket server for real-time updates
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

## Setup Instructions

### Requirements
- Node.js (v14 or higher)
- Modern web browser

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Social\ Media\ Platform
```

2. Install dependencies
```bash
npm install
```

3. Start the WebSocket server
```bash
npm start
```

4. Open in browser
```
Open index.html in your web browser or serve through a local server
URL: http://localhost:8081 (for WebSocket connection)
```

## Usage

### Creating an Account
1. Click on Register link on login page
2. Enter your name, email, password, and optional bio
3. Click Create Account to register

### Demo Accounts
Pre-loaded demo accounts available:
- Email: alice@example.com | Password: password123
- Email: bob@example.com | Password: password123
- Email: carol@example.com | Password: password123

### Posting
1. Enter text in the share input field
2. Optionally attach an image
3. Click Post to share

### Friend Management
1. Navigate to Friends page
2. View your connected friends
3. Manage pending friend requests
4. Search for new users to add

### Engagement
1. Click heart icon to like a post
2. Click comment icon to add a comment
3. View engagement stats on your profile

## Technologies Used

- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend: Node.js, Express.js
- Real-time Communication: WebSocket (ws library)
- Data Storage: Browser Local Storage
- Server: Node.js with Express

## Dependencies

- express: Web server framework
- ws: WebSocket library for real-time communication
- cors: Cross-Origin Resource Sharing middleware

## API Endpoints

- GET /health - Server health check

## WebSocket Events

- USER_ONLINE: User comes online
- POST_CREATED: New post created
- POST_LIKED: Post liked by user
- COMMENT_ADDED: New comment added
- FRIEND_REQUEST_SENT: Friend request sent
- FRIEND_REQUEST_ACCEPTED: Friend request accepted
- NOTIFICATION_CREATED: New notification
- TYPING: User typing indicator
- USER_OFFLINE: User goes offline

## Features Details

### Authentication System
- Email-based registration and login
- Password validation (minimum 6 characters)
- Session management with localStorage
- Automatic login redirect for authenticated users

### Post Management
- Create posts with text and images
- View posts in chronological order
- Like/unlike functionality
- Comment on posts
- Image storage as base64 data

### Friend System
- Send friend requests to other users
- Accept or reject friend requests
- View friend list
- Remove friends
- Friend suggestions

### User Profiles
- Public profile pages
- Edit profile information and bio
- View user statistics (posts, friends, likes)
- Customizable profile pictures

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Data Persistence

All data is stored in the browser's localStorage:
- usersDB: User accounts and profiles
- postsDB: All posts and engagement data
- friendRequestsDB: Pending friend requests
- notificationsDB: User notifications
- currentUser: Currently logged-in user

## Security Notes

This is a demonstration project. For production use:
- Implement server-side authentication
- Use secure password hashing
- Implement authorization and permissions
- Use HTTPS for WebSocket connections
- Add input validation and sanitization
- Implement rate limiting

## Future Enhancements

- Direct messaging between users
- Post sharing and reposting
- Hashtag support
- User blocking
- Post deletion and editing
- Image filters and editing
- Notification preferences
- Dark mode theme
- Advanced search filters

## Contributing

Contributions are welcome. Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Support

For issues and questions, please open an issue on the GitHub repository.

## Authors

Created as a social media platform demonstration project.
