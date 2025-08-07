# ColPali VectorDB with Pinecone

This project implements a ColPali-based document embedding and retrieval system using Pinecone as the vector database, delivered for JIRA ticket CCS-7.

## Overview

- **ColPali Embedding**: Generates 1024-dimensional embeddings for documents (currently using dummy function, ready for real model integration)
- **Pinecone VectorStore**: Stores embeddings and metadata, supports similarity search
- **TypeScript Implementation**: Full type safety and modern JavaScript features

## Features

- ✅ Store document embeddings in Pinecone
- ✅ Similarity search with configurable results
- ✅ Document metadata support
- ✅ Automatic embedding generation
- ✅ Error handling and logging
- ✅ TypeScript support with full type definitions

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Pinecone credentials
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX=colpali-index
```

## Usage

### Basic Example

```typescript
import { PineconeVectorStore, getColPaliEmbeddings } from './src/index';

// Initialize the vector store
const vectorStore = new PineconeVectorStore(
  process.env.PINECONE_API_KEY!,
  'colpali-index'
);
await vectorStore.initialize();

// Store a document
const document = {
  id: 'doc1',
  text: 'Your document content here',
  metadata: { category: 'technical', source: 'documentation' }
};

await vectorStore.storeDocument(document);

// Search for similar documents
const results = await vectorStore.searchDocuments('search query', 5);
console.log('Search results:', results);
```

### Manual Embedding

```typescript
// Generate embeddings manually
const embedding = await getColPaliEmbeddings('Your text content');

// Store with custom metadata
await vectorStore.storeEmbedding('custom-id', embedding, {
  title: 'Document Title',
  author: 'Author Name',
  timestamp: new Date().toISOString()
});
```

## API Reference

### `getColPaliEmbeddings(text: string): Promise<number[]>`

Generates a 1024-dimensional embedding for the given text using ColPali (dummy implementation).

### `PineconeVectorStore`

Main class for managing document embeddings in Pinecone.

#### Methods

- `initialize()`: Connect to Pinecone index
- `storeDocument(document)`: Store document with automatic embedding
- `storeEmbedding(id, embedding, metadata)`: Store embedding directly
- `searchDocuments(query, topK)`: Search using text query
- `similaritySearch(embedding, topK)`: Search using embedding vector
- `deleteDocument(id)`: Remove document from index
- `getIndexStats()`: Get index statistics

## Development

### Build

```bash
npm run build
```

### Run Demo

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

## Demo

The project includes a complete demo that:

1. Initializes connection to Pinecone
2. Stores sample documents with embeddings
3. Performs similarity search
4. Shows index statistics

Run the demo with:

```bash
npm run dev
```

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Document      │───▶│  ColPali Model   │───▶│   Embedding     │
│   (Text)        │    │  (1024-dim)      │    │   Vector        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Search        │◀───│   Similarity     │◀───│   Pinecone      │
│   Results       │    │   Search         │    │   Vector DB     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Next Steps

- Integrate real ColPali model for production embeddings
- Add support for other vector databases (PostgreSQL, MongoDB, Redis)
- Implement batch operations for large document sets
- Add more sophisticated metadata filtering
- Create REST API endpoints for external integration

## References

- **JIRA Ticket**: CCS-7
- **Technical Analysis**: [Google Doc](https://docs.google.com/document/d/19_CtqiIQKOoY5BmO79OKLtHRrV2vVoOlEqMBEdBXT3s/edit?usp=drive_link)

---

Feature delivered by GitHub Copilot, August 2025.