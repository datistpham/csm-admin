import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  TextField,
} from "@material-ui/core";
import { GetCustomerDetails } from "../../../../services";
import { NotificationManager } from "react-notifications";
import swal from "sweetalert";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { API_URL } from "../../../../../config1";

const View = () => {
  const history= useHistory()
  const [getList, setGetList] = useState([]);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    gender: "",
  });

  const handleBack = () => {
    history.goBack();
  };

  useEffect(() => {
    getCustomer();
  }, []);

  const getCustomer = async () => {
    let list = await GetCustomerDetails.getAllCustomerList();
    setGetList(list.data);
  };

  const handleDeleteById = async (id) => {
    swal({
      title: "Are you sure?",
      text: "You want to delete Customer from the List",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (success) => {
      if (success) {
        let value = await GetCustomerDetails.getCustomerDeleteById(id);
        if (value) {
          NotificationManager.success(value.msg, "Status");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    });
  };

  const handleOpenAddPopup = () => {
    setIsAddPopupOpen(true);
  };

  const handleCloseAddPopup = () => {
    setIsAddPopupOpen(false);
  };

  const handleChangeAddPopup = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddCustomer = async () => {
    // Xử lý thêm khách hàng vào cơ sở dữ liệu ở đây
    // ...

    // Đóng popup và làm mới danh sách khách hàng
    const res= await Axios({
      url: API_URL + "/api/customer/register",
      method: "post",
      data: {
        ...newCustomer
      }
    })
    const result= await res.data
    setIsAddPopupOpen(false);
    getCustomer();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-5 col-md-9 col-lg-6">
          <h2 className="mt-30 page-title">Customer</h2>
        </div>
        <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
          <Button variant="contained" onClick={handleBack}>
            <i className="fas fa-arrow-left" /> Back
          </Button>
        </div>
      </div>
      <ol className="breadcrumb mb-30">
        <li className="breadcrumb-item">
          <a href="index.html">Dashboard</a>
        </li>
        <li className="breadcrumb-item active">Customer</li>
      </ol>
      {
        isAddPopupOpen ? 
        <Button onClick={()=> handleCloseAddPopup()} type={"primary"} color={"primary"}>Collapse</Button> : 
        <Button  onClick={()=> handleOpenAddPopup()} type={"primary"} color={"primary"}>Add Customer</Button>  

      }
      <div className="row justify-content-between">
        <div className="col-lg-3 col-md-4">
        </div>
        <div className="col-lg-5 col-md-6">
        </div>
        <div className="col-lg-12 col-md-12">
          <div className="card card-static-2 mt-30 mb-30">
            <div className="card-title-2">
              <h4>All Customers</h4>
            </div>
            <div className="card-body-table">
              <div className="table-responsive">
                <table className="table ucp-table table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>ID</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getList.map((row, index) => (
                      <tr key={index}>
                        <td>{++index}</td>
                        <td>{row.firstName}</td>
                        <td>{row.lastName}</td>
                        <td>{row.phone}</td>
                        <td>{row.email}</td>
                        <td className="action-btns">
                          {/* <Edit state={row} /> */}
                          <Typography
                            className="delete-btn"
                            onClick={() => handleDeleteById(row.id)}
                          >
                            <i className="fas fa-trash-alt" />
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Thêm Customer */}
      {isAddPopupOpen && (
        
        <div className="add-customer-popup">
          <div className="add-customer-content">
            <h2>Add Customer</h2>
            <div className="form-group">
              <label>First Name</label>
              <TextField
                type="text"
                className="form-control"
                name="firstName"
                value={newCustomer.firstName}
                onChange={handleChangeAddPopup}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <TextField
                type="text"
                className="form-control"
                name="lastName"
                value={newCustomer.lastName}
                onChange={handleChangeAddPopup}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <TextField
                type="text"
                className="form-control"
                name="phone"
                value={newCustomer.phone}
                onChange={handleChangeAddPopup}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <TextField
                type="text"
                className="form-control"
                name="email"
                value={newCustomer.email}
                onChange={handleChangeAddPopup}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <TextField
                type="text"
                className="form-control"
                name="address"
                value={newCustomer.address}
                onChange={handleChangeAddPopup}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <TextField
                type="password"
                className="form-control"
                name="password"
                value={newCustomer.password}
                onChange={handleChangeAddPopup}
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <TextField
                type="text"
                className="form-control"
                name="gender"
                value={newCustomer.gender}
                onChange={handleChangeAddPopup}
              />
            </div>
            <div className="form-group">
              <Button
                color={"primary"}
                className="btn btn-primary btn-block"
                onClick={handleAddCustomer}
              >
                Add
              </Button>
              <Button
              color={"primary"}
              
                className="btn btn-danger btn-block"
                onClick={handleCloseAddPopup}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default View;
