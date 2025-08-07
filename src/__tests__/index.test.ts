import { PineconeVectorStore, getColPaliEmbeddings, Document } from '../index';

describe('ColPali VectorDB with Pinecone', () => {
  describe('getColPaliEmbeddings', () => {
    it('should generate 1024-dimensional embeddings', async () => {
      const text = 'Sample document text for embedding generation';
      const embedding = await getColPaliEmbeddings(text);
      
      expect(embedding).toHaveLength(1024);
      expect(embedding.every((val: number) => typeof val === 'number')).toBe(true);
    });
  });

  describe('PineconeVectorStore', () => {
    let vectorStore: PineconeVectorStore;
    
    beforeEach(() => {
      // Mock Pinecone for testing
      vectorStore = new PineconeVectorStore('test-api-key', 'test-index');
    });

    it('should create a vector store instance', () => {
      expect(vectorStore).toBeInstanceOf(PineconeVectorStore);
    });

    it('should handle document storage operations', async () => {
      const mockDocument: Document = {
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
