# Student Communication Tracker

A tool built for my mom, a teacher, to keep track of communications with her students while working
from home during the COVID-19 pandemic.

This React application is a purely client-side, no API is necessary. Login is done through Google
and data is stored using Google Drive's application data folder.

## Setup

To use this app you'll need to create a Google API project and enable the Google Drive API. Then
you'll need an OAuth 2.0 Client ID key and an API key.

These keys go into a `.env` file in the root of the project. You can use `.env.example` as a
template.

Once you have that set up, install all the dependencies with `npm i`.

Finally, launch the app with `npm run dev`.

That's it, the app should now be available at http://localhost:8000/
