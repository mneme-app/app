# Mneme: Elevate Your Learning Game🚀

Welcome to **Mneme**, where learning meets innovation! 📚

## Unleash Your Learning Potential 🌟

Traditional flashcards are so last season! Mneme brings a breath of fresh air to your learning journey. Imagine having the power to create not just flashcards but engaging quizzes in various formats. Whether it's filling in the blanks, matching unordered lists, or even memorizing a line verbatim, Mneme has got your back. But that's not all – each quiz question is backed by reliable sources to ensure accuracy. If something seems off, you can cross-check and correct it right away.

## What's in a Name? 🤔

**Mneme**, named after the [Greek Muse for memory](https://en.wikipedia.org/wiki/Mneme), is not just an ordinary learning platform. It's a web application and API designed to revolutionize how you interact with knowledge. You can submit, store, and retrieve a wealth of learning materials in a seamlessly organized database. Dive into articles, news reports, official documents, scientific papers, and more. And don't forget those handy notes that distill complex information into bite-sized chunks. Mneme empowers you with diverse quiz questions and prompts to put your knowledge to the test.

## Join the Revolution 🚀

Mneme is an open-source project, and we're calling all passionate learners and developers to join us on this journey. [Explore the source code on GitHub](https://github.com/mneme-app/app.git), create your own fork, and send pull requests to shape the future of Mneme. Together, we can make learning an exciting adventure!

Need a place to discuss ideas and get involved? Visit our vibrant [Discord server](https://discord.com/invite/GNzuTVY9zF).

## Get Started with Mneme 🏁

Ready to dive in? Setting up Mneme from the Git repository is a breeze:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/mneme-app/app.git
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   If you want to update Node (we recommend using Node version 18.18.2 or higher) :
   
   Check your current Node version:
   ```bash
   node -v 
   ```
   If Node version is not 18.18.2 or higher, update your Node using :
   ```bash
   npm install -g n   
   ```

4. **Configure Your Environment**:
   Open the `mneme/sample.env` file and follow the instructions to create your personalized `.env` file. Don't forget to include the URL to your MongoDB database.

5. **Fire Up the Development Server**:
   ```bash
   npm run dev
   ```

   Now, point your browser to [http://localhost:3000](http://localhost:3000) and experience Mneme in action!

## Aesthetic and Performance 🎨

Mneme takes care of both aesthetics and performance. We use [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to optimize and load the sleek Inter font, providing a delightful reading experience.

## The API World 🌐

Mneme is a unified platform that serves both the website and the API. Currently, we offer multiple API endpoints and HTTP verbs for updating the database through the API. To set up your personal system, you'll need the URI of a MongoDB database. You can either run a local instance or follow our instructions in the "sample.env" file to configure the URI.


## Our Roadmap 🗺️

Our journey ahead involves creating three essential API endpoints, each corresponding to distinct Mongoose models. Here's a glimpse of where Mneme is headed:

- **Source Model**: We're introducing a dedicated model for linking reliable sources of subject-related information for study.
- **Note Model**: Expect a model that supports concise summaries or explanations drawn from multiple sources, enhancing note reliability.
- **Quiz Model**: Dive into versatile question formats, including prompt/response, fill-in-the-blank, ordered or unordered lists, and more. We're even exploring multimedia prompts with WCAG-compliant text alternatives.

Join us on this thrilling journey to reshape learning and knowledge sharing with Mneme!

## Calling All Developers 👩‍💻👨‍💻

### Contributing to Mneme

Are you ready to be part of something big? We're thrilled to have developers like you join our mission. Here's how to get started:

1. **Fork the Repository**:
   Click the "Fork" button at the top right corner of the Mneme repository on GitHub. This creates a copy of the repository under your GitHub account.

2. **Clone Your Fork**:
   Clone your forked repository to your local machine using:
   ```bash
   git clone https://github.com/YourUsername/Mneme/app.git
   # Add the link to your forked repository
   ```

3. **Create a New Branch**:
   Create a new branch for your changes with a descriptive name:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes**:
   Make the desired improvements and enhancements.

5. **Commit Changes**:
   Commit your changes with a clear and concise message:
   ```bash
   git commit -m "Add your descriptive commit message here"
   ```

6. **Push Changes**:
   Push your changes to your forked repository on GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**:
   Visit the original Mneme repository on GitHub and click the "New Pull Request" button. Compare your branch with the main branch of the Mneme repository and provide a detailed description of your changes.

8. **Review and Merge**:
   After your pull request is reviewed and approved, it will be merged into the main Mneme repository.


<br>
Thank you for contributing to Mneme! Together, we're creating a brighter future for learning and knowledge sharing. 🌟
