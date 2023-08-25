import React, { useState, useEffect } from "react";
import { Button, Typography } from "@material-ui/core";
import { GetCategoryDetails } from "../../../../services";
import swal from "sweetalert";
import { Link } from "react-router-dom";

function List(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [getdata, setGetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBack = () => {
    props.history.goBack();
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = "" + (d.getMonth() + 1);
    const day = "" + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
  };

  const getChildCategory = async () => {
    const list = await GetCategoryDetails.getCategoryList();
    setGetData(list.data);
  };

  const handleDeleteById = (id) => {
    swal({
      title: "Are you sure?",
      text: "You want to delete Category from the List",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (success) => {
      if (success) {
        const value = await GetCategoryDetails.getChildDeleteById(id);
        if (value) {
          getChildCategory();
        }
      }
    });
  };

  useEffect(() => {
    getChildCategory();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredData(getdata.slice(startIndex, endIndex));
  }, [getdata, currentPage, itemsPerPage]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-5 col-md-9 col-lg-6">
          <h2 className="mt-30 page-title">Categories</h2>
        </div>
        <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
          <Button variant="contained" onClick={handleBack}>
            <i className="fas fa-arrow-left" /> Back
          </Button>
        </div>
      </div>
      <ol className="breadcrumb mb-30">
        <li className="breadcrumb-item">
          <a href="/">Dashboard</a>
        </li>
        <li className="breadcrumb-item active">Categories</li>
      </ol>
      <div className="row justify-content-between">
        <div className="col-lg-12">
          <Link to="./create" className="add-btn hover-btn">
            Add New
          </Link>
        </div>
        <div className="col-lg-3 col-md-4">
          <div className="bulk-section mt-30">
            {/* ... your bulk actions input ... */}
          </div>
        </div>
        <div className="col-lg-5 col-md-6">
          <div className="bulk-section mt-30">
            {/* ... your search input ... */}
          </div>
        </div>
      </div>
      <div className="col-lg-12 col-md-12">
        <div className="card card-static-2 mt-30 mb-30">
          <div className="card-title-2">
            <h4>All Categories</h4>
          </div>
          <div className="card-body-table">
            <div className="table-responsive">
              <table className="table ucp-table table-hover">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>
                      <input type="checkbox" className="check-all" />
                    </th>
                    <th scope="col">Category </th>
                    <th scope="col">Slug</th>
                    <th scope="col">Date</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          className="check-item"
                          name="ids[]"
                          defaultValue={5}
                        />
                      </td>

                      <td>{row.name}</td>
                      <td>{row.slug}</td>

                      <td>
                        <span className="delivery-time">
                          {formatDate(row.createdAt)}
                        </span>
                      </td>
                      <td className="action-btns">
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
      <div className="pagination text-center mt-4">
        <ul className="pagination-list">
          {Array.from({ length: Math.ceil(getdata.length / itemsPerPage) }).map(
            (_, index) => (
              <li key={index}>
                <button
                  className={`pagination-item ${
                    index + 1 === currentPage ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                  style={{
                    background: "#007bff",
                    color: "white",
                    border: "1px solid #007bff",
                    padding: "8px 12px",
                    margin: "2px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {index + 1}
                </button>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}

export default List;
