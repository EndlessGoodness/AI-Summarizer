import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

// Loads the Universal Sentence Encoder model (returns a Promise)
export async function loadUSEModel() {
  return await use.load();
}

// Given a model and an array of strings, returns their embeddings as arrays
export async function embedTexts(model, texts) {
  const embeddings = await model.embed(texts);
  const array = await embeddings.array();
  embeddings.dispose();
  return array;
}

// Given two embedding arrays, compute cosine similarity
export function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
