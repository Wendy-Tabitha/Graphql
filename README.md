# NodePro

A modern, responsive web application that displays user profile information and statistics using GraphQL.

## Features

- 🔐 Secure authentication with JWT
- 📊 Interactive SVG charts and graphs
- 📱 Responsive design for all devices
- 🎨 Modern UI with smooth animations
- 🔄 Real-time data updates

## Project Structure

```
graphql-profile/
├── index.html              # Main entry point
├── style.css              # Styles
├── script/
│   ├── auth.js            # Authentication logic
│   ├── graphql.js         # GraphQL queries
│   ├── profile.js         # Profile rendering
│   ├── charts.js          # SVG chart generation
│   └── utils.js           # Helper functions
├── assets/
│   └── logo.svg           # Application logo
└── deploy/                # Deployment configuration
```

## Setup

1. Replace `((DOMAIN))` in the following files with your API domain:
   - `script/auth.js`
   - `script/graphql.js`

2. Open `index.html` in a web browser or serve it using a local web server.

## API Endpoints

- Authentication: `https://((DOMAIN))/api/auth/signin`
- GraphQL: `https://((DOMAIN))/api/graphql-engine/v1/graphql`

## GraphQL Queries

The application uses several GraphQL queries:

1. User Profile:
   ```graphql
   query GetUserProfile {
     user {
       id
       login
       totalXP
       grade
       projects {
         id
         name
         status
         attempts
         lastAttempt
       }
     }
   }
   ```

2. XP Progress:
   ```graphql
   query GetXPProgress {
     xpProgress {
       date
       amount
     }
   }
   ```

3. Project Statistics:
   ```graphql
   query GetProjectStats {
     projectStats {
       total
       passed
       failed
       attempts {
         projectId
         count
       }
     }
   }
   ```

4. Audit History:
   ```graphql
   query GetAuditHistory {
     audits {
       date
       type
       status
       details
     }
   }
   ```

## Charts

The application includes three types of SVG charts:

1. Line Chart: XP Progress over time
2. Pie Chart: Project success rate
3. Bar Chart: Audit history

All charts are responsive and include animations for a better user experience.

## Browser Support

The application works in all modern browsers that support:
- ES6+ JavaScript
- SVG
- CSS Grid
- CSS Custom Properties

## License

MIT License - See LICENSE file for details 