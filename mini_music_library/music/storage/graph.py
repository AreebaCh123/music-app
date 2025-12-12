# music/graph.py
from neo4j import GraphDatabase

# Update these with your Neo4j credentials
NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password"

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

# context manager to get a session
def get_session():
    class SessionWrapper:
        def __enter__(self):
            self.session = driver.session()
            return self.session
        def __exit__(self, exc_type, exc_value, traceback):
            self.session.close()
    return SessionWrapper()
