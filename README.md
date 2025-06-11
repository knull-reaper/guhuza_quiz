# Guhuza’s Brain Boost

The Guhuza’s Brain Boost is an interactive game designed to engage users with job search-related questions. Players earn points for correct answers, compete on a leaderboard, and share scores on social media to increase visibility.

## Features

- **Job Search Quiz**: Users answer job-related questions to earn points.
- **Leaderboard**: Track and compare scores with other users.
- **Social Sharing**: Share quiz results and achievements on social media.
- **Friend Invites**: Invite friends via text or email to encourage growth.
- **Rewards**: Earn rewards for streaks and achievements.
- **Mobile-Friendly**: Fully responsive design for desktop, tablet, and mobile devices.

## Technologies Used

- **Frontend**: React.js, Next.js, TypeScript
- **Backend**: MySQL, Prisma
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR
- **UI Components**: shadcn/ui (as per initial prompt context, though not explicitly added by me yet), NextTopLoader

## Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables:

\`\`\`env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
NEXTAUTH_URL="http://localhost:3000" # Or your production URL
NEXTAUTH_SECRET="YOUR_VERY_SECRET_KEY_HERE" # Generate a strong secret key
GUHUZA_API="YOUR_GUHUZA_API_ENDPOINT" # Base URL for the Guhuza member API
\`\`\`

Replace placeholder values with your actual configuration. `NEXTAUTH_SECRET` can be generated using `openssl rand -base64 32`.

## Installation

To run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/knull-reaper/guhuza_quiz.git
   cd guhuza-quiz-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables as described in the "Environment Variables" section.

### Database Migrations

This project uses Prisma for database management. After cloning and installing dependencies, and after any changes to the `prisma/schema.prisma` file, run migrations:

To apply existing migrations (or initialize the database if it's the first time):
\`\`\`bash
npx prisma migrate deploy
\`\`\`

To create a new migration after schema changes (during development):
\`\`\`bash
npx prisma migrate dev --name your_migration_name
\`\`\`
For the gamification features added, the following migration was created:
\`\`\`bash
npx prisma migrate dev --name gamification
\`\`\`

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Visit the app at `http://localhost:3000` to start playing!

## Contributing

Feel free to fork the repository, create a branch, and submit pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
