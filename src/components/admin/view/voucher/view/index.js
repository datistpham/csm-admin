import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from "@material-ui/core";
import { GetPaymentDetails } from "../../../../services";
import { NotificationManager } from "react-notifications";
import Loader from "../../../../loader";
import swal from "sweetalert";
import AddVoucher from './AddVoucher';
import get_list_voucher from '../../../../../api/get_list_voucher';
import moment from 'moment';
import delete_voucher from '../../../../../api/delete_voucher';
import VoucherSchedule from './VoucherSchedule';

const View = () => {
  const history = useHistory();
  const [getList, setGetList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [change, setChange] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Số lượng item trên mỗi trang

  useEffect(() => {
    const fetchData = async () => {
      setIsLoaded(true);
      await getCustomer();
    };
    fetchData();
  }, [change]);

  const handleBack = () => {
    history.goBack();
  };

  const getCustomer = async () => {
    let list = await get_list_voucher();
    if (list) {
      setGetList(list.data);
      setIsLoaded(false);
    }
  };

  const handlDeleteById = async (id) => {
    swal({
      title: "Are you sure?",
      text: "You want to delete User from the List",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (success) => {
      if (success) {
        let value = await GetPaymentDetails.getDeleteUserList(id);
        if (value) {
          NotificationManager.success(value.msg, "Status");
          setTimeout(async function () {
            window.location.reload();
          }, 1000);
        }
      }
    });
  };

  const handlEditRow = (row) => {
    history.push({
      pathname: `/admin/user/edit/${row.id}`,
      state: row,
    });
  };

  const handleAddNewUser = () => {
    history.push({ pathname: `/admin/user/create` });
  };

  // Hàm để lấy danh sách item trên trang hiện tại
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return getList.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Tính tổng số trang
  const totalPages = Math.ceil(getList.length / itemsPerPage);

  // Xử lý chuyển đến trang trước
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Xử lý chuyển đến trang tiếp theo
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  // Xử lý chuyển đến trang cụ thể
  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-5 col-md-9 col-lg-6">
          <h2 className="mt-30 page-title">Voucher List</h2>
        </div>
        <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
          <Button variant="contained" onClick={handleBack}>
            <i className="fas fa-arrow-left" /> Back
          </Button>
        </div>
      </div>
      <ol className="breadcrumb mb-30">
        <li className="breadcrumb-item">Dashboard</li>
        <li className="breadcrumb-item active">voucher</li>
      </ol>
      <div className="row justify-content-between">
        <div className="col-lg-3 col-md-4">
          <div className="bulk-section mt-30">
            <div className="input-group">
              <div className="input-group-append">
                <VoucherSchedule />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
          <AddVoucher setChange={setChange} />
        </div>
        <div className="col-lg-12 col-md-12">
          {isLoaded ? <Loader /> : ""}
          <div className="card card-static-2 mt-30 mb-30">
            <div className="card-title-2">
              <h4>All Voucher</h4>
            </div>
            <div className="card-body-table">
              <div className="table-responsive">
                <table className="table ucp-table table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>ID</th>
                      <th>Code</th>
                      <th>Expire</th>
                      <th>Discount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Hiển thị danh sách item của trang hiện tại */}
                    {getCurrentItems().map((row, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{row.code}</td>
                        <td>{moment(row.expire).format("DD-MM-YYYY HH:mm")}</td>
                        <td>VND{row.discount}</td>
                        <td>
                          <div onClick={() => {
                            swal("Notice", "Bạn có muốn xóa voucher này không ? ", { buttons: { ok: "Ok", cancel: "Cancel" } })
                              .then(async value => {
                                if (value === "ok") {
                                  const result = await delete_voucher(row.id)
                                  if (result.ok === true) {
                                    swal("Notice", "Xóa thành công", "success")
                                      .then(() => setGetList(getList.filter(item => item.id !== row.id)))
                                  }
                                  else {
                                    swal("Notice", "Xóa thất bại", "error")
                                  }
                                }
                              })
                          }} title={"Delete"}>
                            <i className="fas fa-trash-alt" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="pagination">
              {/* Nút chuyển đến trang trước */}
              <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                Prev
              </Button>
              {/* Hiển thị các nút chuyển đến các trang cụ thể */}
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                <Button key={page} onClick={() => goToPage(page)} disabled={currentPage === page}>
                  {page}
                </Button>
              ))}
              {/* Nút chuyển đến trang tiếp theo */}
              <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
