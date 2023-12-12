# MioBuss

## Description

MioBuss is a comprehensive business management solution designed to streamline administrative tasks and operations. It features user registration, QR code check-ins, and occupancy monitoring, with future plans for adaptation to a wide range of business types.

## Features

- User registration management
- QR code-based check-in system
- Real-time occupancy monitoring

## Prerequisites

Before installing MioBuss, ensure you have [pnpm](https://pnpm.io/installation) installed and AWS credentials properly configured (refer to the AWS CLI [configuration guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)).

## Installation

To set up MioBuss, follow these steps:

1. Clone the repository to your local machine.
2. Inside the `infra` folder, create a `.env.dev` file using the `.env.example` as a template.
3. Install all dependencies with the command:
   ```
   pnpm i
   ```
4. Navigate to the `infra` folder and deploy the necessary AWS infrastructure with:
   ```
   pnpm deploy:dev
   ```
5. Set up your AWS CLI credentials and a profile named `mio-buss-dev`.
6. In the `frontend` folder, create a `.env` file using the `.env.example` as a template.
7. Start the project with:
   ```
   pnpm dev
   ```

## Usage

Once the project is up and running, MioBuss allows you to:

- Register new users into the system.
- Facilitate user check-ins through QR codes.
- Monitor the real-time occupancy levels.

## License

This software and its source code are the exclusive property of MioBuss team. All rights, including but not limited to copyright, distribution, reproduction, modification, and use, are reserved. Unauthorized use, copying, distribution, or modification of this software and its documentation, in whole or in part, is strictly prohibited without the prior written consent of MioBuss team.

---

Created with :heart: by the MioBuss team.
