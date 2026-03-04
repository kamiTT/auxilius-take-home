## Real-Time Task Board

### Summary
A collaborative task management application that enables teams to organize and track work in real-time across a Kanban-style board. Built with Express, React, and Socket.IO for seamless multi-user collaboration.

### Setup
#### Prerequisites
- Docker and Docker Compose installed
- Node.js (if running locally without Docker)

Create a `.env.development` in the root of the project directory with the values found in `.env.example`. None of the environment variables need to be changed other than `DB_PASSWORD` which will need a value.

#### Quick Start
```bash
docker compose --env-file .env.development up --build
```


### Features
- Username login
- Three column Kanban-styled task board with three categories: to-do, in-progress, and done
- Users can create, update, and delete tasks from the dashboard
- Real-time task collaboration using Socket.IO:
  - `task:created`, `task:updated`, `task:deleted` 
- Client-side form validation
- Server-side validation
- Persistent data for both tasks and users in the database
- Dockerized application

### Database Schema
Database migrations can be found in `apps/backend/migrations`

Seeder file for tasks provided and found in `apps/backend/seeders`

Entities in the database use UUID as their primary key to avoid collisions.

Only item in the tasks table that is not enforced to not be null is the description, because that is optional. 

### API
#### Endpoints

### System Architecture Overview

1. Frontend logs in and fetches tasks via REST.
2. Frontend opens Socket.IO connection.
3. Task create/update/delete hits API, API writes to Postgres, then emits socket events.
4. All connected clients receive task events and UI updates without refresh.

### Technical Decisions and Trade-offs
- Express API
- Sequelize + sequelize-cli 
    - Database management
    - Pros: repeatable schema lifecycle and local setup consistency
    - Cons: additional tooling and migration discipline required
- dotenv
    - Straightforward local/container env file loading
- Tailwind CSS for quick styling

### Known Limitations
- Authorization/ownership rules are not enforced (all users can view/edit/delete all tasks)
- No automated testing
- Error handling is functional but basic
- Tasks are not locked when a user is editing, so race conditions exist if more than one person wants to edit a task at a time

### What you would add/improve with more time
- I had a bug when a user creates a new task. The new task will appear on their dashboard twice (bad), but it would only appear in the database and to other users once (good). I had to use an extremely naive approach to de-dupe rather than finding the root of the issue.

- I would have liked have implemented more component packages to simplify code (i.e react-toastify) 

- While using Codex to help build the application, it built the backend with Javascript and the frontend in typescript. While this works, I would have preferred to have the entire application in typescript. 

- I would have loved to add a drag and drop as a method to update the status of a task. 

- The validation handling in the api could be more elegant

- I would have preferred to not use Tailwind for styling as a personal preference, but its good for styling quickly. 

### Time Log
- 10% Initial setup of monorepo, dockerizing, formatting, and file exclusion
- 30% Getting CRUD api & database setup and working with environment variables 
- 45% Implementing frontend & making sure everything connected properly. Implementing sockets took ~10% of this time
- 15% Error remediation and cleanup