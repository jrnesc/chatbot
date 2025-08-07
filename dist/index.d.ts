/**
 * ColPali embedding generator (dummy implementation for now)
 * In production, this would use the actual ColPali model
 */
export declare function getColPaliEmbeddings(text: string): Promise<number[]>;
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
declare class PineconeVectorStore {
    private pinecone;
    private indexName;
    private index;
    constructor(apiKey: string, indexName?: string);
    /**
     * Initialize the connection to Pinecone index
     */
    initialize(): Promise<void>;
    /**
     * Store a document embedding in Pinecone
     */
    storeEmbedding(documentId: string, embedding: number[], metadata?: Record<string, any>): Promise<void>;
    /**
     * Perform similarity search using an embedding
     */
    similaritySearch(queryEmbedding: number[], topK?: number): Promise<SearchResult[]>;
    /**
     * Store a document with automatic embedding generation
     */
    storeDocument(document: Document): Promise<void>;
    /**
     * Search for similar documents using text query
     */
    searchDocuments(queryText: string, topK?: number): Promise<SearchResult[]>;
    /**
     * Delete a document from the vector store
     */
    deleteDocument(documentId: string): Promise<void>;
    /**
     * Get index statistics
     */
    getIndexStats(): Promise<any>;
}
/**
 * Main demonstration function
 */
declare function main(): Promise<void>;
export { PineconeVectorStore, main };
//# sourceMappingURL=index.d.ts.map