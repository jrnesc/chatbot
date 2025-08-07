"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PineconeVectorStore = void 0;
exports.getColPaliEmbeddings = getColPaliEmbeddings;
exports.main = main;
const pinecone_1 = require("@pinecone-database/pinecone");
const dotenv = __importStar(require("dotenv"));
// Load environment variables
dotenv.config();
/**
 * ColPali embedding generator (dummy implementation for now)
 * In production, this would use the actual ColPali model
 */
async function getColPaliEmbeddings(text) {
    // Dummy 1024-dimensional embedding for ColPali compatibility
    // Replace this with actual ColPali model implementation
    const dimension = 1024;
    const embedding = Array.from({ length: dimension }, () => Math.random() - 0.5);
    console.log(`Generated ColPali embedding for text: "${text.substring(0, 50)}..."`);
    return embedding;
}
/**
 * Pinecone VectorStore class for managing document embeddings
 */
class PineconeVectorStore {
    constructor(apiKey, indexName = 'colpali-index') {
        this.pinecone = new pinecone_1.Pinecone({ apiKey });
        this.indexName = indexName;
    }
    /**
     * Initialize the connection to Pinecone index
     */
    async initialize() {
        try {
            this.index = this.pinecone.index(this.indexName);
            console.log(`✅ Connected to Pinecone index: ${this.indexName}`);
        }
        catch (error) {
            console.error('❌ Failed to connect to Pinecone:', error);
            throw error;
        }
    }
    /**
     * Store a document embedding in Pinecone
     */
    async storeEmbedding(documentId, embedding, metadata = {}) {
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
        }
        catch (error) {
            console.error(`❌ Failed to store embedding for document ${documentId}:`, error);
            throw error;
        }
    }
    /**
     * Perform similarity search using an embedding
     */
    async similaritySearch(queryEmbedding, topK = 5) {
        try {
            const queryResponse = await this.index.query({
                vector: queryEmbedding,
                topK,
                includeMetadata: true
            });
            const results = queryResponse.matches?.map((match) => ({
                id: match.id,
                score: match.score,
                metadata: match.metadata
            })) || [];
            console.log(`✅ Found ${results.length} similar documents`);
            return results;
        }
        catch (error) {
            console.error('❌ Failed to perform similarity search:', error);
            throw error;
        }
    }
    /**
     * Store a document with automatic embedding generation
     */
    async storeDocument(document) {
        const embedding = await getColPaliEmbeddings(document.text);
        await this.storeEmbedding(document.id, embedding, {
            text: document.text,
            ...document.metadata
        });
    }
    /**
     * Search for similar documents using text query
     */
    async searchDocuments(queryText, topK = 5) {
        const queryEmbedding = await getColPaliEmbeddings(queryText);
        return await this.similaritySearch(queryEmbedding, topK);
    }
    /**
     * Delete a document from the vector store
     */
    async deleteDocument(documentId) {
        try {
            await this.index.deleteOne(documentId);
            console.log(`✅ Deleted document: ${documentId}`);
        }
        catch (error) {
            console.error(`❌ Failed to delete document ${documentId}:`, error);
            throw error;
        }
    }
    /**
     * Get index statistics
     */
    async getIndexStats() {
        try {
            const stats = await this.index.describeIndexStats();
            console.log('📊 Index Statistics:', stats);
            return stats;
        }
        catch (error) {
            console.error('❌ Failed to get index stats:', error);
            throw error;
        }
    }
}
exports.PineconeVectorStore = PineconeVectorStore;
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
        const sampleDocuments = [
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
    }
    catch (error) {
        console.error('❌ Demo failed:', error);
        process.exit(1);
    }
}
// Run the demo if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}
//# sourceMappingURL=index.js.map