# mi-gym

## Description

mi-gym is a comprehensive business management solution designed to streamline administrative tasks and operations. Initially developed for gym management, it features user registration, QR code check-ins, and occupancy monitoring, with future plans for adaptation to a wide range of business types.

## Features

- User registration management
- QR code-based check-in system
- Real-time occupancy monitoring

## Prerequisites

Before installing mi-gym, ensure you have [pnpm](https://pnpm.io/installation) installed and AWS credentials properly configured (refer to the AWS CLI [configuration guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)).

## Installation

To set up mi-gym, follow these steps:

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
5. Set up your AWS CLI credentials and a profile named `mi-gym-dev`.
6. In the `frontend` folder, create a `.env` file using the `.env.example` as a template.
7. Start the project with:
   ```
   pnpm dev
   ```

## Usage

Once the project is up and running, mi-gym allows you to:

- Register new users into the system.
- Facilitate user check-ins through QR codes.
- Monitor the real-time occupancy levels.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## License

[Insert License Information Here]

## Authors and Acknowledgements

Thanks to all contributors who have participated in this project.

## Project Status

This project is in active development. Contributors are encouraged to join the project and contribute to its growth.

---

Created with :heart: by the mi-gym team.
