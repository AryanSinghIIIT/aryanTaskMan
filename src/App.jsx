import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Table } from "./components/Table";
import { Modal } from "./components/Modal";
const apiUrl = import.meta.env.VITE_API_URL || '${apiUrl}';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Number of items per page

  // const [filterText, setFilterText] = React.useState("");
  // const [sortDirection, setSortDirection] = React.useState("asc");

  // const handleFilterChange = (e) => {
  //   setFilterText(e.target.value);
  // };

  // const handleSort = () => {
  //   setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  // };

  // const filteredRows = rows.filter((row) =>
  //   row.description.toLowerCase().includes(filterText.toLowerCase())
  // );

  // const sortedRows = filteredRows.sort((a, b) => {
  //   if (sortDirection === "asc") {
  //     return a.serialNo.localeCompare(b.serialNo);
  //   } else {
  //     return b.serialNo.localeCompare(a.serialNo);
  //   }
  // });

  useEffect(() => {
    // Fetch initial data from JSON Server
    axios.get(`${apiUrl}/tasks`)
    .then(response => setRows(response.data))
      .catch(error => console.error("Error fetching data: ", error));
  }, []);

  const handleDeleteRow = (id) => {
    axios.delete(`${apiUrl}/tasks/${id}`)
      .then(() => {
        setRows(rows.filter(row => row.id !== id));
      })
      .catch(error => console.error("Error deleting data: ", error));
  };

  const handleEditRow = (id) => {
    setRowToEdit(id);
    setModalOpen(true);
  };

  const handleSubmit = (newRow) => {
    if (rowToEdit === null) {
      axios.post(`${apiUrl}/tasks`, newRow)
        .then(response => {
          setRows([...rows, response.data]);
          setModalOpen(false);
          setRowToEdit(null);
        })
        .catch(error => console.error("Error adding data: ", error));
    } else {
      axios.put(`${apiUrl}/tasks/${rowToEdit}`, newRow)
        .then(response => {
          setRows(rows.map(row => (row.id === rowToEdit ? response.data : row)));
          setModalOpen(false);
          setRowToEdit(null);
        })
        .catch(error => console.error("Error updating data: ", error));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Calculate total pages and page numbers
  const totalPages = Math.ceil(rows.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <>
    {/* <div className="table-controls">
        <input
          type="text"
          placeholder="Filter by Task Title"
          value={filterText}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <button className="sort-btn" onClick={handleSort}>
          Sort by Serial No {sortDirection === "asc" ? "▲" : "▼"}
        </button>
        <button onClick={() => setModalOpen(true)} className="btn-add">
          Add
        </button>
      </div> */}
    <div className="App">
      
      <Table
        rows={rows}
        deleteRow={handleDeleteRow}
        editRow={handleEditRow}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setModalOpen={setModalOpen}
        setRows={setRows}
      />
      {modalOpen && (
        <Modal
          closeModal={() => {
            setModalOpen(false);
            setRowToEdit(null);
          }}
          onSubmit={handleSubmit}
          defaultValue={rowToEdit !== null ? rows.find(row => row.id === rowToEdit) : null}
        />
      )}
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`pagination-btn ${number === currentPage ? "active" : ""}`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>

        
      </div>
      <div>
     
      </div>
    </div>
    </>

  );
}

export default App;
