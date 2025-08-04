# ColPali VectorDB Feature (CCS-7)
# This feature implements ColPali-based document embedding and retrieval using Pinecone as the vector database.

## Overview
This feature implements ColPali-based document embedding and retrieval using Pinecone as the vector database.

## Usage
1. Set environment variables:
   - `PINECONE_API_KEY`
   - `PINECONE_ENVIRONMENT`
   - `PINECONE_INDEX` (optional, defaults to `colpali-index`)
2. Run `src/index.ts` to store and search embeddings.

## Example
```typescript
const embedding = await getColPaliEmbeddings(doc.text);
await vectorStore.storeEmbedding(doc.id, embedding, doc.metadata);
const results = await vectorStore.similaritySearch(embedding);
```

## References
- JIRA Ticket: CCS-7
- [Technical Analysis & Architecture](https://docs.google.com/document/d/19_CtqiIQKOoY5BmO79OKLtHRrV2vVoOlEqMBEdBXT3s/edit?usp=drive_link)
ColPali repo