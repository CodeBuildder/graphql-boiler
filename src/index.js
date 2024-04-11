import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
const port = process.env.PORT || 4000;

const typeDefs = `#graphql
    type Movie {
        title: String
        actors: [Actor!]! @relationship(type: "ACTED_IN", direction: IN)
    }

    type Actor {
        name: String
        movies: [Movie!]! @relationship(type: "ACTED_IN", direction: OUT)
    }
`;

const driver = neo4j.driver(
  "neo4j+s://7b06a2cb.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "sccioIgh-VDg_gjJr93nHFGDgngqXRoA602N_MlOMx0")
);
const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

async function startServer() {
  const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Wakey Wakey kk, your server is ready at port ${port}`);
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
});
