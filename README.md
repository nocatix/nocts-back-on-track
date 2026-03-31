# Back on Track

Your personal addiction recovery companion. A Node.js application for tracking your recovery journey, providing a personalized experience to monitor progress and stay motivated.

## Features
* **User Authentication**: Secure registration and login system with JWT tokens
* **Recovery Dashboard**: A user-friendly dashboard to view all tracked addictions and daily predictions
* **Add New Addiction**: Create new addiction tracking entries with:
    + Name of the addiction (or custom entry)
    + Date and time when stopped
    + Frequency of use per day
    + Money spent per day
    + Additional notes
* **Individual Addiction Page**: Dedicated page for each addiction showing:
    + Name of the addiction
    + Time elapsed since stopping (in days)
    + Total money saved (calculated automatically)
    + Daily usage frequency
    + Money spent per day
    + Interactive withdrawal timeline with milestones and symptoms
    + Personalized motivational messages
* **Withdrawal Timelines**: Pre-built timelines for common addictions with:
    + Day-by-day milestones
    + Expected symptoms and their severity
    + Progress tracking visual indicators
    + Motivational messages at each milestone
* **Meditation & Mindfulness**: Guided meditations with embedded YouTube music players
* **Recovery Diary**: Write daily reflections with markdown support
* **Wordle Game**: Guess 5-letter recovery words in 6 attempts
* **Achievement System**: Unlock milestones and receive notifications
* **Dark Mode**: Full dark mode support with system preference detection
* **Privacy-Focused**: All data stays on your device or private server

## Technical Stack
* **Backend**:
    + Node.js as the runtime environment
    + Express.js for the REST API framework
    + MongoDB for data persistence
    + JWT for secure authentication
    + bcryptjs for password hashing
    + CORS for cross-origin requests
* **Frontend**:
    + React for the user interface
    + React Router for client-side routing
    + Axios for HTTP requests
    + Custom CSS with CSS variables for theming
    + Dark mode support

## Project Structure
```
back-on-track/
├── server/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Addiction.js
│   │   ├── Achievement.js
│   │   └── Diary.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── addictions.js
│   ├── middleware/
│   │   └── auth.js
│   └── index.js
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── MainMenu.js
│   │   │   ├── AddNewAddiction.js
│   │   │   └── AddictionDetail.js
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── AddictionCard.js
│   │   │   └── WithdrawalTimeline.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── styles/ (CSS files)
│   │   ├── App.js
│   │   └── index.js
│   └── public/
│       └── index.html
├── package.json
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites
* Node.js (v14 or higher)
* MongoDB (running locally or cloud instance)
* npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd back-on-track
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your MongoDB URI and JWT secret:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/back-on-track
   JWT_SECRET=your_secure_jwt_secret_key
   NODE_ENV=development
   ```

3. **Install backend dependencies**
   ```bash
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

3. **In another terminal, start the frontend**
   ```bash
   npm run client
   ```
   The React app will open at `http://localhost:3000`

### API Endpoints

#### Authentication
* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Login user

#### Addictions
* `GET /api/addictions` - Get all addictions for logged-in user
* `GET /api/addictions/:id` - Get specific addiction details
* `POST /api/addictions` - Create new addiction entry
* `PUT /api/addictions/:id` - Update addiction entry
* `DELETE /api/addictions/:id` - Delete addiction entry

## Usage

1. **Register/Login**: Create an account or log in with existing credentials
2. **Add Addiction**: Click "Add New Addiction" and fill in the details
3. **View Progress**: See your addiction on the main menu with days stopped and money saved
4. **Check Timeline**: Click on an addiction to view detailed withdrawal timeline and milestones
5. **Track Progress**: Money saved is calculated automatically based on days and daily cost

## Future Development
* Implement social features for users to share experiences
* Add push notifications for milestone achievements
* Integrate with wearable devices for health metrics
* Create mobile app version
* Add support for group challenges
* Implement AI-powered motivational messages
* Add community forum functionality
* Create relapse warning system with support resources

## Contributing
Feel free to fork this project and submit pull requests for any improvements.

## License
MIT License