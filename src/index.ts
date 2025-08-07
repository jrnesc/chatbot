// 1. Initialize Pinecone vector store
const vectorStore = new PineconeVectorStore(apiKey, 'colpali-index');
await vectorStore.initialize();

// 2. Generate ColPali embedding for a document
const embedding = await getColPaliEmbeddings('Sample document text');

// 3. Store document with embedding
await vectorStore.storeDocument({
  id: 'doc1',
  text: 'Sample document text',
  embedding,
  metadata: { source: 'demo' }
});

// 4. Search for similar documents
const results = await vectorStore.searchDocuments('What is ColPali?', 5);
console.log(results);
