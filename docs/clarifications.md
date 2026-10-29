 My understanding is that the goal is a web application that lets ACME's HR Manager replace Excel for managing salary data for ~10,000 employees across countries. It would cover employee/salary CRUD with search and filters, salary revision history, and an insights dashboard that answers questions such as pay distribution by country, department and role.

Before I finalize the requirements, I have a few clarifying questions. I've included my current assumption for each so you can simply confirm or correct it:

1. UI framework: The brief mentions "AngularJS for Java". Since I'm applying for a Java role, is Angular required, or is React acceptable with a Spring Boot backend?
   My assumption: Spring Boot + React.

2. Users & access: Is the HR Manager the only user, or should multiple roles be supported (e.g., admin vs. read-only)?
   My assumption: A single HR Manager role with basic authentication.

3. Multi-currency: Should salaries be stored in local currency, with org-wide analytics normalized to a single currency (e.g., USD)? Are static exchange rates acceptable?
   My assumption: Local currency storage; USD normalization using static rates.

4. Salary structure: Is base salary sufficient, or should bonus/allowances be modelled? Is salary revision history expected?
   My assumption: Base salary with revision history.

5. Insights: Are there specific questions the HR Manager most needs answered?
   My assumption: Pay statistics (average/median/min/max) by country, department and job title, plus pay outliers.

6. Data import/export: Since the team currently uses Excel, is import/export expected?
   My assumption: CSV export; import as a stretch goal.

7. Deployment: Is there a preferred hosting platform, or is any free-tier cloud deployment acceptable?
