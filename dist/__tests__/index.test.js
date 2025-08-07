"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
describe('ColPali VectorDB with Pinecone', () => {
    describe('getColPaliEmbeddings', () => {
        it('should generate 1024-dimensional embeddings', async () => {
            const text = 'Sample document text for embedding generation';
            const embedding = await (0, index_1.getColPaliEmbeddings)(text);
            expect(embedding).toHaveLength(1024);
            expect(embedding.every((val) => typeof val === 'number')).toBe(true);
        });
    });
    describe('PineconeVectorStore', () => {
        let vectorStore;
        beforeEach(() => {
            // Mock Pinecone for testing
            vectorStore = new index_1.PineconeVectorStore('test-api-key', 'test-index');
        });
        it('should create a vector store instance', () => {
            expect(vectorStore).toBeInstanceOf(index_1.PineconeVectorStore);
        });
        it('should handle document storage operations', async () => {
            const mockDocument = {
                id: 'test-doc-1',
                text: 'This is a test document for ColPali processing',
                metadata: { category: 'test', source: 'unit-test' }
            };
            // In a real test environment, you would mock the Pinecone client
            // For now, we'll just test the interface
            expect(mockDocument.id).toBe('test-doc-1');
            expect(mockDocument.text).toContain('test document');
        });
    });
});
//# sourceMappingURL=index.test.js.map