# Project Setup Guidelines

Welcome to our project! To get you started quickly, please follow these steps:

## Installation

1. **Clone the repository**:

    ```sh
    git clone https://github.com/codXexplorer/khoj.git
    cd khoj
    ```

2. **Install the dependencies in the Frontend**:

    Make sure you have [Node.js](https://nodejs.org/) installed. Then run:

    ```sh
    cd khoj-frontend
    npm install
    ```

2. **Start the development server in the Frontend**:

    To start the Frontend Web application, run:

    ```sh
    cd khoj-frontend
    npm run dev
    ```

    This will start the Vite development server, and you should be able to see the project running in your browser, using the URL provided in terminal.


## Environment Variables

You need to create a `.env` file in the root(or FE/BE directory?TBC) directory of the project. This file should contain your OpenAI API key. Here’s an example:

    ```sh
    VITE_OPENAI_API_KEY=your-real-openai-api-key
    ```

Replace `your-real-openai-api-key` with your actual OpenAI API key.

---

Feel free to reach out if you have any questions or need further assistance. Happy coding!
