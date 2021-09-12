#  Elevator Simulator

This app simulates 2 elevators moving to different floors within an apartment building!  A person appears, calls the elevator, then the nearest available elevator takes the request and starts moving towards the person's floor

This is a NextJS frontend that makes a realtime web socket connection to an ExpressJS backend server

People updates include:
- Spawn/re-spawn into existence
- Request an elevator
- Get into an elevator
- Push the button for their destination floor once they are in the elevator
- Get off the elevator when they've reached their destination floor
- Un-spawn from the app

Elevators updates include:
- Take requests to pick up people
- Move between floors
- Open doors when they reach their destination
- Close doors when the person has pressed the button for their destination floor



**Technology stack:**

- NextJS (static site generation framework)
- React (javascript HTML rendering library :)
- Typescript (typing for javascript)
- Sass (CSS extension)
- Tailwind (CSS library)
- eslint (javascript code linting)
- ExpressJS (nodejs web server)
- SocketIO (web sockets)
- Prettier (opinionated code style formatting)

**Additional packages used:**

- date-fns (JS date formatting)
- gray-matter (parsing markdown front matter)
- reduxjs toolkit (helpers for writing redux code)
- remark (rendering markdown files as HTML)

**Code Linting:**

Code linting is done with the `eslint:recommended`, react recommended and typescript recommended rules.  Prettier is also used with a few custom rule changes