## Database: PostgreSQL over SQLite
- **Why:** Native percentile functions (median, pay bands) for salary analytics; production-realistic for a deployed multi-user web app; managed hosting widely available.
- **Trade-off:** Requires a running Postgres server locally, unlike SQLite's zero setup.
- **Mitigation:** Docker Compose for one-command local setup; deployed demo link for reviewers.