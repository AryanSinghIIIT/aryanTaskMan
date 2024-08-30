import React, { useState } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { CiFilter } from "react-icons/ci";
import { RxDragHandleHorizontal } from "react-icons/rx";
import Filter from "./Filter";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./Table.css";

export const Table = ({
  rows,
  deleteRow,
  editRow,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  setModalOpen,
  setRows,
}) => {
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const openModal = () => setFilterOpen(true);
  const closeModal = () => setFilterOpen(false);

  const handleFilterChange = (e, isFilter) => {
    isFilter ? setFilterText(e) : setFilterText(e.target.value);
    closeModal();
  };

  const handleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const filteredRows = rows.filter((row) =>
    row.description.toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedRows = filteredRows
  // .sort((a, b) => {
  //   if (sortDirection === "asc") {
  //     return a.serialNo.localeCompare(b.serialNo);
  //   } else {
  //     return b.serialNo.localeCompare(a.serialNo);
  //   }
  // });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = sortedRows.slice(startIndex, endIndex);

  const getOrderNumber = (index) => {
    return index + 1 + (currentPage - 1) * itemsPerPage;
  };

  const formatStatus = (status) => {
    const statusClassMap = {
      uninitiated: "status-uninitiated",
      inProgress: "status-inProgress",
      completed: "status-completed",
    };
    return statusClassMap[status] || "status-uninitiated";
  };

  const formatIsAssigned = (isAssigned) => {
    return isAssigned === true || isAssigned === "true"
      ? "is-assigned-yes"
      : "is-assigned-no";
  };

  const formatPriority = (priority) => {
    const priorityClassMap = {
      low: "priority-low",
      medium: "priority-medium",
      high: "priority-high",
    };
    return priorityClassMap[priority] || "priority-low";
  };

  const formatAssignedMembers = (assignedMembers) => {
    if (!assignedMembers) return "";

    let memberList = [];
    if (Array.isArray(assignedMembers)) {
      memberList = assignedMembers;
    } else if (typeof assignedMembers === "string") {
      memberList = assignedMembers.split(",").map((member) => member.trim());
    } else {
      return "";
    }

    let classNames = "";
    memberList.forEach((member) => {
      if (member === "teamMember1") classNames += "assigned-member-teamMember1 ";
      if (member === "teamMember2") classNames += "assigned-member-teamMember2 ";
      if (member === "teamMember3") classNames += "assigned-member-teamMember3 ";
      if (member === "teamMember4") classNames += "assigned-member-teamMember4 ";
    });

    return classNames.trim();
  };

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const updatedRows = Array.from(rows);
    const [movedRow] = updatedRows.splice(result.source.index, 1);
    updatedRows.splice(result.destination.index, 0, movedRow);

    // Update state with reordered rows
    setRows(updatedRows);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="table-wrapper"
          >
            <table className="table">
              <thead>
                <tr>
                  <th colSpan="12">
                    <div className="table-controls">
                      {/* <input
                        type="text"
                        placeholder="Filter by Task Title"
                        value={filterText}
                        onChange={handleFilterChange}
                        className="filter-input"
                      /> */}
                      {/* <button className="sort-btn" onClick={handleSort}>
                        Sort by Serial No {sortDirection === "asc" ? "▲" : "▼"}
                      </button> */}
                      <button onClick={() => setModalOpen(true)} className="btn-add">
                        Add
                      </button>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th>Order</th>
                  <th>Row no</th>
                  <th>Serial No</th>
                  <th className="expand">Task Title</th>
                  <th>Task ID</th>
                  <th>Status</th>
                  <th>Assigned Members</th>
                  <th>Due Date</th>
                  <th>Is Assigned</th>
                  <th>Estimated Hours</th>
                  <th>Priority</th>
                  <th>Created On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row, idx) => (
                  <Draggable key={row.id} draggableId={row.id} index={idx}>
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <td>
                          {idx === 0 ? (
                            <div onClick={openModal}>
                              <CiFilter />
                            </div>
                          ) : (
                            <div {...provided.dragHandleProps} className="drag-handle">
                              <RxDragHandleHorizontal />
                            </div>
                          )}
                        </td>
                        <td>{getOrderNumber(idx)}</td>
                        <td>{row.serialNo}</td>
                        <td className="expand">{row.description}</td>
                        <td>{row.id}</td>
                        <td>
                          <span className={`label ${formatStatus(row.status)}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className={formatAssignedMembers(row.assignedMembers)}>
                          {Array.isArray(row.assignedMembers)
                            ? row.assignedMembers.join(", ")
                            : row.assignedMembers || "None"}
                        </td>
                        <td>{new Date(row.dueDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`label ${formatIsAssigned(row.isAssigned)}`}>
                            {formatIsAssigned(row.isAssigned) === "is-assigned-yes" ? "Yes" : "No"}
                          </span>
                        </td>
                        <td>{row.estimatedHours}</td>
                        <td>
                          <span className={`label ${formatPriority(row.priority)}`}>
                            {row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
                          </span>
                        </td>
                        <td>{new Date(row.createdOn).toLocaleDateString()}</td>
                        <td className="actions">
                          <BsFillTrashFill
                            className="delete-btn"
                            onClick={() => deleteRow(row.id)}
                          />
                          <BsFillPencilFill
                            className="edit-btn"
                            onClick={() => editRow(row.id)}
                          />
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>

            <Filter isOpen={isFilterOpen} onClose={closeModal} handleFilterChange={handleFilterChange} />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
