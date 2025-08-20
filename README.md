## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You'll need to have **Node.js** installed on your machine.

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/Altechsol/default-betting-module.git
   ```

2. Navigate into the project directory:

   ```
   cd default-betting-module
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Create a .env file and add the following:

    ```
    cp .env.copy .env
   
    ```

5. Add your own values to the .env file.

## 💻 Usage

To run the development server, use the following command:

    ```
    npm run dev
    ```

After the build is complete, you can serve the optimized files to simulate a production environment.

    ```
    npm run build
    npm run preview
    ```

## 📝 Notes

- The npm run build command is for preparing the application for deployment or preview.
- The npm run preview command is for locally testing the production build before deployment and should not be used in a
  live production environment.

This two-step process ensures your application is fully optimized for performance and is ready for deployment.

## 🚀 Deployment

To prepare your application for deployment, you must first create a production build.

Once you have prepared your application for deployment, you can deploy it to any static hosting service.

The output in the dist/ directory is a collection of static files that are ready to be deployed to any static hosting
service like Vercel, Netlify, Cloudflare Pages, or even a simple Nginx or Apache server.

## 📝 License

This project is [MIT](lic.url) licensed.
Author: Izet Selimaj
