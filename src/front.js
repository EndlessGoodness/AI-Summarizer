import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import { marked } from "marked";
import extractTextFromPDF from "./extract";
import { loadUSEModel, embedTexts } from "./embedding";
import { cosineSimilarity } from "./embedding";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
let chat = null;
let chunks = [];
let chunkEmbeddings = [];
let model = null;

async function sendFileToGemini(file) {
  // Upload the file to Gemini
  const uploadedfile = await ai.files.upload({ file });

  let getFile = await ai.files.get({ name: uploadedfile.name });
    while (getFile.state === 'PROCESSING') {
        getFile = await ai.files.get({ name: uploadedfile.name });
        console.log(`current file status: ${getFile.state}`);
        console.log('File is still processing, retrying in 5 seconds');

        await new Promise((resolve) => {
            setTimeout(resolve, 5000);
        });
    }
    if (uploadedfile.state === 'FAILED') {
        throw new Error('File processing failed.');
    }

    // After file is uploaded and processed:
    if (getFile.uri && getFile.mimeType) {
        chat = ai.chats.create({
            model: "gemini-2.5-flash",
            history: [],
        });

        const content = [
            "Summarize this document in 70 words",
            createPartFromUri(getFile.uri, getFile.mimeType)
        ];

        const response1 = await chat.sendMessage({
            message: content,
        });

        const name = document.getElementById('text');
        name.innerHTML = marked.parse(response1.text);
    }

    const submit = document.getElementById("submit-button");
    submit.addEventListener("click", async () => {
      if (!chat || !model) return; // Prevent error if chat/model is not ready
      const question = document.getElementById("user-question").value;
      const [questionEmbedding] = await embedTexts(model, [question]);
      const similarities = chunkEmbeddings.map(chunkEmb => cosineSimilarity(chunkEmb, questionEmbedding));

      // Get top-N most similar chunks
    const topN = 3;
    const topIndices = similarities
      .map((sim, idx) => ({ sim, idx }))
      .sort((a, b) => b.sim - a.sim)
      .slice(0, topN)
      .map(obj => obj.idx);

    const retrievedChunks = topIndices.map(idx => chunks[idx]);

    console.log('Similarities:', similarities);
    console.log('Top Chunks:', retrievedChunks);

    const response2=await chat.sendMessage({
      message:`
        Use the following context to answer the question:

        ${retrievedChunks.join('\n\n')}

        Question: ${question}
        `,
    });
    const text1=document.getElementById("ans");
    text1.innerHTML = marked.parse(response2.text);
   });

   const reset = document.getElementById("reset");
   reset.addEventListener("click", () => {
    chat = null;
    document.getElementById("text").innerHTML = "";
    document.getElementById("ans").textContent = "";
    document.getElementById("user-question").value = ""; // Clear the input
   });
}

export function makebig() {
  const big = document.createElement("div");
  big.classList.add("big");
  big.appendChild(makeleft());
  big.appendChild(makeright());
  return big;
}

function makeleft() {
  const board = document.createElement("div");
  board.classList.add("board");

  // Drag & drop listeners
  board.addEventListener("dragover", (e) => {
    e.preventDefault();
    board.classList.add("dragover");
  });
  board.addEventListener("dragleave", (e) => {
    e.preventDefault();
    board.classList.remove("dragover");
  });
  board.addEventListener("drop", async (e) => {
    e.preventDefault();
    board.classList.remove("dragover");
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await sendFileToGemini(files[0]);
      const para = await extractTextFromPDF(files[0]);
      chunks = para.filter(p => p.trim().length > 0); // FIXED
      model = await loadUSEModel();
      chunkEmbeddings = await embedTexts(model, chunks);
    }
  });

  // Heading
  const heading = document.createElement("div");
  heading.className = "upload-heading";
  heading.textContent = "Drop your file here";
  board.appendChild(heading);

  // OR separator
  const or = document.createElement("div");
  or.className = "upload-or";
  or.textContent = "or";
  board.appendChild(or);

  // Upload button
  const uploadBtn = document.createElement("button");
  uploadBtn.className = "upload-btn";
  uploadBtn.innerHTML = `<span class="upload-icon">📄</span> Upload a file`;
  board.appendChild(uploadBtn);

  // Hidden file input
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".pdf"; // Accept only pdfs
  fileInput.style.display = "none";
  board.appendChild(fileInput);

  uploadBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      await sendFileToGemini(files[0]);
      const para = await extractTextFromPDF(files[0]);
      chunks = para.filter(p => p.trim().length > 0); // FIXED: para is already an array
      model = await loadUSEModel();
      chunkEmbeddings = await embedTexts(model, chunks);
      fileInput.value = ""; // Reset input
    }
  });

  // Info text
  const info = document.createElement("div");
  info.className = "upload-info";
  info.innerHTML = `Maximum size allowed is 50MB.<br>Supported formats are: pdf`;
  board.appendChild(info);

  return board;
}

function makeright() {
  const allt = document.createElement("div");
  allt.classList.add("allt");

  // Summary Section
  const right = document.createElement("div");
  right.classList.add("right");

  const summary = document.createElement("h2");
  summary.textContent = "Summary";
  right.appendChild(summary);

  const reset=document.createElement("button");
  reset.setAttribute("id","reset");
  reset.textContent = "Reset";
  right.appendChild(reset);

  const tex = document.createElement("p");
  tex.setAttribute('id', 'text');
  tex.classList.add("summary-text");
  tex.textContent = "";
  right.appendChild(tex);

  allt.appendChild(right);

  // Divider
  const divider = document.createElement("hr");
  divider.classList.add("right-divider");
  allt.appendChild(divider);

  // Input Section
  const inputSection = document.createElement("div");
  inputSection.classList.add("input-section");

  const inputLabel = document.createElement("label");
  inputLabel.textContent = "Ask a question about the document:";
  inputLabel.setAttribute("for", "user-question");
  inputSection.appendChild(inputLabel);

  const lakh = document.createElement("input");
  lakh.classList.add("inpu");
  lakh.setAttribute("id", "user-question");
  lakh.setAttribute("type", "text");
  lakh.setAttribute("placeholder", "Type your question...");
  inputSection.appendChild(lakh);

  const butt =document.createElement("button");
  butt.textContent="Submit";
  inputSection.appendChild(butt);
  butt.setAttribute("id","submit-button");
  allt.appendChild(inputSection);

  // Answer Section
  const ansSection = document.createElement("div");
  ansSection.classList.add("answer-section");

  const ansLabel = document.createElement("label");
  ansLabel.textContent = "Answer:";
  ansLabel.setAttribute("for", "ans");
  ansSection.appendChild(ansLabel);

  const ans = document.createElement("p");
  ans.setAttribute("id", "ans");
  ans.classList.add("answer-text");
  ans.textContent = "";
  ansSection.appendChild(ans);

  allt.appendChild(ansSection);

  return allt;
}