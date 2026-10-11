# QuizHub

QuizHub is an interactive quiz web application developed as a Web Development course project at Jönköping University.

The application allows users to register, log in, browse quizzes, search and filter quizzes, complete quizzes and view their previous results.

Administrators have additional permissions and can create, update and delete quizzes and dynamically manage quiz questions.

The project is built with vanilla JavaScript, Node.js, Express and PostgreSQL.

---

## Features

### User Features

A logged-in user can:

- Register and log in
- Browse available quizzes
- Search quizzes by title
- Filter quizzes by category and difficulty
- Sort quizzes
- Play quizzes
- View question progress while playing
- Receive a final score
- View previous quiz attempts
- Delete their own saved results
- Log out

### Administrator Features

An administrator can:

- Access the Admin Dashboard
- Create quizzes
- Add questions dynamically
- Remove questions dynamically
- Update existing quizzes
- Delete quizzes
- Perform all normal user actions

Admin operations are protected on the server so normal users cannot create, update or delete quizzes.

---

## Technologies

### Client

- HTML5
- CSS3
- Vanilla JavaScript

### Server

- Node.js
- Express

### Database

- PostgreSQL

### Additional Modules

- `pg`
- `cookie-parser`

No client-side JavaScript framework is used.

---

## Course Concepts Demonstrated

QuizHub applies several central concepts from the Web Development course.

### DOM Manipulation

JavaScript dynamically creates, modifies and removes DOM elements.

Examples include:

- Quiz cards
- Result cards
- Dynamic question fields
- Add Question
- Remove Question
- Question numbering
- Search result updates
- Empty-state messages
- Removing deleted results from the interface

---

### Event Handling

The application uses event listeners to respond to user interaction.

Examples include:

- Login
- Logout
- Quiz answers
- Search
- Filtering
- Sorting
- Adding questions
- Removing questions
- Creating quizzes
- Updating quizzes
- Deleting quizzes
- Deleting results

---

### Asynchronous Communication

The Fetch API together with `async` and `await` is used for communication between the client and server.

---

## CRUD Operations

QuizHub implements meaningful CRUD operations for quizzes.

| CRUD | HTTP Method | Function |
|------|-------------|----------|
| Create | POST | Create a new quiz |
| Read | GET | Load quizzes and questions |
| Update | PUT | Edit an existing quiz |
| Delete | DELETE | Delete a quiz |

Main quiz routes:

```text
GET    /api/quizzes
GET    /api/quizzes/questions/:quizId

POST   /api/quizzes
PUT    /api/quizzes/:id
DELETE /api/quizzes/:id
```

The administrator performs these operations through the Admin Dashboard.

---

## Dynamic Quiz Editing

Quiz questions are dynamically generated with JavaScript instead of being permanently hardcoded in the HTML.

For a new quiz, question blocks are created through JavaScript:

```javascript
createQuestionBlock();
createQuestionBlock();
createQuestionBlock();
```

The administrator can then add or remove questions.

When an existing quiz is edited, the application creates question blocks based on the questions received from the server:

```javascript
questions.forEach(question => {

    createQuestionBlock(question);
});
```

This means quizzes are not limited to a fixed number of questions.

---

## Database

QuizHub uses PostgreSQL as a relational database.

The main entities are:

### Quizzes

Stores information such as:

- Title
- Category
- Difficulty
- Creation date

### Questions

Stores:

- Question text
- Four answer alternatives
- Correct answer
- Question order
- Related quiz

### Attempts

Stores:

- Username
- Quiz
- Score
- Total number of questions
- Date

---

## Database Relationships

One quiz can contain many questions:

```text
Quiz 1 ---- * Question
```

One quiz can also have many attempts:

```text
Quiz 1 ---- * Attempt
```

A user may have multiple saved quiz attempts.

---

## Database Transactions

Quiz creation and editing use PostgreSQL transactions when several database operations must succeed together.

Example workflow:

```text
BEGIN -> Create or Update Quiz -> Insert Questions -> COMMIT
```

If something fails:
```text
ROLLBACK
```
This helps prevent the database from being left in a partially updated state.

---

## Authentication

QuizHub uses server-side sessions and cookies.

After a successful login, the server generates a random authentication token:

```javascript
const token =
    crypto.randomBytes(64).toString("hex");
```

The corresponding user information is stored in the server-side session store:

```javascript
sessions[token] = {
    id: user.id,
    username: user.username,
    role: user.role
};
```

The authentication token is then sent to the browser using a signed HTTP-only cookie:

```javascript
res.cookie(
    "authToken",
    token,
    {
        signed: true,
        httpOnly: true,
        sameSite: "lax"
    }
);
```

This allows the server to recognize the logged-in user across multiple HTTP requests.

---

## Authorization

Authentication determines who the user is.

Authorization determines what the user is allowed to do.

QuizHub uses two roles:

```text
user
admin
```

Admin-only routes are protected on the server using authorization middleware.

The same protection is used for:

```text
POST   /api/quizzes
PUT    /api/quizzes/:id
DELETE /api/quizzes/:id
```

The middleware checks the authenticated user's role before allowing the request:

```javascript
if (user.role !== "admin") {

    return res.status(403).json({
        success: false,
        message: "Admin access required."
    });
}
```

This means security does not depend only on hiding the Admin page in the frontend.

The server itself prevents unauthorized admin operations.

---

## User-Owned Results

Users can delete their own saved quiz results.

The server does not trust a username manually sent from the frontend when deleting a result.

Instead, the authenticated username is taken from the user's server session:

```javascript
req.user.username
```

The database query checks both the attempt ID and the authenticated username:

```sql
DELETE FROM attempts
WHERE id = $1
AND username = $2
RETURNING id;
```

This prevents a normal user from deleting another user's result.

---

## Session Logout

When the user logs out, the server removes the stored session:

```javascript
delete sessions[token];
```

The authentication cookie is also removed:

```javascript
res.clearCookie("authToken");
```

The frontend then clears its locally stored display information and returns the user to the homepage.

---

## Search, Filtering and Sorting

The quiz browser provides several interactive features:

- Live search
- Category filtering
- Difficulty filtering
- Sorting

The displayed quiz cards are updated dynamically without reloading the page.

When no quiz matches the selected search or filters, the interface displays:

```text
No quizzes found.
```

---

## Application States

QuizHub handles several important application states.

### Loading

Example:

```text
Loading quizzes...
```

### Empty State

Examples:

```text
No quizzes found.
```

```text
You have not completed any quizzes yet.
```

### Validation Error

Invalid or incomplete form data is rejected before it is stored.

### Authentication Error

Example:

```text
You must be logged in.
```

### Authorization Error

Example:

```text
Admin access required.
```

### Server Error

Server routes use `try` / `catch` and return an error response if an operation fails.

---

## HTTP Status Codes

The API uses HTTP status codes to describe the result of a request.

Examples include:

```text
200 OK
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

For example, trying to perform a protected action after logging out returns:

```text
401 Unauthorized
```

A logged-in normal user attempting an admin-only action receives:

```text
403 Forbidden
```

---

## Validation and Error Handling

Quiz creation and editing validate important data such as:

- Quiz title
- Category
- Difficulty
- Question text
- Answer alternatives
- Correct answer

Server-side operations use error handling:

```javascript
try {

    // Database operation

} catch (error) {

    console.error(error);

    return res.status(500).json({
        success: false,
        message: "Server error."
    });
}
```

Validation prevents invalid data from being stored in the database.

---

## Responsive Design

QuizHub is designed to work on different screen sizes.

CSS media queries are used to adapt the layout.

Responsive changes include:

- Quiz grids becoming single-column layouts
- Navigation adapting to smaller screens
- Forms using smaller padding
- Buttons becoming full-width when appropriate
- Quiz answer grids changing from two columns to one

---

## Accessibility

The project includes accessibility considerations such as:

- Semantic HTML elements
- Form labels
- Visible focus states
- Readable text and contrast
- Buttons for interactive actions
- Clear feedback messages
- Responsive layouts
- Keyboard-accessible standard form controls

---

## Running the Project

### 1. Install Dependencies

From the project root:

```bash
npm install
```

On Windows PowerShell, if needed:

```bash
npm.cmd install
```

---

### 2. Configure Environment Variables

Create a `.env` file in the project root.

Example:

```env
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=your_database_name

COOKIE_SECRET=your_cookie_secret
```

The `.env` file should not be committed to Git.

---

### 3. Start PostgreSQL

Make sure the PostgreSQL database used by QuizHub is running.

---

### 4. Start the Server

Run:

```bash
npm start
```

or on Windows:

```bash
npm.cmd start
```

The application is then available at:

```text
http://localhost:3000/client/index.html
```

---

## Summary of Course Concepts

QuizHub demonstrates:

### Client-Side Development

- DOM selection
- DOM creation
- DOM modification
- DOM removal
- Event listeners
- Form interaction
- Dynamic interfaces
- Web Storage
- URL parameters

### Asynchronous JavaScript

- `fetch()`
- `async`
- `await`
- JSON communication

### HTTP and Client-Server Communication

- GET
- POST
- PUT
- DELETE
- HTTP status codes

### Server Development

- Node.js
- Express
- Routes
- Middleware
- Request and response handling
- Server-side validation

### Database Development

- PostgreSQL
- Relational entities
- Primary keys
- Foreign keys
- SQL queries
- Transactions
- CRUD

### Authentication and Authorization

- HTTP sessions
- Random authentication tokens
- Cookies
- Signed cookies
- HTTP-only cookies
- User roles
- Protected routes
- Logout and session removal

### User Experience

- Search
- Filtering
- Sorting
- Loading states
- Empty states
- Validation feedback
- Error feedback
- Responsive design
- Accessibility

---

## Authors

Developed by Eris Kociaj and Abdullahi Shire Mohamud in the Web Development course project at Jönköping University.