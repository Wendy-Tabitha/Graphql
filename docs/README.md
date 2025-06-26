# Graphql

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
├── index.html      # Main entry point (UI, layout, and view containers)
├── style.css       # Styles (theme, layout, animations)
├── main.js         # All JavaScript logic (auth, GraphQL, profile, charts)
└── assets/         # (Optional) Static assets like logo.svg
```

## Setup

- Open `index.html` in a web browser or serve it using a local web server.
- Ensure `main.js` and `style.css` are in the same directory as `index.html`.
- The app connects to the Zone01 API at **https://learn.zone01kisumu.ke** by default. To change the  API domain, update API_BASE_URL in main.js.

## How It Works

### Authentication

- The login form is shown by default.
- Users authenticate with their username/email and password.
- On successful login, a JWT token is stored in localStorage and used for all GraphQL requests.
- Logout removes the token and returns to the login form with a fade-out animation and page reload.

### Profile & Dashboard

- After login, the profile view is shown with a fade-in animation.
- The dashboard displays:
User info (login, user ID, account status)
XP summary (total XP, top projects by XP)
Grades summary (pass/fail ratio, projects by type)
Interactive SVG charts (XP over time, Pass/Fail ratio)
- Navigation sidebar allows switching between sections (Overview, XP Progress, Grades, Statistics).

### Charts
- Line Chart: Cumulative XP over time (by month)
- Pie Chart: Project pass/fail ratio
- Charts are interactive and animated using SVG (no external libraries)

### Animations
- Smooth fade-in/fade-out transitions between login and profile views
- Animated chart rendering and tooltips

## GraphQL Queries

The application uses several GraphQL queries:

1. User Profile:
   ```graphql
   {
     user {
       id
       login
     }
   }
   ```

2. XP Progress:
   ```graphql
   {
     transaction(where: {type: {_eq: "xp"}}) {
       id
       amount
       createdAt
       path
       objectId
       object {
         name
         type
       }
     }
   }
   ```

3. Grades & Results:
   ```graphql
   {
     progress {
       id
       userId
       objectId
       grade
       createdAt
       updatedAt
       path
       object {
         name
         type
       }
     }
     result {
       id
       objectId
       userId
       grade
       createdAt
       updatedAt
       path
       object {
         name
         type
       }
     }
   }
   ```

## Browser Support

The application works in all modern browsers that support:
- ES6+ JavaScript
- SVG
- CSS Grid
- CSS Custom Properties

## License

MIT License - See LICENSE file for details 