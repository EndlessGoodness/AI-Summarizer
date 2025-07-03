# AI Summarizer

AI Summarizer is a modern web application that allows users to upload PDF documents and receive concise, AI-generated summaries. Users can also ask follow-up questions about the document and get instant, context-aware answers powered by Google Gemini.

## Features

- **Drag & Drop Upload**: Easily upload your PDF files by dragging them into the upload area or using the upload button.
- **AI-Powered Summarization**: Get a concise summary of your document using Google Gemini's advanced language models.
- **Interactive Q&A**: Ask questions about the uploaded document and receive intelligent answers.
- **Modern UI**: Clean, responsive, and user-friendly interface with separate scrollable areas for summary and Q&A.
- **Reset Functionality**: Quickly clear the summary, Q&A, and input fields to start fresh.

## Screenshots

![AI Summarizer Screenshot](![image](https://github.com/user-attachments/assets/b84f9d63-01d4-493f-b031-dc2379d09f47)
)


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)
- A Google Gemini API key

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/EndlessGoodness/ai-summarizer.git
   cd ai-summarizer
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up your API key:**
   - Create a `.env` file in the project root:
     ```
     GEMINI_API_KEY=your_google_gemini_api_key_here
     ```

4. **Start the development server:**
   ```sh
   npm start
   ```
   The app will be available at [http://localhost:8080](http://localhost:8080).

## Project Structure

```
src/
├── front.js         # Main UI and logic
├── index.js         # Entry point
├── styles.css       # All styles
├── website.js       # Page structure
├── template.html    # HTML template
```

## Usage

1. **Upload a PDF**: Drag and drop your file or use the upload button.
2. **View Summary**: The AI will generate a summary shown on the right.
3. **Ask Questions**: Type your question about the document and click "Submit" to get an answer.
4. **Reset**: Click "Reset" to clear all fields and upload a new document.

## Technologies Used

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai)
- **Markdown Rendering**: [marked](https://www.npmjs.com/package/marked)
- **Bundler**: Webpack

## Customization

- To support more file types, update the `accept` attribute in `front.js`.
- To change the summary length or prompt, modify the prompt string in `sendFileToGemini`.

## Security Note

**Do not expose your Google Gemini API key in public repositories or client-side code for production use.**  
For production, use a backend server to proxy requests securely.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Google Gemini](https://ai.google.dev/)
- [Marked](https://marked.js.org/)
