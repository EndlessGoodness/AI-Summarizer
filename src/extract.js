import * as pdfjsLib from "pdfjs-dist/webpack.mjs";

// Utility: Extract text from PDF file (returns a Promise<string>)
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(" ") + "\n\n";
  }
 /* return text;*/
  const paragraphs=text.split('\n\n');
  return paragraphs;
}
export default extractTextFromPDF;