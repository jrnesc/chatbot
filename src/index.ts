import { Pinecone } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * ColPali embedding generator (dummy implementation for now)
 * In production, this would use the actual ColPali model
 */
export async function getColPaliEmbeddings(text: string): Promise<number[]> {
  // Dummy 1024-dimensional embedding for ColPali compatibility
  // Replace this with actual ColPali model implementation
  const dimension = 1024;
  const embedding = Array.from({ length: dimension }, () => Math.random() - 0.5);
  
  console.log(`Generated ColPali embedding for text: "${text.substring(0, 50)}..."`);
  return embedding;
}

/**
 * Document interface for storing in vector database
 */
export interface Document {
  id: string;
  text: string;
  metadata?: Record<string, any>;
}

/**
 * Vector search result interface
 */
export interface SearchResult {
  id: string;
  score: number;
  metadata?: Record<string, any>;
}

/**
 * Pinecone VectorStore class for managing document embeddings
 */
class PineconeVectorStore {
  private pinecone: Pinecone;
  private indexName: string;
  private index: any;

  constructor(apiKey: string, indexName: string = 'colpali-index') {
    this.pinecone = new Pinecone({ apiKey });
    this.indexName = indexName;
  }

  /**
   * Initialize the connection to Pinecone index
   */
  async initialize(): Promise<void> {
    try {
      this.index = this.pinecone.index(this.indexName);
      console.log(`✅ Connected to Pinecone index: ${this.indexName}`);
    } catch (error) {
      console.error('❌ Failed to connect to Pinecone:', error);
      throw error;
    }
  }

  /**
   * Store a document embedding in Pinecone
   */
  async storeEmbedding(documentId: string, embedding: number[], metadata: Record<string, any> = {}): Promise<void> {
    try {
      await this.index.upsert([
        {
          id: documentId,
          values: embedding,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString()
          }
        }
      ]);
      
      console.log(`✅ Stored embedding for document: ${documentId}`);
    } catch (error) {
      console.error(`❌ Failed to store embedding for document ${documentId}:`, error);
      throw error;
    }
  }

  /**
   * Perform similarity search using an embedding
   */
  async similaritySearch(queryEmbedding: number[], topK: number = 5): Promise<SearchResult[]> {
    try {
      const queryResponse = await this.index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true
      });

      const results: SearchResult[] = queryResponse.matches?.map((match: any) => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata
      })) || [];

      console.log(`✅ Found ${results.length} similar documents`);
      return results;
    } catch (error) {
      console.error('❌ Failed to perform similarity search:', error);
      throw error;
    }
  }

  /**
   * Store a document with automatic embedding generation
   */
  async storeDocument(document: Document): Promise<void> {
    const embedding = await getColPaliEmbeddings(document.text);
    await this.storeEmbedding(document.id, embedding, {
      text: document.text,
      ...document.metadata
    });
  }

  /**
   * Search for similar documents using text query
   */
  async searchDocuments(queryText: string, topK: number = 5): Promise<SearchResult[]> {
    const queryEmbedding = await getColPaliEmbeddings(queryText);
    return await this.similaritySearch(queryEmbedding, topK);
  }

  /**
   * Delete a document from the vector store
   */
  async deleteDocument(documentId: string): Promise<void> {
    try {
      await this.index.deleteOne(documentId);
      console.log(`✅ Deleted document: ${documentId}`);
    } catch (error) {
      console.error(`❌ Failed to delete document ${documentId}:`, error);
      throw error;
    }
  }

  /**
   * Get index statistics
   */
  async getIndexStats(): Promise<any> {
    try {
      const stats = await this.index.describeIndexStats();
      console.log('📊 Index Statistics:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Failed to get index stats:', error);
      throw error;
    }
  }
}

/**
 * Main demonstration function
 */
async function main() {
  console.log('🚀 ColPali VectorDB with Pinecone Demo');
  console.log('=====================================');

  // Verify environment variables
  const apiKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX || 'colpali-index';

  if (!apiKey) {
    console.error('❌ PINECONE_API_KEY environment variable is required');
    process.exit(1);
  }

  try {
    // Initialize vector store
    const vectorStore = new PineconeVectorStore(apiKey, indexName);
    await vectorStore.initialize();

    // Sample documents to demonstrate the feature
    const sampleDocuments: Document[] = [
      {
        id: 'doc1',
        text: 'ColPali is a powerful document embedding model that can process visual and textual information.',
        metadata: { category: 'technical', source: 'documentation' }
      },
      {
        id: 'doc2', 
        text: 'Pinecone provides fast vector similarity search for machine learning applications.',
        metadata: { category: 'technical', source: 'product_info' }
      },
      {
        id: 'doc3',
        text: 'Vector databases enable semantic search and recommendation systems in AI applications.',
        metadata: { category: 'overview', source: 'guide' }
      }
    ];

    // Store sample documents
    console.log('\\n📝 Storing sample documents...');
    for (const doc of sampleDocuments) {
      await vectorStore.storeDocument(doc);
    }

    // Wait a moment for indexing
    console.log('\\n⏳ Waiting for indexing...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Perform similarity search
    console.log('\\n🔍 Performing similarity search...');
    const query = 'What is ColPali and how does it work?';
    const results = await vectorStore.searchDocuments(query, 3);

    console.log(`\\nQuery: "${query}"`);
    console.log('Results:');
    results.forEach((result, index) => {
      console.log(`${index + 1}. Document ID: ${result.id}`);
      console.log(`   Score: ${result.score.toFixed(4)}`);
      console.log(`   Text: ${result.metadata?.text}`);
      console.log(`   Category: ${result.metadata?.category}`);
      console.log('');
    });

    // Get index statistics
    console.log('\\n📊 Index Statistics:');
    await vectorStore.getIndexStats();

    console.log('\\n✅ Demo completed successfully!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { PineconeVectorStore, main };
