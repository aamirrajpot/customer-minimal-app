import React, { useEffect, useState } from 'react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for new customer form and editing form
  const [customerData, setCustomerData] = useState({
    username: '',
    fullName: '',
    email: '',
    dateOfBirth: '',
  });

  // Modal visibility states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetch('https://customersapi20241002004915.azurewebsites.net/customers')
      .then(response => response.json())
      .then(data => {
        setCustomers(data.customers);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
        setLoading(false);
      });
  }, []);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Create customer submit
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    fetch('https://customersapi20241002004915.azurewebsites.net/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    })
      .then(response => response.json())
      .then(createdCustomer => {
        setCustomers([...customers, createdCustomer]);
        setShowCreateModal(false);
        resetCustomerData();
      })
      .catch(error => console.error('Error creating customer:', error));
  };

  // Edit customer submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`https://customersapi20241002004915.azurewebsites.net/customers/${selectedCustomer.username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    })
      .then(response => response.json())
      .then(updatedCustomer => {
        setCustomers(customers.map(customer => customer.username === selectedCustomer.username ? updatedCustomer : customer));
        setShowEditModal(false);
        resetCustomerData();
      })
      .catch(error => console.error('Error updating customer:', error));
  };

  // Handle delete customer
  const handleDelete = () => {
    fetch(`https://customersapi20241002004915.azurewebsites.net/customers/${selectedCustomer.username}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setCustomers(customers.filter(customer => customer.username !== selectedCustomer.username));
          setShowDeleteModal(false);
        }
      })
      .catch(error => console.error('Error deleting customer:', error));
  };

  // Open create modal
  const handleCreate = () => {
    setShowCreateModal(true);
  };

  // Open edit modal and prefill data
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setCustomerData({
      username: customer.username,
      fullName: customer.fullName,
      email: customer.email,
      dateOfBirth: customer.dateOfBirth,
    });
    setShowEditModal(true);
  };

  // Open delete confirmation modal
  const handleDeleteConfirmation = (customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  // Reset form data
  const resetCustomerData = () => {
    setCustomerData({
      username: '',
      fullName: '',
      email: '',
      dateOfBirth: '',
    });
    setSelectedCustomer(null);
  };

  if (loading) {
    return <div className="container mt-5"><div className="alert alert-info">Loading...</div></div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Customer List</h2>

      {/* Create Button */}
      <button onClick={handleCreate} className="btn btn-primary mb-3">Create Customer</button>

      {/* Customer Table */}
      {customers.length > 0 ? (
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.username}>
                <td>{customer.username}</td>
                <td>{customer.fullName}</td>
                <td>{customer.email}</td>
                <td>{new Date(customer.dateOfBirth).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(customer)} className="btn btn-warning btn-sm mx-1">Edit</button>
                  <button onClick={() => handleDeleteConfirmation(customer)} className="btn btn-danger btn-sm mx-1">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-warning">No customers available.</div>
      )}

      {/* Bootstrap Modal for Creating a Customer */}
      <div className={`modal ${showCreateModal ? 'd-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: showCreateModal ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Customer</h5>
              <button type="button" className="close" onClick={() => setShowCreateModal(false)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={customerData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={customerData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={customerData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={customerData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Create</button>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Modal for Editing a Customer */}
      <div className={`modal ${showEditModal ? 'd-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: showEditModal ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Customer</h5>
              <button type="button" className="close" onClick={() => setShowEditModal(false)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={customerData.username}
                    onChange={handleInputChange}
                    required
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={customerData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={customerData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={customerData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Update</button>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Modal for Delete Confirmation */}
      <div className={`modal ${showDeleteModal ? 'd-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: showDeleteModal ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button type="button" className="close" onClick={() => setShowDeleteModal(false)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete {selectedCustomer?.fullName}?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
