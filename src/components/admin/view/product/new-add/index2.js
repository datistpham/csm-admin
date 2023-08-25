import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import MainCategorylist from "../../../../common/category/main-category";
import { GetCategoryDetails } from "../../../../services";
import SubCategorylist from "../../../../common/category/sub-category";
import ChildCategorylist from "../../../../common/category/child-category";
import { GetProductDetails } from "../../../../services";
import RichTextEditor from "../../../../RichTextEditor";
import Loader from "../../../../loader";
import { NotificationManager } from "react-notifications";
import swal from "sweetalert";
import { toast } from "react-toastify";
import { Fragment } from "react";
// import {AiFillCloseCircle } from "react-icons"
import TextField from "@material-ui/core/TextField";
import AddSize from "./add_size";

const NewProduct = () => {
  const [files, setFiles] = useState([]);
  const [getList, setGetList] = useState([]);
  const [getSublist, setGetSublist] = useState([{ name: "" }]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedChildCategory, setSelectedChildCategory] = useState("");
  const [blockHide, setBlockHide] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState(1);
  const [unit, setUnit] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [sortDesc, setSortDesc] = useState(null);
  const [buyerPrice, setBuyerPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [qty, setQty] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [discountPer, setDiscountPer] = useState(0);
  const [total, setTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [previewImage, setPreviewImage] = useState([]);
  const [typeUnit, setTypeUnit] = useState(0);
  const [size, setSize] = useState([]);

  useEffect(() => {
    if (["short", "Short"].includes(getSublist[0].name) === true) {
      setTypeUnit(1);
    } else if (["shirt", "Shirt"].includes(getSublist[0].name) === true) {
      setTypeUnit(2);
    } else if (
      !["short", "Short"].includes(getSublist[0].name) &&
      !["shirt", "Shirt"].includes(getSublist[0].name)
    ) {
      setTypeUnit(3);
    }
  }, [getSublist]);

  const handleBack = () => {
    history.goBack();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setSlug(value.toLowerCase().replaceAll(" ", "-"));
    }
    if (name === "unit") {
      setSize(value);
    }
    switch (name) {
      case "name":
        setName(value);
        break;
      case "brand":
        setBrand(value);
        break;
      case "status":
        setStatus(value);
        break;
      case "buyerPrice":
        setBuyerPrice(value);
        break;
      case "price":
        setPrice(value);
        break;
      case "qty":
        setQty(value);
        break;
      case "discountPer":
        setDiscountPer(value);
        break;
      default:
        break;
    }
  };

  const onFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleContentChange = (contentHtml) => {
    setContent(contentHtml);
  };

  const handleCategory = async (value) => {
    setSelectedCategory(value);
    let categoryId = value;
    let list = await GetCategoryDetails.getSelectSubCategory(categoryId);
    setGetList(list.data);
  };

  const handleSubCategory = async (value) => {
    setSelectedSubCategory(value);
    let list = await GetCategoryDetails.getAllSubChildCategory(value);
    setGetSublist(list.data);
    setBlockHide(true);
  };

  const handleChildCategory = async (value) => {
    setSelectedChildCategory(value);
  };

  const caculationTable = () => {
    let price = price;
    let qty = qty;
    let discountPer = discountPer;
    if (price > 0 && qty > 0 && discountPer >= 0) {
      let discount = Math.round((price * qty * discountPer) / 100);
      let total = Math.round(price * qty);
      let grand_total = Math.round(price * qty - discount);

      setTotal(total);
      setGrandTotal(grand_total);
      setDiscount(discount);
    } else {
      NotificationManager.error(
        "Negative value & Zero Price not allowed",
        "Input Field"
      );
    }
  };

  const handleCheckPrice = () => {
    caculationTable();
    setToggle(!toggle);
  };

  const handleSubmit = async (event, listImage) => {
    console.log(listImage);
    event.preventDefault();
    setIsLoaded(true);
    const formData = new FormData();
    formData.append("categoryId", selectedCategory);
    formData.append("subCategoryId", selectedSubCategory);
    formData.append("childCategoryId", selectedChildCategory);
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("brand", brand);
    formData.append("status", status);
    formData.append("unitSize", unit);
    formData.append("desc", content);
    formData.append("sortDesc", sortDesc);
    formData.append("photo", image);
    formData.append("buyerPrice", buyerPrice);
    formData.append("price", price);
    formData.append("qty", qty);
    formData.append("discountPer", discountPer);
    formData.append("discount", discount);
    formData.append("total", total);
    formData.append("netPrice", grandTotal);
    formData.append("image", JSON.stringify(listImage));
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    swal({
      title: "Are you sure?",
      text: "You want to Add New Product",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (success) => {
      if (success) {
        let list = await GetProductDetails.addProductList(formData, config);
        if (list) {
          setIsLoaded(false);
          history.push("/admin/product/list");
        } else {
          NotificationManager.error("Please! Check input field", "Input Field");
        }
      }
    });
  };

  const fileSelectedHandler = (e) => {
    setFiles(e.target.files);
    const arr = [];
    Object.values(e.target.files).map((item) => console.log(item));

    Object.values(e.target.files).map((item) =>
      arr.push({ preview: URL.createObjectURL(item), id: item.lastModified })
    );
    setPreviewImage(arr);

    const handleSubmitMoreImage = async (event) => {
      setIsLoaded(true);
      const formData = new FormData();
      formData.append("productId", "-1");
      for (const file of files) {
        formData.append("file", file);
      }
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      let list = await GetProductDetails.getUploadProductImage(
        formData,
        config
      );
      if (list) {
        setIsLoaded(false);
        toast.success("successfully added");
        return list;
        // window.location.href = "/admin/product/more-photo";
      } else {
        toast.error("error");
        return [];
      }
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-5 col-md-9 col-lg-6">
            <h2 className="mt-30 page-title">Products</h2>
          </div>
          <div className="col-lg-5 col-md-3 col-lg-6 back-btn mb-3">
            <Button variant="contained" onClick={handleBack}>
              <i className="fas fa-arrow-left" /> Back
            </Button>
          </div>
          <br />
        </div>
        <ol className="breadcrumb mb-30">
          <li className="breadcrumb-item">
            <a href="/">Dashboard</a>
          </li>
          <li className="breadcrumb-item">
            <a href="/admin/product/create">Products</a>
          </li>
          <li className="breadcrumb-item active">Add Product</li>
        </ol>
        <div className="row">
          <div className="col-lg-6 col-md-6">
            <div className="card card-static-2 mb-30">
              <div className="card-body-table">
                <div className="news-content-right pd-20">
                  <div className="form-group">
                    <label className="form-label">Category*</label>
                    <MainCategorylist onSelectCategory={handleCategory} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <div className="card card-static-2 mb-30">
              <div className="card-body-table">
                <div className="news-content-right pd-20">
                  <div className="form-group">
                    <label className="form-label">Sub Category*</label>
                    <SubCategorylist
                      state={getList}
                      onSelectSubCategory={handleSubCategory}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="row"
          style={blockHide ? { display: "block" } : { display: "none" }}
        >
          {isLoaded ? <Loader /> : ""}
          <div className="col-lg-12 col-md-12">
            <div className="card card-static-2 mb-30">
              <div className="card-title-2">
                <h4>Add New Product</h4>
              </div>
              <div className="card-body-table">
                <div className="news-content-right pd-20">
                  <div className="row">
                    <div className="col-lg-2 col-md-2">
                      <div className="form-group">
                        <label className="form-label">Product Name*</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Product Name"
                          name="name"
                          value={name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2">
                      <div className="form-group">
                        <label className="form-label">Category*</label>
                        <ChildCategorylist
                          state={getSublist}
                          onSelectchildCategory={handleChildCategory}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2">
                      <div className="form-group">
                        <label className="form-label">Brand*</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Brand Name"
                          name="brand"
                          value={brand}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2">
                      <div className="form-group">
                        <label className="form-label">Size*</label>
                        <div className={"d-flex align-items-center"}>
                          <input
                            type="size"
                            className="form-control"
                            name="image"
                            value={size.map((item) => item)}
                            onChange={handleChange}
                          />
                          <AddSize />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2">
                      <div className="form-group">
                        <label className="form-label">Image label*</label>
                        <input
                          type="file"
                          className="form-control"
                          name="image"
                          onChange={onFileChange}
                        />
                      </div>
                    </div>
                    {/* new */}
                    <div className="col-lg-4 col-md-4">
                      <div className="form-group">
                        <label className="form-label">Product image*</label>
                        <input
                          className="form-control"
                          type="file"
                          multiple
                          name="files"
                          onChange={fileSelectedHandler}
                        />
                        <br />
                        <div
                          className={
                            "d-flex align-items-center g-10 mr-2 flex-wrap mb-3"
                          }
                        >
                          {previewImage.length > 0 &&
                            previewImage.map((item, key) => (
                              <div style={{ position: "relative" }}>
                                <img
                                  key={key}
                                  src={item.preview}
                                  className={"mr-3 mb-3"}
                                  style={{
                                    width: 130,
                                    height: 130,
                                    borderRadius: 10,
                                    objectFit: "cover",
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    setPreviewImage(
                                      previewImage.filter(
                                        (item2) => item2.id != item.id
                                      )
                                    );
                                    setFiles(
                                      [...files].filter(
                                        (item2) => item2.lastModified != item.id
                                      )
                                    );
                                  }}
                                  style={{
                                    position: "absolute",
                                    right: 0,
                                    top: 0,
                                  }}
                                >
                                  X
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                    {/*  */}
                  </div>
                  <div className="row" style={{ paddingTop: "2rem" }}>
                    <div className="col-lg-2 col-md-2">
                      <div className="form-group">
                        <label className="form-label">Status*</label>
                        <select
                          id="status"
                          name="status"
                          className="form-control"
                          value={status}
                          onChange={handleChange}
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2">
                      <div className="form-group">
                        <label className="form-label">Cost*</label>
                        <input
                          type="number"
                          className="form-control"
                          name="buyerPrice"
                          value={buyerPrice}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2">
                      <div className="form-group">
                        <label className="form-label">Price*</label>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          value={price}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-1 col-md-1">
                      <div className="form-group">
                        <label className="form-label">Amount*</label>
                        <input
                          type="number"
                          className="form-control"
                          name="qty"
                          value={qty}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-1 col-md-1" style={{}}>
                      <div className="form-group">
                        <label className="form-label">Discount(%)*</label>
                        <input
                          type="number"
                          className="form-control"
                          name="discountPer"
                          value={discountPer}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                    <div
                      className="col-lg-1 col-md-1"
                      style={{ display: "none" }}
                    >
                      <div className="form-group">
                        <label className="form-label">Discount Price*</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled
                          name="discount"
                          value={discount}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                    <div
                      className="col-lg-1 col-md-1"
                      style={{ display: "none" }}
                    >
                      <div className="form-group">
                        <label className="form-label">Total *</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled
                          name="total"
                          value={total}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                    <div
                      className="col-lg-2 col-md-2"
                      style={{ display: "none" }}
                    >
                      <div className="form-group">
                        <label className="form-label">Grand Total *</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled
                          name="grand_total"
                          value={grandTotal}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row" style={{ paddingTop: "2rem" }}>
                    <div className="form-group" style={{opacity: 0}}>
                      <label className="form-label">Sort Description*</label>
                      <textarea
                        rows="4"
                        cols="100"
                        className="form-control"
                        name="sortDesc"
                        value={sortDesc}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label className="form-label">Description*</label>
                        <RichTextEditor
                          content={content}
                          handleContentChange={handleContentChange}
                          placeholder="insert text here..."
                        />
                      </div>
                    </div>
                  </div>
                  <div className="button_price">
                    {/* <div className="form-group">
                      <Button
                        className="checkprice"
                        variant="contained"
                        onClick={() => handleCheckPrice()}
                      >
                        Preview
                      </Button>
                    </div> */}
                    <div
                      className="form-group"
                      style={
                        toggle ? { display: "block" } : { display: "none" }
                      }
                    >
                      <button
                        className="save-btn hover-btn"
                        type="submit"
                        onClick={async (e) => {
                          const result = await handleSubmitMoreImage(e);
                          setTimeout(() => {
                            handleSubmit(e, result.data);
                          }, 5000);
                        }}
                      >
                        Add New Product
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};
