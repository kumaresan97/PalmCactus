import * as React from "react";
import { useEffect, useState } from "react";
import { Item, sp } from "@pnp/sp/presets/all";
import {
  SelectionMode,
  Modal,
  IColumn,
  DetailsList,
  DefaultButton,
  Icon,
  Label,
  IconButton,
  PrimaryButton,
  TextField,
  Dropdown,
  ITextFieldStyles,
  Checkbox,
  IDropdownOption,
  Selection,
  SearchBox,
  ShimmeredDetailsList,
  TooltipHost,
} from "@fluentui/react";
// import { ShimmeredDetailsList } from "@fluentui/react/lib/ShimmeredDetailsList";
import { Panel } from "@fluentui/react/lib/Panel";
import * as moment from "moment";
import { Config } from "../../config/config";
import Pagination from "office-ui-fabric-react-pagination";

import { IList, ICurrentUserInfo } from "../../config/config";
import SPServices from "../../config/SPServices";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import "./Style.css";
import * as strings from "SFloridaWebPartStrings";
import { values } from "office-ui-fabric-react";
import * as alertify from "alertifyjs";
let img: string = require("../assets/Filter.png");

//styles
const buttonstyle = {
  root: {
    background: "#02767a",
    color: "#fff",
    border: "1px solid #02767a",
  },
  rootHovered: {
    backgroundColor: "#02767a",
    color: "#fff",
  },
};

const textStyle = {
  root: {
    width: "100%",
  },
  field: {
    padding: "15x 6px !important",
    fontSize: "13px",
  },
  fieldGroup: {
    border: "none !important",
    background: "#faf8f9",
    borderRadius: "4px",

    "&:hover": {
      border: "1px solid #000 !important",
    },
  },
};
const labelstyle = {
  root: {
    fontSize: "12px",
    fontWeight: "600",
  },
};

const searchstyle = {
  root: {
    width: 160,
  },
};
const dollarInputStyle: Partial<ITextFieldStyles> = {
  root: {
    width: "100%",
  },
  field: {
    padding: "15x 6px !important",
    fontSize: "13px",
  },
  fieldGroup: {
    border: "1px solid #000 !important",
    backgroundColor: "#faf9f8",
    "::after": {
      border: "none",
    },
    "&:focus": {
      border: "2px solid #000 !important",
      borderWidth: "2px !important",
    },
  },
};
const _data: IList = {
  InvestorName: "",
  LLC: "",
  Phone: "",
  Email: "",
  PurchasePriceRange: [],
  Notes: "",
  InvestorStrategy: [],
  ContactID: "",
  FileID: "",
  AssignedTo: null,
  PeopleEmail: "",
  Areas: [],
  Url: "",
  Text: "",
  AssignedName: "",
  ID: null,
  attachments: [],
  Created: "",
  Modified: "",
  CreatedBy: "",
  ModifiedBy: "",
};

let attachFiles: any[] = [];
let files: any[] = [];
let totalPage: number = 30;
let currentPage = 1;

let objFilter = {
  Name: "",
  LLC: "",
  User: "",
};
let objCurrentUserInfo: ICurrentUserInfo = null;
// const ListName: string = "Disclosed Investors Devlist";
const ListName: string = "Disclosed Investors";

// AssigedTo EMail as PeopleEmail;
const DisclosedDetail = (props) => {
  const [state, setState] = useState<IList[]>([]);
  const [masterData, setMasterData] = useState([]);
  const [hamburgerActive, setHamburgerActive] = useState(false);

  //   const [currentData, setCurrentData] = useState<IList[]>([...Datas]);

  const [responseData, setResponseData] = useState<IList>(_data);
  const [isMobile, setIsMobile] = useState(false);

  const [selectionId, setSelectionId] = useState([]);
  const [updateData, setUpdateData] = useState<IList>(null);
  const [page, setPage] = useState(state);
  const [paginateNumber, setPaginateNumber] = useState([]);
  const [loader, setLoader] = useState(false);

  const [select, setSelect] = useState({
    singleSelect: false,
    multiSelect: false,
    isdelete: false,
    id: null,
  });
  const [error, setError] = useState({
    InvestorName: "",

    Email: "",
    Phone: "",
  });
  const [isopen, setIsopen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [filterValue, setFilterValue] = useState({
    Name: "",
    LLC: "",
    User: "",
  });
  const [isTranferModal, SetIsTransferModal] = useState(false);
  const [currentUserInfo, setCurrentUserInfo] =
    useState<ICurrentUserInfo>(null);
  const [isCurrUserItem, setIsCurrUserItem] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  //column
  const _curUser: string = props.context._pageContext._user.email;
  const [optPurchaseRange, setOptPurchaseRange] = useState([
    { key: "", text: "" },
  ]);
  const [optInvStrategy, setOptInvStrategy] = useState([{ key: "", text: "" }]);
  const [optAreas, setOptAreas] = useState([{ key: "", text: "" }]);
  const col: IColumn[] = [
    {
      key: "column1",
      name: "Investor Name",
      fieldName: "InvestorName",
      minWidth: 100,
      maxWidth: 200,
      //   onRender(item) {
      //     return item.PeopleEmail.toLowerCase() == _curUser.toLowerCase() ? (
      //       <div>
      //         <p className="para">{item.InvestorName}</p>
      //       </div>
      //     ) : (
      //       ""
      //     );
      //   },
      isResizable: true,
    },
    {
      key: "column6",
      name: "Notes",
      fieldName: "Notes",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (Item: any) => {
        return isAdmin ||
          Item.PeopleEmail.toLowerCase() == _curUser.toLowerCase() ? (
          <TooltipHost content={Item.Notes}>
            <p className="text_ellipsis">{Item.Notes}</p>
          </TooltipHost>
        ) : (
          ""
        );
      },
    },
    {
      key: "column2",
      name: "LLC",
      fieldName: "LLC",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },

    {
      key: "column3",
      name: "Phone #",
      fieldName: "Phone",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender(item) {
        return isAdmin ||
          item.PeopleEmail.toLowerCase() == _curUser.toLowerCase() ? (
          <div>
            <p className="para">{item.Phone}</p>
          </div>
        ) : (
          <div>
            <p className="para">{item.Phone.replace(/.(?=.{4})/g, "x")}</p>
          </div>
        );
      },
    },
    {
      key: "column4",
      name: "Email",
      fieldName: "Email",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (Item: any) => {
        return isAdmin ||
          Item.PeopleEmail.toLowerCase() == _curUser.toLowerCase() ? (
          <TooltipHost content={Item.Email}>
            <p className="text_ellipsis">{Item.Email}</p>
          </TooltipHost>
        ) : (
          ""
        );
      },
    },
    {
      key: "column5",
      name: "Purchase Price Range",
      fieldName: "PurchasePriceRange",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (Item: any) => {
        return isAdmin ||
          Item.PeopleEmail.toLowerCase() == _curUser.toLowerCase() ? (
          <TooltipHost content={Item.PurchasePriceRange.join(",")}>
            <p className="text_ellipsis">{Item.PurchasePriceRange.join(",")}</p>
          </TooltipHost>
        ) : (
          ""
        );
      },
    },
    {
      key: "column6",
      name: "Investor Strategy",
      fieldName: "InvestorStrategy",
      minWidth: 130,
      maxWidth: 200,
      isResizable: true,
      onRender: (Item: any) => {
        return isAdmin ||
          Item.PeopleEmail.toLowerCase() == _curUser.toLowerCase() ? (
          <TooltipHost content={Item.InvestorStrategy.join(",")}>
            <p className="text_ellipsis">{Item.InvestorStrategy.join(",")}</p>
          </TooltipHost>
        ) : (
          ""
        );
      },
    },

    {
      key: "column6",
      name: "Areas",
      fieldName: "Areas",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (Item: any) => {
        return isAdmin ||
          Item.PeopleEmail.toLowerCase() == _curUser.toLowerCase() ? (
          <TooltipHost content={Item.Areas.join(",")}>
            <p className="text_ellipsis">{Item.Areas.join(",")}</p>
          </TooltipHost>
        ) : (
          ""
        );
      },
    },

    {
      key: "column6",
      name: "DisclosedUrl",
      fieldName: "",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => {
        return <a href={item.Url}>{item.Text}</a>;
      },
    },
    {
      key: "column6",
      name: "AssignedTo",
      fieldName: "AssignedName",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },

    {
      key: "column6",
      name: "Created",
      fieldName: "Created",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => {
        return isAdmin ||
          item.PeopleEmail.toLowerCase() == _curUser.toLowerCase() ? (
          <div>
            <p className="para">{item.Created}</p>
          </div>
        ) : (
          ""
        );
      },
    },

    {
      key: "column6",
      name: "Created By",
      fieldName: "CreatedBy",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => {
        return isAdmin ||
          item.PeopleEmail.toLowerCase() == _curUser.toLowerCase() ? (
          <div>
            <p className="para">{item.CreatedBy}</p>
          </div>
        ) : (
          ""
        );
      },
    },
    {
      key: "column6",
      name: "Modified",
      fieldName: "Modified",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => {
        return isAdmin ||
          item.PeopleEmail.toLowerCase() == _curUser.toLowerCase() ? (
          <div>
            <p className="para">{item.Modified}</p>
          </div>
        ) : (
          ""
        );
      },
    },

    {
      key: "column6",
      name: "Modified By",
      fieldName: "ModifiedBy",
      isResizable: true,
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return isAdmin ||
          item.PeopleEmail.toLowerCase() == _curUser.toLowerCase() ? (
          <div>
            <p className="para">{item.ModifiedBy}</p>
          </div>
        ) : (
          ""
        );
      },
    },

    // {
    //   key: "column6",
    //   name: "ContactID",
    //   fieldName: "ContactID",
    //   minWidth: 100,
    //   maxWidth: 200,
    // },
    // {
    //   key: "column6",
    //   name: "FileID",
    //   fieldName: "FileID",
    //   minWidth: 100,
    //   maxWidth: 200,
    // },

    {
      key: "column11",
      name: "Disclosure",
      fieldName: "attachments",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,

      onRender: (item: any) => {
        return isAdmin ||
          item.PeopleEmail.toLowerCase() == _curUser.toLowerCase() ? (
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {item.attachments.map((att, index) => (
              <li title={att.fileName} key={index}>
                <a
                  className="text_ellipsis"
                  style={{ color: "#605E5C", cursor: "pointer" }}
                  href={att.serverRelativeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {att.fileName}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          ""
        );
      },
    },
  ];
  // get currentUserINfo
  const getCurrentUserInfo = () => {
    sp.web.currentUser.get().then((res) => {
      console.log(res);
      objCurrentUserInfo = {
        Title: res.Title,
        Email: res.Email,
        Id: res.Id,
        UserPrincipalName: res.UserPrincipalName,
      };
      setIsAdmin(
        res.UserPrincipalName.toLocaleLowerCase() === "jason@palmcactus.com"
      );
      setCurrentUserInfo({ ...objCurrentUserInfo });
    });
  };
  //   Config.ListName.Email
  const getDatas = () => {
    SPServices.SPReadItems({
      // Listname: "Disclosed Investors Dev",
      Listname: ListName,
      Select:
        "*, AssignedTo/EMail,AssignedTo/Title,AttachmentFiles,Author/Title,Editor/Title",

      Expand: "AssignedTo,AttachmentFiles,Author,Editor",
      Orderby: "Created",
      Orderbydecorasc: false,
    })
      .then((res) => {
        let arrDatas: IList[] = [];
        const DataArray = [];
        res.forEach((data: any) => {
          let arrGetAttach = [];
          data.AttachmentFiles.forEach((val) => {
            arrGetAttach.push({
              fileName: val.FileName,
              content: null,
              isNew: false,
              isDelete: false,
              serverRelativeUrl: val.ServerRelativeUrl,
            });
          });

          arrDatas.push({
            InvestorName: data.Title ? data.Title : "",
            LLC: data.field_1 ? data.field_1 : "",
            Phone: data.field_2 ? data.field_2 : "",
            Email: data.field_3 ? data.field_3 : "",
            PurchasePriceRange: data.field_4 ? data.field_4 : [],
            Notes: data.field_6 ? data.field_6 : "",
            InvestorStrategy: data.InvestorStrategy
              ? data.InvestorStrategy
              : [],
            ContactID: data.ContactID ? data.ContactID : "",
            FileID: data.FileID ? data.FileID : "",
            AssignedTo: data.AssignedToId ? data.AssignedToId : null,
            PeopleEmail: data.AssignedTo ? data.AssignedTo.EMail : "",
            Areas: data.field_5 ? data.field_5 : [],
            ID: data.ID ? data.ID : null,
            attachments: arrGetAttach,
            Url: data.DisclosureUrl?.Url,
            Text: data.DisclosureUrl?.Description,
            AssignedName: data.AssignedTo ? data.AssignedTo.Title : "",
            Created: data.Created ? moment(data.Created).format("ll") : "",
            Modified: data.Modified ? moment(data.Modified).format("ll") : "",
            CreatedBy: data.Author ? data.Author.Title : "",
            ModifiedBy: data.Editor ? data.Editor.Title : "",
          });
        });

        paginate(1, [...arrDatas]);

        setState([...arrDatas]);
        setMasterData([...arrDatas]);

        setLoader(false);
      })
      .catch((err) => console.log(err));
  };

  //OnchangeValues
  const onChangeValues = (key, _value) => {
    let FormData = { ...responseData };
    let err = { ...error };

    //     if(key=="PurchasePriceRange"){
    //         if()
    //     }
    //     FormData[key] = _value;
    //     console.log(FormData);
    //   };

    FormData[key] = _value;

    if (key === "Phone") {
      // if (!/^\d*$/.test(_value)) {
      if (!/^-?\d*\.?\d*$/.test(_value)) {
        err[key] = "Please enter a Number";
      } else {
        err[key] = null;
      }
    }

    if (key === "Email") {
      if (_value && !/^[^@]+@[^@]+\.[^.]+$/.test(_value)) {
        err[key] = "Enter a valid email address";
      } else {
        err[key] = "";
      }
    }

    if (key === "InvestorName") {
      const trimmedValue = _value.trim();
      if (trimmedValue === "") {
        err[key] = "Title is required";
      } else {
        const titleExists = masterData.some((item) => {
          return (
            item.InvestorName.toLowerCase().trim() ===
              trimmedValue.toLowerCase() && item.ID !== FormData.ID
          );
        });

        if (titleExists) {
          err[key] = "This value already exists";
          // newErrors["Mls"] = "This value already exists ";
        } else {
          err[key] = "";
          // newErrors["Mls"] = "";
        }
      }
    }
    setError({ ...err });
    // setCurrentData([...FormData]);

    setResponseData({ ...FormData });
  };
  const DropdownChange = (key, val) => {
    let x = { ...responseData };
    if (
      key == "PurchasePriceRange" ||
      key == "Areas" ||
      key == "InvestorStrategy"
    ) {
      x[key] = val.selected
        ? [...x[key], val.text as string]
        : x[key].filter((a) => a !== val.key);
    }
    // setCurrentData([...x]);
    setResponseData({ ...x });
  };
  const addItem = () => {
    setIsopen(false);
    setIsEdit(false);

    setLoader(true);
    let val = {
      Title: responseData.InvestorName,
      field_1: responseData.LLC,
      field_2: responseData.Phone,
      field_3: responseData.Email,
      field_4: { results: responseData.PurchasePriceRange },
      field_5: { results: responseData.Areas },
      field_6: responseData.Notes,
      //   ContactID: responseData.ContactID,
      //   FileID: responseData.FileID,
      InvestorStrategy: { results: responseData.InvestorStrategy },
      DisclosureUrl: {
        Description: responseData.Text,
        Url: responseData.Url,
      },

      AssignedToId: responseData.AssignedTo,
    };
    SPServices.SPAddItem({
      // Listname: "Disclosed Investors Dev",
      Listname: ListName,
      RequestJSON: val,
    })
      .then(async (res) => {
        let x = responseData.attachments.filter((a) => {
          return a.isDelete != true;
        });
        let countNew = 0;
        for (let i = 0; i < x.length; i++) {
          await sp.web.lists
            // .getByTitle("Disclosed Investors Dev")
            .getByTitle(ListName)

            .items.getById(res.data.Id)
            .attachmentFiles.add(x[i].fileName, x[i].content)
            .then(async (res) => {
              countNew = countNew + 1;
              if (countNew >= x.length) {
                await getDatas();
                // setCurrentData([...Datas]);
                setResponseData({ ..._data });
                // SetReRender(true);
              }
            })
            .catch((err) => {
              setLoader(false);
              console.log(err);
            });
        }
        setLoader(false);

        getDatas();
      })

      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  //select item
  const itemSelection = new Selection({
    onSelectionChanged: () => {
      const selectedItem: any[] = itemSelection.getSelection();
      if (selectedItem.length == 1) {
        setUpdateData({ ...selectedItem[0] });
        // checking current is Assigned To/
        setIsCurrUserItem(selectedItem[0].PeopleEmail == currentUserInfo.Email);

        selectedItem[0];
        select.multiSelect = false;
        select.singleSelect = true;
        select.id = selectedItem[0].ID;
        setSelect({ ...select });
      } else if (selectedItem.length == 0) {
        select.multiSelect = false;
        select.singleSelect = false;
        setSelect({ ...select });
      } else {
        let temp = [];
        selectedItem.map((item) => temp.push(item.ID));
        setSelectionId(temp);
        select.multiSelect = true;
        select.singleSelect = false;
        setSelect({ ...select });
      }
    },
  });

  //getfiles

  const getFile = (e: any) => {
    files = e.target.files;
    // document.getElementById("att").focus();
    // let testArr = [...currentData];
    let testArr: IList = { ...responseData };
    testArr.attachments = attachFiles;
    // attachFiles = [...currentData[0].attachments];
    for (let i = 0; i < files.length; i++) {
      attachFiles.push({
        fileName: files[i].name,
        content: files[i],
        isNew: true,
        isDelete: false,
        serverRelativeUrl: "",
        itemId: responseData.ID,
      });
    }
    // setCurrentData(testArr);
    setResponseData({ ...testArr });
    // setCurrentData(
    //     [...currentData[0].attachments])
    // setCurrentData({...currentData,currentData[0].attachments:[...attachFiles]]};
    // console.log(attachment, "attach");
  };

  //cancel files

  const calcelAttach = (index) => {
    let test = { ...responseData };
    let temp = test.attachments;
    if (temp[index].isNew) {
      temp.splice(index, 1);
    } else {
      temp[index].isDelete = true;
    }
    // setCurrentData(test);
    setResponseData({ ...test });
  };
  const UpdateItem = () => {
    setIsopen(false);
    setSelect({
      ...select,
      isdelete: false,
      singleSelect: false,
      multiSelect: false,
      id: null,
    });

    setLoader(true);
    let update = {
      Title: responseData.InvestorName,
      field_1: responseData.LLC,
      field_2: responseData.Phone,
      field_3: responseData.Email,
      field_4: { results: responseData.PurchasePriceRange },
      field_5: { results: responseData.Areas },
      field_6: responseData.Notes,
      //   ContactID: responseData.ContactID,
      //   FileID: responseData.FileID,
      InvestorStrategy: { results: responseData.InvestorStrategy },
      DisclosureUrl: {
        Description: responseData.Text,
        Url: responseData.Url,
      },

      AssignedToId: responseData.AssignedTo,
    };

    SPServices.SPUpdateItem({
      // Listname: "Disclosed Investors Dev",
      Listname: ListName,
      ID: responseData.ID,
      RequestJSON: update,
    })
      .then((res) => {
        let todelete = responseData.attachments.filter((val) => {
          return val.isNew == false && val.isDelete == true;
        });
        let toadd = responseData.attachments.filter((val) => {
          return val.isNew == true && val.isDelete == false;
        });

        if (todelete.length > 0) {
          todelete.forEach((val, i) => {
            sp.web.lists
              // .getByTitle("Disclosed Investors Dev")
              .getByTitle(ListName)
              .items.getById(responseData.ID)
              .attachmentFiles.getByName(val.fileName)
              .delete()
              .then((res) => {
                addDataAfterEdit(toadd, responseData.ID);
              })
              .catch((error) => {
                setLoader(false);
              });
          });
        } else {
          addDataAfterEdit(toadd, responseData.ID);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
        setIsopen(false);
      });
  };

  async function addDataAfterEdit(data, Id) {
    if (data.length > 0) {
      let newData = data.map((val) => {
        return {
          name: val.fileName,
          content: val.content,
        };
      });

      sp.web.lists

        // .getByTitle("Disclosed Investors Dev")
        .getByTitle(ListName)

        .items.getById(Id)

        .attachmentFiles.addMultiple(newData)
        .then((arr) => {
          setIsopen(false);
          getDatas();
        })
        .catch((err) => {
          setLoader(false);
        });
    } else {
      getDatas();
      setIsopen(false);
      // alert("Updated");
    }
    // alert("Updated");
  }

  ///delete datas

  const deleteData = () => {
    setLoader(true);

    select.isdelete = false;
    // select.multiSelect = false;
    setSelect({ ...select });
    {
      select.multiSelect == false
        ? sp.web.lists
            // .getByTitle("Disclosed Investors Dev")
            .getByTitle(ListName)
            .items.getById(select.id)
            .delete()
            .then((res) => {
              // SetReRender(true);
              setLoader(false);
              getDatas();
              setSelectionId([]);
              // alert("deleted successfully");
            })
            .catch((err) => {
              // alert(err);
              console.log(err);
              setLoader(false);
            })
        : selectionId.forEach((id, index) => {
            sp.web.lists
              // .getByTitle("Disclosed Investors Dev")
              .getByTitle(ListName)
              .items.getById(id)
              .delete()
              .then((res) => {
                if (index == selectionId.length - 1) {
                  // SetReRender(true);
                  setSelect({
                    ...select,
                    multiSelect: false,
                    id: null,
                    singleSelect: false,
                  });
                  setLoader(false);

                  getDatas();
                  // setLoader(false);
                  // alert("deleted successfully");
                }
              })
              .catch((err) => {
                // alert(err);
                console.log(err);
                setLoader(false);
              });
          });
    }
  };
  //pagination

  function paginate(pagenumber: number, Data) {
    let allItems = Data;
    var lastIndex = pagenumber * totalPage;
    var firstIndex = lastIndex - totalPage;
    var paginatedItems = allItems.slice(firstIndex, lastIndex);
    // setCrntPage(pagenumber);
    currentPage = pagenumber;

    setPage(paginatedItems);
    setPaginateNumber([firstIndex, lastIndex]);
  }
  const handlerRequestTransfer = (item) => {
    console.log(item.ID);
    sp.web.currentUser
      .get()
      .then((res) => {
        console.log(res.Id);
        let update = {
          TransferToId: res.Id,
        };
        SPServices.SPUpdateItem({
          // Listname: "Disclosed Investors Dev",
          Listname: ListName,
          ID: item.ID,
          RequestJSON: update,
        });
      })
      .then((res) => {
        SetIsTransferModal(false);
        alertify.set("notifier", "position", "top-right");
        alertify.success("Request Raised successfully!");
      })
      .catch((err) => {
        alert("err");
        SetIsTransferModal(false);
      });
  };
  ///search filter

  const handleSearch = (val) => {
    let filteredResults = state.filter((item) =>
      val.Name != ""
        ? item.InvestorName.toLowerCase().includes(
            val.Name.trim().toLowerCase()
          )
        : item
    );

    filteredResults = filteredResults.filter((li) =>
      val.User.trim() != ""
        ? li.AssignedName.toLowerCase().includes(val.User.trim().toLowerCase())
        : li
    );
    filteredResults = filteredResults.filter((li) =>
      val.LLC.trim() != ""
        ? li.LLC.toLowerCase().includes(val.LLC.trim().toLowerCase())
        : li
    );
    // setPaginateNumber([paginateNumber[0],filteredResults])
    // masterData([...filteredResults]);
    setMasterData([...filteredResults]);
    paginate(1, [...filteredResults]);
  };

  // mobile Responsive Change
  const handleResponsiveChange = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  // Getting dropdown values
  const handlerGetPurchaseRange = async () => {
    await sp.web.lists
      .getByTitle(ListName)
      .fields.getByTitle("Purchase Price Range")
      .get()
      .then((res: any) => {
        console.log(res.Choices);
        let arrPPR = res?.Choices?.map((opt) => {
          return {
            key: opt,
            text: opt,
          };
        });
        setOptPurchaseRange([...arrPPR]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handlerGetInvestorStrategy = async () => {
    await sp.web.lists
      .getByTitle(ListName)
      .fields.getByTitle("Investor Strategy")
      .get()
      .then((res: any) => {
        console.log(res.Choices);
        let arrIS = res?.Choices?.map((opt) => {
          return {
            key: opt,
            text: opt,
          };
        });
        setOptInvStrategy([...arrIS]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleGetAreas = async () => {
    await sp.web.lists
      .getByTitle(ListName)
      .fields.getByTitle("Areas")
      .get()
      .then((res: any) => {
        console.log(res.Choices);
        let arrAreas = res?.Choices?.map((opt) => {
          return {
            key: opt,
            text: opt,
          };
        });
        setOptAreas([...arrAreas]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  React.useEffect(() => {
    getCurrentUserInfo();
    setLoader(true);
    handlerGetPurchaseRange();
    handlerGetInvestorStrategy();
    handleGetAreas();
    getDatas();
    handleResponsiveChange();
    window.addEventListener("resize", handleResponsiveChange);
    return () => {
      window.removeEventListener("resize", handleResponsiveChange);
    };
  }, []);
  return (
    <div>
      {/* Transfer Confirmation */}
      {isTranferModal && (
        <>
          <Modal
            className="transferRequestModal"
            styles={{
              root: {
                padding: "20px",
              },
            }}
            isOpen={isTranferModal}
          >
            <p className="confrimationPopUp">
              Are you sure you want to raise a request for a transfer?
            </p>
            <div className="btnSection">
              <DefaultButton
                text="Cancel"
                onClick={() => SetIsTransferModal(false)}
              />
              <PrimaryButton
                text="Request"
                onClick={() => {
                  setResponseData({ ...updateData });
                  handlerRequestTransfer(responseData);
                }}
              />
            </div>
          </Modal>
        </>
      )}
      {/* Transfer Confirmation */}
      {/* mobile style */}
      <div
        style={{
          display: "flex",
          justifyContent: isMobile ? "end" : "space-between",
          alignItems: "center",
        }}
      >
        {!isMobile ? (
          <div>
            <Label
              styles={{
                root: {
                  fontSize: "16px",
                  FontWeights: "700",
                  padding: 0,
                },
              }}
            >
              Disclosed Investors
            </Label>
          </div>
        ) : (
          <></>
        )}

        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <div
            //   style={{ display: "flex", gap: "10px", alignItems: "center" }}
            className="header_filter_wraper"
          >
            <SearchBox
              placeholder="Assigned To"
              styles={searchstyle}
              onChange={(_, newValue) => {
                objFilter.User = newValue;
                handleSearch(objFilter);
              }}
              // onClick={() => {
              //   handleSearch(objFilter);
              // }}
            />
            <SearchBox
              placeholder="Investor Name"
              styles={searchstyle}
              onChange={(_, newValue) => {
                objFilter.Name = newValue;
                handleSearch(objFilter);
              }}
            />
            <SearchBox
              placeholder="LLC"
              styles={searchstyle}
              onChange={(_, newValue) => {
                objFilter.LLC = newValue;
                handleSearch(objFilter);
              }}
            />
          </div>

          {isMobile ? (
            <>
              <DefaultButton
                //  text="New"
                // disabled={!isActive}
                iconProps={{ iconName: "Add" }}
                styles={buttonstyle}
                className="header_btn"
                onClick={() => {
                  setIsopen(true);

                  setResponseData({ ..._data });
                  //   setCurrentData([...Datas]);
                  setIsEdit(false);
                }}
              />
              <>
                {select.singleSelect && select.multiSelect == false && (
                  <DefaultButton
                    iconProps={{ iconName: "Edit" }}
                    className="header_btn"
                    // text="Edit"
                    styles={{
                      root: {
                        border: "none",
                      },
                    }}
                    onClick={() => {
                      setIsopen(true);
                      setIsEdit(true);
                      setResponseData({ ...updateData });
                      //   setCurrentData([...updateData]);
                    }}
                  />
                )}

                {(select.singleSelect || select.multiSelect) && (
                  <IconButton
                    // text="Delete"
                    title="Delete"
                    iconProps={{ iconName: "Delete" }}
                    // styles={buttonstyle}
                    styles={{
                      root: {
                        color: "#FF6347",
                      },
                      rootHovered: {
                        color: "#FF6347",
                      },
                    }}
                    onClick={(e: any) => {
                      // deleteData();
                      setSelect({ ...select, isdelete: true });
                      setIsopen(false);
                    }}
                  />
                )}
              </>
            </>
          ) : (
            <>
              <DefaultButton
                text="New"
                // disabled={!isActive}
                iconProps={{ iconName: "Add" }}
                styles={buttonstyle}
                onClick={() => {
                  setIsopen(true);

                  setResponseData({ ..._data });
                  //   setCurrentData([...Datas]);
                  setIsEdit(false);
                }}
              />
              <>
                {select.singleSelect && select.multiSelect == false && (
                  <>
                    {!isCurrUserItem && (
                      <DefaultButton
                        iconProps={{ iconName: "Share" }}
                        text="Transfer"
                        styles={{
                          root: {
                            border: "none",
                          },
                        }}
                        onClick={() => {
                          setResponseData({ ...updateData });
                          SetIsTransferModal(true);
                          console.log(updateData);
                          //   setCurrentData([...updateData]);
                        }}
                      />
                    )}
                    {isCurrUserItem && (
                      <DefaultButton
                        iconProps={{ iconName: "Edit" }}
                        text="Edit"
                        styles={{
                          root: {
                            border: "none",
                          },
                        }}
                        onClick={() => {
                          setIsopen(true);
                          setIsEdit(true);
                          setResponseData({ ...updateData });
                          //   setCurrentData([...updateData]);
                        }}
                      />
                    )}
                  </>
                )}

                {(select.singleSelect || select.multiSelect) && (
                  <IconButton
                    // text="Delete"
                    title="Delete"
                    iconProps={{ iconName: "Delete" }}
                    // styles={buttonstyle}
                    styles={{
                      root: {
                        color: "#FF6347",
                      },
                      rootHovered: {
                        color: "#FF6347",
                      },
                    }}
                    onClick={(e: any) => {
                      // deleteData();
                      setSelect({ ...select, isdelete: true });
                      setIsopen(false);
                    }}
                  />
                )}
              </>
            </>
          )}
        </div>
      </div>

      <div>
        {loader ? (
          <ShimmeredDetailsList
            setKey="items"
            items={[]}
            columns={col}
            enableShimmer={true}
            // shimmerLines={10}
          />
        ) : (
          <DetailsList
            items={page}
            columns={col}
            selection={itemSelection}
            selectionMode={SelectionMode.multiple}
            // onItemInvoked={handleSelection}
            onShouldVirtualize={() => {
              return false;
            }}
            onRenderRow={(props, defaultRender) => (
              <div className="red">
                {defaultRender({
                  ...props,
                  styles: {
                    root: {
                      background:
                        props.item?.PeopleEmail?.toLowerCase() !=
                        currentUserInfo.UserPrincipalName.toLocaleLowerCase()
                          ? "#f7f7f7"
                          : "#ffffff",
                    },
                  },
                })}
              </div>
            )}
          />
        )}
      </div>

      {!loader && page.length > 0 ? (
        <p>
          Showing{" "}
          <b style={{ fontSize: "12px" }}>
            {`${paginateNumber[0] + 1}`}-{" "}
            {`${
              paginateNumber[1] >= masterData.length
                ? masterData.length
                : paginateNumber[1]
            }`}
          </b>{" "}
          of <b style={{ fontSize: "12px" }}>{`${masterData.length}`}</b>{" "}
          entries.
        </p>
      ) : (
        <Label
          styles={{
            root: {
              fontSize: "16px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "50px 0px",
            },
          }}
        >
          No Data Found
        </Label>
      )}
      {!loader && page.length > 0 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={
            masterData.length > 0 ? Math.ceil(masterData.length / 30) : 1
          }
          onChange={(page) => {
            paginate(page, masterData);
          }}
          // style={{ margin: "auto" }}
        />
      ) : (
        <></>
      )}

      {/* panel */}
      <Panel isOpen={isopen}>
        <div>
          <div
            style={{
              // borderBottom: "1px solid gray",
              padding: "5px 0px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: "bolder", margin: 0 }}>
              {/* {!isEdit ? "Add new record" : "Update the record"} */}
              Add New
            </h3>
            <IconButton
              iconProps={{ iconName: "cancel" }}
              title="Close"
              onClick={() => {
                setIsopen(false);
                setError({
                  InvestorName: "",

                  Email: "",
                  Phone: "",
                });
              }}
            />
          </div>
          <div style={{ margin: "10px 0px 15px 0px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Icon iconName="TextField" style={{ marginRight: "10px" }} />

              <Label required styles={labelstyle}>
                Investor Name
              </Label>
            </div>

            <TextField
              styles={textStyle}
              placeholder="Enter the value here"
              value={responseData.InvestorName ? responseData.InvestorName : ""}
              //   // id="Email"
              //   // name="Email"
              errorMessage={error.InvestorName ? error.InvestorName : ""}
              onChange={(e, val) => {
                onChangeValues("InvestorName", val);
              }}
            />
            {/* //lastchange */}
          </div>
          {/* field2 */}
          <div style={{ margin: "10px 0px 15px 0px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Icon iconName="TextField" style={{ marginRight: "10px" }} />

              <Label styles={labelstyle}>LLC</Label>
            </div>

            <TextField
              styles={textStyle}
              placeholder="Enter the value here"
              value={responseData.LLC}
              onChange={(e, val) => {
                onChangeValues("LLC", val);
              }}
            />
            {/* //lastchange */}
          </div>
          {/* field3 */}
          <div style={{ margin: "10px 0px 15px 0px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Icon iconName="TextField" style={{ marginRight: "10px" }} />

              <Label styles={labelstyle}>Phone #</Label>
            </div>

            <TextField
              styles={textStyle}
              placeholder="Enter the value here"
              value={responseData != null && responseData.Phone}
              errorMessage={error.Phone ? error.Phone : ""}
              onChange={(e, val) => {
                onChangeValues("Phone", val);
              }}
            />
            {/* //lastchange */}
          </div>
          {/* field4 */}
          <div style={{ margin: "10px 0px 15px 0px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Icon iconName="TextField" style={{ marginRight: "10px" }} />

              <Label styles={labelstyle}>Email </Label>
            </div>

            <TextField
              styles={textStyle}
              placeholder="Enter the value here"
              value={responseData.Email}
              //   // id="Email"
              //   // name="Email"
              errorMessage={error.Email ? error.Email : ""}
              onChange={(e, val: any) => {
                onChangeValues("Email", val);
              }}
            />
            {/* //lastchange */}
          </div>
          {/* field5 */}
          <div style={{ margin: "10px 0px 15px 0px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Icon iconName="KaizalaLogo" style={{ marginRight: "10px" }} />
              <Label styles={labelstyle}>Purchase Price Range</Label>
            </div>

            <Dropdown
              placeholder="Select an option"
              selectedKeys={responseData.PurchasePriceRange}
              multiSelect
              options={optPurchaseRange}
              onChange={(e, item: IDropdownOption | IDropdownOption[]) => {
                DropdownChange("PurchasePriceRange", item);
              }}
            />
          </div>
          {/* investor strategy */}

          <div style={{ margin: "10px 0px 15px 0px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Icon iconName="KaizalaLogo" style={{ marginRight: "10px" }} />
              <Label styles={labelstyle}>Investor Strategy</Label>
            </div>

            <Dropdown
              placeholder="Select an option"
              // label="Technologies"
              selectedKeys={responseData.InvestorStrategy}
              multiSelect
              //   defaultSelectedKey={responseData.InvestorStrategy}
              options={optInvStrategy}
              onChange={(e, item: IDropdownOption | IDropdownOption[]) => {
                DropdownChange("InvestorStrategy", item);
              }}
            />
          </div>

          <div style={{ margin: "10px 0px 15px 0px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Icon iconName="KaizalaLogo" style={{ marginRight: "10px" }} />
              <Label styles={labelstyle}>Areas</Label>
            </div>

            <Dropdown
              placeholder="Select an option"
              // defaultSelectedKey={value.Whereat}
              selectedKeys={responseData.Areas}
              options={optAreas}
              multiSelect
              onChange={(e, item: IDropdownOption | IDropdownOption[]) => {
                DropdownChange("Areas", item);
              }}
            />
          </div>
          {/* field6 */}
          <div style={{ margin: "10px 0px 15px 0px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Icon iconName="TextField" style={{ marginRight: "10px" }} />

              <Label styles={labelstyle}>Notes </Label>
            </div>

            <TextField
              styles={textStyle}
              placeholder="Enter the value here"
              multiline
              rows={5}
              value={responseData.Notes}
              //   // id="Email"
              //   // name="Email"
              //   errorMessage={error.Title ? error.Title : ""}
              onChange={(e, val) => {
                onChangeValues("Notes", val);
              }}
            />
            {/* //lastchange */}
          </div>
          {/* field7 */}
          <div style={{ margin: "10px 0px 15px 0px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Icon iconName="Contact" style={{ marginRight: "10px" }} />
              <Label styles={labelstyle}>Assigned To</Label>
            </div>

            <PeoplePicker
              context={props.context}
              personSelectionLimit={1}
              groupName={""}
              showtooltip={true}
              // required={true}
              ensureUser={true}
              placeholder="Enter a name or email address"
              // showHiddenInUI={false}
              showHiddenInUI={true}
              principalTypes={[PrincipalType.User]}
              defaultSelectedUsers={
                responseData.PeopleEmail ? [responseData.PeopleEmail] : []
              }
              // defaultSelectedUsers={["Chandru@palmcactus.com"]}
              resolveDelay={1000}
              onChange={(items: any[]) => {
                if (items.length > 0) {
                  const selectedItem = items[0];
                  onChangeValues("AssignedTo", selectedItem.id);
                  // getonChange("PeopleEmail", selectedItem.secondaryText);
                } else {
                  // No selection, pass null or handle as needed
                  onChangeValues("AssignedTo", null);
                }
              }}
            />
          </div>
          {/* field8 */}

          {/* url */}
          <div style={{ margin: "10px 0px 15px 0px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Icon iconName="TextField" style={{ marginRight: "10px" }} />

              <Label styles={labelstyle}>DisclosureUrl</Label>
            </div>

            <TextField
              styles={textStyle}
              placeholder="Enter  a URL"
              value={responseData.Url}
              onChange={(e, val) => {
                onChangeValues("Url", val);
              }}
            />
            <br />
            <TextField
              styles={textStyle}
              placeholder="Alternative Text"
              value={responseData.Text}
              onChange={(e, val) => {
                onChangeValues("Text", val);
              }}
            />
            {/* //lastchange */}
          </div>

          {/* <div style={{ margin: "10px 0px 15px 0px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Icon iconName="TextField" style={{ marginRight: "10px" }} />

              <Label styles={labelstyle}>ContactID</Label>
            </div>

            <TextField
              styles={textStyle}
              placeholder="Enter the value here"
              value={responseData.ContactID}
              onChange={(e, val) => {
                onChangeValues("ContactID", val);
              }}
            />
            
          </div> 
          <div style={{ margin: "10px 0px 15px 0px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Icon iconName="TextField" style={{ marginRight: "10px" }} />

              <Label styles={labelstyle}> FileID</Label>
            </div>

            <TextField
              styles={textStyle}
              placeholder="Enter the value here"
              value={responseData.FileID}
              onChange={(e, val) => {
                onChangeValues("FileID", val);
              }}
            />
          
          </div> */}

          {/* field9 */}

          <div style={{ margin: "10px 0px 15px 0px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Icon iconName="Attach" style={{ marginRight: "10px" }} />
              <Label styles={labelstyle}>Disclosure</Label>
            </div>
            {responseData.attachments.length > 0 &&
              responseData.attachments.map((val, index) => {
                if (val.isDelete == false) {
                  return (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Label>{val.fileName}</Label>
                      <IconButton
                        iconProps={{ iconName: "cancel" }}
                        onClick={() => calcelAttach(index)}
                      />
                    </div>
                  );
                }
              })}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "5px",
                border: "1px solid #cccc",
                background: "##faf8f9",
              }}
            >
              <input
                type="file"
                id="att"
                style={{ display: "none" }}
                // onChange={getFile}
                onChange={(e: any) => {
                  e.preventDefault();
                  getFile(e);
                }}
                multiple
              />
              <Label
                htmlFor="att"
                styles={{
                  root: {
                    fontSize: "14px",
                    cursor: "pointer",
                    selectors: {
                      ":hover": {
                        textDecoration: "underline",
                      },
                    },
                  },
                }}
              >
                Click here to add attachments
              </Label>
            </div>
          </div>
          {/* field10 */}

          <div style={{ marginTop: "25px", display: "flex" }}>
            <PrimaryButton
              onClick={() => {
                isEdit ? UpdateItem() : addItem();
              }}
              disabled={
                !responseData.InvestorName.trim() ||
                error.InvestorName ||
                error.Email ||
                error.Phone
                  ? true
                  : false
              }
              text={isEdit ? "Update" : "Save"}
              styles={{
                root: {
                  borderRadius: "4px",
                  backgroundColor: "#02767a",
                  color: "#fff",
                  marginRight: "15px",
                },
                rootHovered: {
                  backgroundColor: "#02767a",
                  color: "#fff",
                },
              }}
              //   styles={buttonstyle}
            />
            <DefaultButton
              onClick={() => {
                setIsopen(false);
                setError({
                  InvestorName: "",

                  Email: "",
                  Phone: "",
                });
              }}
              text="Cancel"
              styles={{
                root: {
                  borderRadius: "4px",
                },
              }}
            />
          </div>
        </div>
      </Panel>

      <Modal
        isOpen={select.isdelete}
        // onDismiss={false}
        styles={{
          main: {
            width: "28%",
            // height: 150,
            padding: 20,
          },
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4 style={{ margin: 0 }}>Delete?</h4>
          <IconButton
            iconProps={{ iconName: "cancel" }}
            onClick={() => setSelect({ ...select, isdelete: false })}
          />
        </div>
        <p
          style={{
            marginTop: "20px",
            fontSize: "14px",
            // textAlign: "center",
            color: "rgb(96, 94, 92)",
          }}
        >
          Are you sure want to delete?
        </p>
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "end",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <PrimaryButton
            text="Delete"
            onClick={() => {
              deleteData();
            }}
            styles={{
              root: {
                color: "white",
                width: 90,
                height: 30,
                padding: "5px 10px",
              },
            }}
          />
          <DefaultButton
            text="Cancel"
            onClick={() => {
              //   setIsdelete(false);
              setSelect({ ...select, isdelete: false });
            }}
            styles={{
              root: {
                // backgroundColor: "red",
                color: "#000",
                width: 90,
                height: 30,
                padding: "5px 10px",
              },
            }}
          />
        </div>
      </Modal>

      <div
        className={`filter_container ${
          hamburgerActive ? "active_filter_container" : ""
        }`}
      >
        <div className={`filter_wraper`}>
          <div className="filter_wraper_inner">
            {/* <Label>Orginally inputted :</Label> */}
            {/* <div> */}
            <Label>Filter by</Label>

            {/* </div> */}

            <SearchBox
              placeholder="Assigned To"
              className="textField_box"
              styles={searchstyle}
              value={filterValue.User}
              onChange={(_, userValue) =>
                setFilterValue({ ...filterValue, User: userValue })
              }
            />
            <SearchBox
              placeholder="Investor Name"
              className="textField_box"
              styles={searchstyle}
              value={filterValue.Name}
              onChange={(_, userValue) =>
                setFilterValue({ ...filterValue, Name: userValue })
              }
            />

            <SearchBox
              placeholder="LLC"
              className="textField_box"
              styles={searchstyle}
              value={filterValue.LLC}
              onChange={(_, userValue) =>
                setFilterValue({ ...filterValue, LLC: userValue })
              }
            />

            <PrimaryButton
              text="Apply"
              className="btn_filter"
              onClick={() => {
                handleSearch(filterValue);
                setHamburgerActive(!hamburgerActive);
              }}
              styles={{
                root: {
                  borderRadius: "4px",
                  backgroundColor: "#7a7574",
                  color: "#fff",
                },
                rootHovered: {
                  backgroundColor: "#7a7574",
                  color: "#fff",
                },
              }}
            />
            <DefaultButton
              text="Clear"
              className="btn_filter"
              onClick={() => {
                setHamburgerActive(!hamburgerActive);
                handleSearch({
                  Name: "",
                  LLC: "",
                  User: "",
                });
                setFilterValue({
                  Name: "",
                  LLC: "",
                  User: "",
                });
              }}
              styles={{
                root: {
                  borderRadius: "4px",
                },
              }}
            />
          </div>
        </div>
      </div>
      <div
        className="filter_icon"
        onClick={() => setHamburgerActive(!hamburgerActive)}
      >
        <img src={img} width="20px" height="20px" />
      </div>
    </div>
  );
};
export default DisclosedDetail;
