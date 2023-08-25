import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import Moment from "react-moment";
import get_detail_voucher from "../../../../../api/get_detail_voucher";
import numberWithCommas from "../../../../../util/number_thousand_separator";
import { Fragment } from "react";

const View = (props) => {
  const [self, setSelf] = useState({ Addresses: [], Carts: [], voucherId: 0 });
  const [dataVoucher, setDataVoucher] = useState({
    data: { discount: 0 },
    ok: false,
  });

  useEffect(() => {
    (async () => {
      const voucherId = self.voucherId || 0;
      if (voucherId != 0) {
        const result = await get_detail_voucher(voucherId);
        setDataVoucher(result);
      }
    })();
  }, [self]);

  useEffect(() => {
    setSelf(props.location.state);
  }, [props.location.state]);

  const handleBack = () => {
    props.history.goBack();
  };

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-5 col-md-9 col-lg-6">
              <h2 className="mt-30 page-title">Orders</h2>
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
            <li className="breadcrumb-item">
              <a href="/">Orders</a>
            </li>
            <li className="breadcrumb-item active">Order View</li>
          </ol>
          <div className="row">
            {self ? (
              <div className="col-xl-12 col-md-12">
                <div className="card card-static-2 mb-30">
                  <div className="card-title-2">
                    <h2 className="title1458">Invoice</h2>
                    <span className="order-id">Order #ORDR-{self.number}</span>
                  </div>
                  <div className="invoice-content">
                    <div className="row">
                      <div className="col-lg-6 col-sm-6">
                        <div className="ordr-date">
                          <b>Order Date :</b>{" "}
                          <Moment format="MMMM Do YYYY">
                            {self.createdAt}
                          </Moment>
                        </div>
                        <div className="ordr-date">
                          {console.log(self)}
                          {
                            <Fragment>
                              {self.status === "processing" && (
                                <Fragment>
                                  <b>Process Date :</b>{" "}
                                  <Moment format="MMMM Do YYYY">
                                    {self.deliverydate}
                                  </Moment>
                                </Fragment>
                              )}
                            </Fragment>
                          }

                          {
                            <Fragment>
                              {self.status === "shipping" && (
                                <Fragment>
                                  <b>Shipping Date :</b>{" "}
                                  <Moment format="MMMM Do YYYY">
                                    {self.deliverydate}
                                  </Moment>
                                </Fragment>
                              )}
                            </Fragment>
                          }
                          {
                            <Fragment>
                              {self.status === "delivered" && (
                                <Fragment>
                                  <b>Delivered Date :</b>{" "}
                                  <Moment format="MMMM Do YYYY">
                                    {self.deliverydate}
                                  </Moment>
                                </Fragment>
                              )}
                            </Fragment>
                          }
                          {
                            <Fragment>
                              {self.status === "cancel" && (
                                <Fragment>
                                  <b>Cancel Date :</b>{" "}
                                  <Moment format="MMMM Do YYYY">
                                    {self.deliverydate}
                                  </Moment>
                                </Fragment>
                              )}
                            </Fragment>
                          }
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-6">
                        {/* eslint-disable-next-line */}
                        {self.Addresses.map((data, index) => (
                          <div className="ordr-date right-text" key={index}>
                            {/* <b>Order Date :</b> */}
                            <br />#{data.shipping},<br />
                            {data.area},<br />
                            {data.city},<br />
                            {data.discrict},<br />
                            {data.states},<br />
                          </div>
                        ))}
                      </div>
                      <div className="col-lg-12">
                        <div className="card card-static-2 mb-30 mt-30">
                          <div className="card-title-2">
                            <h4>Recent Orders</h4>
                          </div>
                          <div className="card-body-table">
                            <div className="table-responsive">
                              <table className="table ucp-table table-hover">
                                <thead>
                                  <tr>
                                    <th style={{ width: 130 }}>#</th>
                                    <th>Image</th>
                                    <th>Item</th>
                                    <th
                                      style={{ width: 150 }}
                                      className="text-center"
                                    >
                                      Price
                                    </th>
                                    <th
                                      style={{ width: 150 }}
                                      className="text-center"
                                    >
                                      Discount(%)
                                    </th>
                                    <th
                                      style={{ width: 150 }}
                                      className="text-center"
                                    >
                                      Qty
                                    </th>
                                    <th
                                      style={{ width: 100 }}
                                      className="text-center"
                                    >
                                      Total
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {self.Carts.map((p, index) => (
                                    <tr key={index}>
                                      <td>{p.id}</td>
                                      <td>
                                        <img
                                          src={p.photo}
                                          alt="cartimage"
                                          style={{ height: "50px" }}
                                        />
                                      </td>
                                      <td>{p.name}</td>
                                      <td className="text-center">
                                        VND{numberWithCommas(p.price)}
                                      </td>
                                      <td className="text-center">
                                        {p.discount}%
                                      </td>
                                      <td className="text-center">{p.qty}</td>
                                      <td className="text-center">
                                        VND{numberWithCommas((parseInt(p.price) * parseInt(p.qty)))}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-7" />
                      <div className="col-lg-5">
                        {/* <div className="order-total-dt">
                          <div className="order-total-left-text">Sub Total</div>
                          <div className="order-total-right-text">
                            VND{self.grandtotal}
                          </div>
                        </div> */}
                        <div className="order-total-dt">
                          <div className="order-total-left-text">
                            Delivery Fees
                          </div>
                          <div className="order-total-right-text">
                            VND{numberWithCommas(self.deliveryFee)}
                          </div>
                        </div>
                        {self && self.voucherId != 0 && (
                          <div className="order-total-dt">
                            <div className="order-total-left-text">
                              Discount
                            </div>
                            <div className="order-total-right-text">
                              VND{numberWithCommas(dataVoucher.data.discount)}
                            </div>
                          </div>
                        )}
                        <div className="order-total-dt">
                          <div className="order-total-left-text fsz-18">
                            Total Amount
                          </div>
                          <div className="order-total-right-text fsz-18">
                            VND{numberWithCommas(self.grandtotal)}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-7" />
                      <div className="col-lg-5">
                        <div className="select-status">
                          <label htmlFor="status">Status*</label>
                          <div className="input-group">
                            <div className="status-active">{self.status}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              "Loading"
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default View;
