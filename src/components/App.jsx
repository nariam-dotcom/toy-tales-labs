
import React, { useState, useEffect } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  const BASE_URL = "http://localhost:3001/toys";

  // GET: Fetch all toys when the page loads
  useEffect(() => {
    fetch(BASE_URL)
      .then((response) => response.json())
      .then((data) => setToys(data))
      .catch((error) => console.error("Error fetching toys:", error));
  }, []);

  // Show or hide the toy form
  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  // POST: Create a new toy
  function handleAddToy(newToy) {
    fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((createdToy) => {
        setToys((currentToys) => [...currentToys, createdToy]);
      })
      .catch((error) => console.error("Error adding toy:", error));
  }

  // PATCH: Increase toy likes
  function handleLikeToy(updatedToy) {
    fetch(`${BASE_URL}/${updatedToy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: updatedToy.likes + 1,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setToys((currentToys) =>
          currentToys.map((toy) =>
            toy.id === data.id ? data : toy
          )
        );
      })
      .catch((error) => console.error("Error liking toy:", error));
  }

  // DELETE: Remove a toy
  function handleDeleteToy(id) {
    fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setToys((currentToys) =>
          currentToys.filter((toy) => toy.id !== id)
        );
      })
      .catch((error) => console.error("Error deleting toy:", error));
  }

  return (
    <>
      <Header />

      {showForm ? (
        <ToyForm onAddToy={handleAddToy} />
      ) : null}

      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>

      <ToyContainer
        toys={toys}
        onLikeToy={handleLikeToy}
        onDeleteToy={handleDeleteToy}
      />
    </>
  );
}

export default App;