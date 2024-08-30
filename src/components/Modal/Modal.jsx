import React, { useState, useEffect } from "react";
import Select from "react-select"; // Make sure react-select is installed
import "./Modal.css";

export const Modal = ({ closeModal, onSubmit, defaultValue }) => {
  const [formState, setFormState] = useState({
    serialNo: "",
    assignedMembers: [],
    dueDate: "",
    isAssigned: false, // Store as boolean
    estimatedHours: "",
    priority: "low",
    createdOn: "",
    description: "",
    status: "inProgress",
    // taskId is not included here
    ...defaultValue
  });
  const [errors, setErrors] = useState("");

  useEffect(() => {
    if (defaultValue) {
      setFormState(prevState => ({
        ...prevState,
        ...defaultValue,
        isAssigned: typeof defaultValue.isAssigned === "string"
          ? defaultValue.isAssigned === "true"
          : defaultValue.isAssigned, // Convert string to boolean
        createdOn: defaultValue.createdOn || new Date().toISOString().split('T')[0] // Set createdOn to today if not provided
      }));
    } else {
      // Set createdOn to today's date if no defaultValue
      setFormState(prevState => ({
        ...prevState,
        createdOn: new Date().toISOString().split('T')[0]
      }));
    }
  }, [defaultValue]);

  const validateForm = () => {
    const requiredFields = ["serialNo", "assignedMembers", "dueDate", "estimatedHours", "description", "status"];
    const missingFields = requiredFields.filter(field => !formState[field] || (Array.isArray(formState[field]) && formState[field].length === 0));

    if (missingFields.length > 0) {
      setErrors(`Please include: ${missingFields.join(", ")}`);
      return false;
    }

    setErrors("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === "checkbox" ? checked : type === "select-one" ? value : value,
    });
  };

  const handleSelectChange = (selectedOptions) => {
    // Update the assignedMembers state with the selected options
    setFormState({
      ...formState,
      assignedMembers: selectedOptions.map(option => option.value)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Do not include taskId in the submission
    const { taskId, ...taskData } = formState;
    onSubmit(taskData);
    closeModal();
  };

  // Options for the multi-select dropdown
  const memberOptions = [
    { value: 'teamMember1', label: 'Team Member 1' },
    { value: 'teamMember2', label: 'Team Member 2' },
    { value: 'teamMember3', label: 'Team Member 3' },
    { value: 'teamMember4', label: 'Team Member 4' }
  ];

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container") closeModal();
      }}
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <h2 id="modal-title">Task Details</h2>
          
          <div className="form-group">
            <label htmlFor="serialNo">Serial No</label>
            <input
              id="serialNo"
              name="serialNo"
              type="number"
              onChange={handleChange}
              value={formState.serialNo}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Task Title</label>
            <input
              id="description"
              name="description"
              type="text"
              onChange={handleChange}
              value={formState.description}
              required
            />
          </div>
          
          {/* Removed Task ID field */}
          {/* <div className="form-group">
            <label htmlFor="taskId">Task ID</label>
            <input
              id="taskId"
              name="taskId"
              onChange={handleChange}
              value={formState.taskId}
              required
            />
          </div> */}

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              onChange={handleChange}
              value={formState.status}
              required
            >
              <option value="uninitiated">Uninitiated</option>
              <option value="inProgress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assignedMembers">Assigned Members</label>
            <Select
              id="assignedMembers"
              name="assignedMembers"
              options={memberOptions}
              value={memberOptions.filter(option => formState.assignedMembers.includes(option.value))}
              onChange={handleSelectChange}
              isMulti
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              onChange={handleChange}
              value={formState.dueDate}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="isAssigned">Is Assigned</label>
            <select
              id="isAssigned"
              name="isAssigned"
              onChange={handleChange}
              value={formState.isAssigned ? "true" : "false"} // Convert boolean to string for select
            >
              <option value="false">False</option>
              <option value="true">True</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="estimatedHours">Estimated Hours</label>
            <input
              id="estimatedHours"
              name="estimatedHours"
              type="number"
              onChange={handleChange}
              value={formState.estimatedHours}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              onChange={handleChange}
              value={formState.priority}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="createdOn">Created On</label>
            <input
              id="createdOn"
              name="createdOn"
              type="date"
              value={formState.createdOn} // Read-only field with today's date
              readOnly
            />
          </div>

          {errors && <div className="error">{errors}</div>}
          <button type="submit" className="btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
