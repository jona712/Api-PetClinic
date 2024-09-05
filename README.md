# API PetClinic

Local API. 

## Description

The "API PetClinic" serves as a local API developed in Node.js for managing data related to a veterinary clinic. It uses Prisma for database management with MySQL, allowing for efficient CRUD operations on clinic data. The API follows a modular architecture with clear separation of concerns, enabling smooth interaction between models, controllers, and services.

### Key Components:

- **Models**: Represent the data structures used in the application. They interact with the MySQL database to perform CRUD operations and manage data retrieval and manipulation using Prisma ORM.
- **Controllers**: Handle incoming requests, process data, and interact with the models to perform operations. They contain the business logic and control the flow of data.
- **Scheduled Tasks**: Implemented using Node Cron to handle periodic tasks such as sending appointment reminders.
- **Email Notifications**: Managed with Nodemailer to send automatic email reminders for upcoming appointments.

## Technologies Used

- ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1C?style=flat-square&logo=javascript&logoColor=white) JavaScript - The programming language used for API development.
- ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white) Node.js - The runtime environment used for API development.
- ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white) Prisma - The ORM used for interacting with the MySQL database.
- ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) MySQL - Database management system used for storing clinic data.
- ![Node Cron](https://img.shields.io/badge/-Node%20Cron-8A2B8A?style=flat-square&logo=node.js&logoColor=white) Node Cron - Used for scheduling tasks such as appointment reminders.
- ![Nodemailer](https://img.shields.io/badge/-Nodemailer-00796B?style=flat-square&logo=nodemailer&logoColor=white) Nodemailer - A module for sending email notifications.
