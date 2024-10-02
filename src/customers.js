// src/Customers.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ username: '', fullName: '', email: '', dateOfBirth: '' });
  const [updateCustomer, setUpdateCustomer] = useState({ username: '', fullName: '', email: '', dateOfBirth: '' });

  // Get all customers
  useEffect(() => {
    axios
      .get('https://customersapi20241002004915.azurewebsites.net/customers')
      .then((response) => {
        setCustomers(response.data.customers);
      })
      .catch((error) => console.error(error));
  }, []);

  // Create new customer
  const handleCreate = () => {
    axios
      .post('https://customersapi20241002004915.azurewebsites.net/customers', newCustomer)
      .then((response) => {
        debugger
        setCustomers([...customers, response.data]);
        setNewCustomer({ username: '', fullName: '', email: '', dateOfBirth: '' }); // Reset form
      })
      .catch((error) => console.error(error));
  };

  // Update customer
  const handleUpdate = (id) => {
    axios
      .put(`https://customersapi20241002004915.azurewebsites.net/customers/${id}`, updateCustomer)
      .then(() => {
        setCustomers(
          customers.map((customer) =>
            customer.id === id ? { ...customer, ...updateCustomer } : customer
          )
        );
        setUpdateCustomer({ username: '', fullName: '', email: '', dateOfBirth: '' });
      })
      .catch((error) => console.error(error));
  };

  // Delete customer
  const handleDelete = (id) => {
    axios
      .delete(`https://customersapi20241002004915.azurewebsites.net/customers/${id}`)
      .then(() => {
        setCustomers(customers.filter((customer) => customer.id !== id));
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Customer Management</h1>

      <h2>Create Customer</h2>
      <input
        type="text"
        placeholder="Username"
        value={newCustomer.username}
        onChange={(e) => setNewCustomer({ ...newCustomer, username: e.target.value })}
      />
      <input
        type="text"
        placeholder="Full Name"
        value={newCustomer.fullName}
        onChange={(e) => setNewCustomer({ ...newCustomer, fullName: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={newCustomer.email}
        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
      />
      <input
        type="date"
        placeholder="Date of Birth"
        value={newCustomer.dateOfBirth}
        onChange={(e) => setNewCustomer({ ...newCustomer, dateOfBirth: e.target.value })}
      />
      <button onClick={handleCreate}>Create Customer</button>

      <h2>Customers</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.fullName} ({customer.email}) <br />
            <button onClick={() => handleDelete(customer.id)}>Delete</button>
            <br />
            <h4>Update Customer</h4>
            <input
              type="text"
              placeholder="Username"
              value={updateCustomer.username}
              onChange={(e) => setUpdateCustomer({ ...updateCustomer, username: e.target.value })}
            />
            <input
              type="text"
              placeholder="Full Name"
              value={updateCustomer.fullName}
              onChange={(e) => setUpdateCustomer({ ...updateCustomer, fullName: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={updateCustomer.email}
              onChange={(e) => setUpdateCustomer({ ...updateCustomer, email: e.target.value })}
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={updateCustomer.dateOfBirth}
              onChange={(e) => setUpdateCustomer({ ...updateCustomer, dateOfBirth: e.target.value })}
            />
            <button onClick={() => handleUpdate(customer.id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Customers;
