# Project notes

Basic idea
![Diagram](images/architecture.png)

A Python scraper will periodically visit an external news website, extract the relevant information (headlines, images, article content), and save it into a data store.
The Python backend API will read from that data store and provide endpoints for your frontend to call.
Your Next.js frontend will make requests to your own backend API to get the news, instead of an external one.
