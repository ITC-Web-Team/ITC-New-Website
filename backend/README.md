# ITC Main Website

Welcome to the ITC Main Website repository. This is the official website of the Institute Technical Council (ITC) built and maintained by the ITC Web Team.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running Locally](#running-locally)
- [Contributing](#contributing)
- [Deployment](#deployment)
- [License](#license)

## Project Overview

The ITC Main website serves as the primary portal for sharing information about ITC activities, events, and resources at IIT Bombay. The website is hosted at [tech-iitb.org](https://tech-iitb.org).

## Tech Stack

- **Backend**: Django
- **Frontend**: Django Templates, Tailwind CSS
- **Database**: PostgreSQL
- **Hosting**: Nginx, Gunicorn
- **Others**: GitHub Actions for CI/CD

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed:

- Python (v3.8+)
- PostgreSQL
- Node.js and npm (for managing Tailwind CSS)
- Django (v3.2+)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/ITC-Web-Team/ITC_Main.git
    ```

2. Navigate to the project directory:
    ```bash
    cd ITC_Main
    ```

3. Create a virtual environment:
    ```bash
    python -m venv env
    ```

4. Activate the virtual environment:

    - On macOS/Linux:
      ```bash
      source env/bin/activate
      ```
    - On Windows:
      ```bash
      .\env\Scripts\activate
      ```

5. Install the required Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```

6. Install Tailwind CSS dependencies using npm:
    ```bash
    npm install
    ```

### Database Setup

1. Make sure PostgreSQL is installed and running.
   
2. Create a PostgreSQL database:
    ```bash
    psql
    CREATE DATABASE itc_main;
    CREATE USER itc_user WITH PASSWORD 'yourpassword';
    ALTER ROLE itc_user SET client_encoding TO 'utf8';
    ALTER ROLE itc_user SET default_transaction_isolation TO 'read committed';
    ALTER ROLE itc_user SET timezone TO 'UTC';
    GRANT ALL PRIVILEGES ON DATABASE itc_main TO itc_user;
    ```

3. Update your `.env` file with the database connection details:
    ```bash
    DATABASE_URL=postgres://itc_user:yourpassword@localhost:5432/itc_main
    ```

4. Run database migrations:
    ```bash
    python manage.py migrate
    ```

### Running Locally

1. Compile Tailwind CSS:
    ```bash
    npm run build:css
    ```

2. Start the development server:
    ```bash
    python manage.py runserver
    ```

The website will be available at `http://localhost:8000`.

## Contributing

We welcome contributions from the ITC Web Team and external contributors.

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and submit a pull request.

### Code Style

- Follow the existing code structure and naming conventions.
- Run migrations and make sure to update the database schema if necessary:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

## Deployment

The website is deployed using GitHub Actions. When changes are pushed to the `main` branch, the deployment workflow triggers automatically.

For manual deployment:

1. SSH into the server:
    ```bash
    ssh user@server_ip
    ```

2. Pull the latest code:
    ```bash
    git pull origin main
    ```

3. Collect static files:
    ```bash
    python manage.py collectstatic
    ```

4. Restart Gunicorn and Nginx:
    ```bash
    sudo systemctl restart gunicorn
    sudo systemctl restart nginx
    ```

## License

This project is licensed under the MIT License.
