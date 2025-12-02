import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_TODOS = gql`
  query GetTodos {
    todo(id: 1) {
      id
      title
      completed
      user {
        id
        name
        email
        username
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_TODOS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data);
  return (
    <>
      <h1>Todo List</h1>
      <ul>
        {JSON.stringify(data.todo)}
      </ul>
    </>
  );
}

export default App
