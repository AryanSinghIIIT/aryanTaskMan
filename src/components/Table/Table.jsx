import React, { useMemo, useState } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { CiFilter } from "react-icons/ci";
import { RxDragHandleHorizontal } from "react-icons/rx";
import Filter from "../Filter/Filter";
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
  const [filters, setFilters] = useState({
    serialNo: "",
    description: "",
    id: "",
    status: "",
    assignedMembers: "",
    dueDate: "",
    isAssigned: "",
    estimatedHours: "",
    priority: "",
    createdOn: "",
  });
  const [sortDirection, setSortDirection] = useState("asc");

  const openModal = () => setFilterOpen(true);
  const closeModal = () => setFilterOpen(false);

  const handleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };
  const taskIds = useMemo(() => [...new Set(rows.map(row => row.id))], [rows]);
  const statuses = ["uninitiated", "inProgress", "completed"];
  const priorities = ["low", "medium", "high"];

  const allMembers = useMemo(() => {
    const membersSet = new Set();
    rows.forEach(row => {
      if (row.assignedMembers) {
        (Array.isArray(row.assignedMembers) ? row.assignedMembers : row.assignedMembers.split(",")).forEach(member => {
          membersSet.add(member.trim());
        });
      }
    });
    return [...membersSet];
  }, [rows]);
  const filteredRows = rows.filter((row) => {
    // Serial No Filter
    const serialNoMatch = row.serialNo
      .toString()
      .toLowerCase()
      .includes(filters.serialNo.toLowerCase());

    // Task Title Filter
    const descriptionMatch = row.description
      .toLowerCase()
      .includes(filters.description.toLowerCase());

    // Task ID Filter
    const idMatch = row.id.toString().toLowerCase().includes(filters.id.toLowerCase());

    // Status Filter
    const statusMatch = row.status
      .toLowerCase()
      .includes(filters.status.toLowerCase());

    // Assigned Members Filter
    const assignedMembersMatch = row.assignedMembers
      ? row.assignedMembers.join(", ").toLowerCase().includes(filters.assignedMembers.toLowerCase())
      : false;

    // Due Date Filter
    const dueDateMatch = filters.dueDate
      ? new Date(row.dueDate).toLocaleDateString().includes(new Date(filters.dueDate).toLocaleDateString())
      : true;

    // Is Assigned Filter
    const isAssignedMatch = filters.isAssigned
      ? row.isAssigned.toString().toLowerCase() === filters.isAssigned.toLowerCase()
      : true;

    // Estimated Hours Filter
    const estimatedHoursMatch = row.estimatedHours
      .toString()
      .toLowerCase()
      .includes(filters.estimatedHours.toLowerCase());

    // Priority Filter
    const priorityMatch = row.priority
      .toLowerCase()
      .includes(filters.priority.toLowerCase());

    // Created On Filter
    const createdOnMatch = filters.createdOn
      ? new Date(row.createdOn).toLocaleDateString().includes(new Date(filters.createdOn).toLocaleDateString())
      : true;

    // Combine all filters
    return (
      serialNoMatch &&
      descriptionMatch &&
      idMatch &&
      statusMatch &&
      (filters.assignedMembers
        ? assignedMembersMatch
        : true) &&
      dueDateMatch &&
      isAssignedMatch &&
      estimatedHoursMatch &&
      priorityMatch &&
      createdOnMatch
    );
  });

  const sortedRows = filteredRows

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
            <table className="table" style={{width: '150%'}}>
              <thead>
                <tr>
                  <th colSpan="13">
                    <div className="table-controls">
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
                {/* Filter Row */}
                <tr className="filter-row">
                  <th>
                  <div onClick={openModal}>
                    <CiFilter />
                  </div>
                    </th> {/* Order - No filter */}
                  <th></th> {/* Row no - No filter */}
                  <th>
                    <input
                      type="text"
                      placeholder="Filter Serial No"
                      value={filters.serialNo}
                      onChange={(e) => setFilters({ ...filters, serialNo: e.target.value })}
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      placeholder="Filter Task Title"
                      value={filters.description}
                      onChange={(e) => setFilters({ ...filters, description: e.target.value })}
                    />
                  </th>
                  <th>
                  <th>
                    <select
                      value={filters.id}
                      onChange={(e) => setFilters({ ...filters, id: e.target.value })}
                    >
                      <option value="">All</option>
                      {taskIds.map(id => (
                        <option key={id} value={id}>{id}</option>
                      ))}
                    </select>
                  </th>
                  </th>
                  <th>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                      <option value="">All</option>
                      {statuses.map(status => (
                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                      ))}
                    </select>
                  </th>
                  <th>
                    <select
                        value={filters.assignedMembers}
                        onChange={(e) => setFilters({ ...filters, assignedMembers: e.target.value })}
                      >
                      <option value="">All</option>
                      {allMembers.map(member => (
                        <option key={member} value={member}>{member}</option>
                      ))}
                    </select>
                  </th>
                  <th>
                    <input
                      type="date"
                      placeholder="Filter Due Date"
                      value={filters.dueDate}
                      onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
                    />
                  </th>
                  <th>
                    <select
                      value={filters.isAssigned}
                      onChange={(e) => setFilters({ ...filters, isAssigned: e.target.value })}
                    >
                      <option value="">All</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </th>
                  <th>
                    <input
                      type="number"
                      placeholder="Filter Hours"
                      value={filters.estimatedHours}
                      onChange={(e) => setFilters({ ...filters, estimatedHours: e.target.value })}
                    />
                  </th>
                  <th>
                    <select
                      value={filters.priority}
                      onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    >
                      <option value="">All</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </th>
                  <th>
                    <input
                      type="date"
                      placeholder="Filter Created On"
                      value={filters.createdOn}
                      onChange={(e) => setFilters({ ...filters, createdOn: e.target.value })}
                    />
                  </th>
                  <th>
                    <button onClick={() => setFilters({
                      serialNo: "",
                      description: "",
                      id: "",
                      status: "",
                      assignedMembers: "",
                      dueDate: "",
                      isAssigned: "",
                      estimatedHours: "",
                      priority: "",
                      createdOn: "",
                    })}>
                      Clear
                    </button>
                  </th>
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
                          { (
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

            {/* <Filter isOpen={isFilterOpen} onClose={closeModal} handleFilterChange={handleFilterChange} /> */}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
