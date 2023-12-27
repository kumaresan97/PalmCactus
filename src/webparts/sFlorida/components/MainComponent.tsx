import * as React from "react";
import { useEffect, useState } from "react";
import { Item, sp } from "@pnp/sp/presets/all";
import { Checkbox, FontWeights, Label } from "@fluentui/react";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { Icon } from "@fluentui/react/lib/Icon";
import { ShimmeredDetailsList } from "@fluentui/react/lib/ShimmeredDetailsList";

import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { SearchBox, ISearchBoxStyles } from "@fluentui/react/lib/SearchBox";
import { DetailsList, Selection, SelectionMode, Modal } from "@fluentui/react";
import { Panel } from "@fluentui/react/lib/Panel";
import { CommandBarButton, IconButton } from "@fluentui/react/lib/Button";
import { ITextFieldStyles, TextField } from "@fluentui/react/lib/TextField";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import classes from "./SFlorida.module.scss";
import "./style.css";
import Pagination from "office-ui-fabric-react-pagination";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import * as moment from "moment";
import styles from "./SFlorida.module.scss";

let DataArray: any[] = [];
let arrSecondary: any[] = [];
let isActive = false;
let Hamburger_img: string = require("../assets/filter-filled-tool-symbol.png");
// let listName = "S Florida Properties";
// search
let listName = "S Florida Dev";
interface Data {
  selected?: boolean;
  Title: string;
  Created: any;
  PropertyAddress: string;
  Whereat: string;
  AssignedTo: any;
  Status: string;
  Price: string;
  ARV: string;
  Offer: string;
  FinancingType: string;
  AgentName: string;
  OffMarket: boolean;
  Sold4: string;
  OfferContract: string;
  AgentNumber: string;
  Email: string;
  Name?: string;
  Notes: string;
  Modified: any;
  PeopleEmail: string;
  ID: any;
  assignId: number;
  attachments?: any[];
}
let attachFiles: any[] = [];
let files: any[] = [];
let totalPage: number = 30;
let currentPage = 1;
let objFilter = {
  user: "",
  property: "",
  mls: "",
  sort: "newerToOlder",
};
let objSelectedProperty: any;
const MainComponent = (props) => {
  const [masterData, setmasterdata] = useState<Data[]>([]);
  const [duplicate, setDuplicate] = useState<Data[]>([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState({
    Mls: "",
    Title: "",
    Price: "",
    Email: "",
    ARV: "",
    Offer: "",
    Sold4: "",
    OfferContract: "",
  });
  const [select, setSelect] = useState(false);
  const [hamburgerActive, setHamburgerActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [attachment, setAttachment] = useState([]);
  const [selectedSortingOption, setSelectedSortingOption] =
    useState("newerToOlder");

  const [isPane, setIsPane] = useState<boolean>(false);
  const [paginateNumber, setPaginateNumber] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [Id, setId] = useState();
  const [multiSelect, setMultiSelect] = useState(false);
  const [multiSlectedId, setMultiSlectedId] = useState([]);
  const [isdelete, setIsdelete] = useState(false);
  // this is for mobile responsive model box
  const [filterValue, setFilterValue] = useState({
    user: "",
    property: "",
    mls: "",
    sort: "newerToOlder",
  });
  // const [search,setSearch] = useState({
  //   name:"",
  //   email:"",
  //   PropertyAdd:""
  // });

  // const [crntPage, setCrntPage] = useState(1);
  const [rows, setrows] = useState(masterData);

  const [value, setvalue] = useState<Data>({
    Title: "",
    Created: null,
    PropertyAddress: "",
    Whereat: "",
    AssignedTo: null,
    Status: "",
    Price: "",
    ARV: "",
    Offer: "",
    FinancingType: "",
    AgentName: "",
    OffMarket: true,
    Sold4: "",
    OfferContract: "",
    AgentNumber: "",
    Email: "",
    Name: "",
    Notes: "",
    Modified: null,
    PeopleEmail: "",
    ID: null,
    assignId: null,
    attachments: [],
  });
  const [editdata, setEditdata] = useState<Data>({
    Title: "",
    Created: null,
    PropertyAddress: "",
    Whereat: "",
    AssignedTo: null,
    Status: "",
    Price: "",
    ARV: "",
    Offer: "",
    FinancingType: "",
    AgentName: "",
    OffMarket: false,
    Sold4: "",
    OfferContract: "",
    AgentNumber: "",
    Email: "",
    Notes: "",
    Modified: null,
    PeopleEmail: "",
    ID: null,
    assignId: null,
  });
  // const [reRender, SetReRender] = useState(true);
  const searchstyle = {
    root: {
      width: 160,
    },
  };
  const buttonstyle = {
    root: {
      background: "#7a7574",
      color: "#fff",
      border: "1px solid #7a7574",
    },
    rootHovered: {
      backgroundColor: "#7a7574",
      color: "#fff",
    },
  };
  const columns = [
    {
      key: "Title",
      name: "MLS No./Off Market",
      fieldName: "Title",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "Originally Inputted",
      name: "Originally Inputted",
      fieldName: "Created",
      minWidth: 130,
      maxWidth: 200,
      isResizable: true,
      onRender: (Item: any) => {
        return moment(Item.Created).format("ll");
      },
    },
    {
      key: "Property Address",
      name: "Property Address",
      fieldName: "PropertyAddress",
      minWidth: 120,
      maxWidth: 150,
      isResizable: true,
      onRender: (Item: any) => {
        return (
          <div title={`${Item.PropertyAddress}`}>
            <p className="text_ellipsis">{Item.PropertyAddress}</p>
          </div>
        );
      },
    },
    {
      key: "Source",
      name: "Source",
      fieldName: "Whereat",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "Assigned To",
      name: "Assigned To",
      fieldName: "AssignedTo",
      minWidth: 120,
      maxWidth: 200,
      isResizable: true,
      onRender: (Item: any) => {
        return (
          <div title={`${Item.AssignedTo}`}>
            <p className="text_ellipsis">{Item.AssignedTo}</p>
          </div>
        );
      },
    },
    {
      key: "Status",
      name: "Status",
      fieldName: "Status",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "Price",
      name: "Price",
      fieldName: "Price",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return item.Price ? `$${item.Price.toLocaleString("en-US")}` : "";
      },
    },
    {
      key: "ARV",
      name: "ARV",
      fieldName: "ARV",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return item.ARV ? `$${item.ARV.toLocaleString("en-US")}` : "";
      },
    },
    {
      key: "Offer",
      name: "Offer ",
      fieldName: "Offer",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return item.Offer ? `$${item.Offer.toLocaleString("en-US")}` : "";
      },
    },
    {
      key: "Buy Price",
      name: "Buy Price",
      fieldName: "OfferContract",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return item.OfferContract
          ? `$${item.OfferContract.toLocaleString("en-US")}`
          : "";
      },
    },
    {
      key: "Sold Price ",
      name: "Sold Price",
      fieldName: "Sold4",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return item.Sold4 ? `$${item.Sold4.toLocaleString("en-US")}` : "";
      },
    },
    {
      key: "Agent Name ",
      name: "Agent Name ",
      fieldName: "AgentName",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "Agent Number",
      name: "Agent Number",
      fieldName: "AgentNumber",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "Email",
      name: "Agent Email",
      fieldName: "Email",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (Item: any) => {
        return (
          <div title={`${Item.Email}`}>
            <p className="text_ellipsis">{Item.Email}</p>
          </div>
        );
      },
    },
    {
      key: "OffMarket",
      name: "Off Market",
      fieldName: "OffMarket",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (Item: any) => {
        return Item.OffMarket == true ? "Yes" : "No";
      },
    },
    {
      key: "Notes",
      name: "Notes",
      fieldName: "Notes",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (Item: any) => {
        return (
          <div title={`${Item.Notes}`}>
            <p className="text_ellipsis">{Item.Notes}</p>
          </div>
        );
      },
    },
    {
      key: "FinancingType",
      name: "Financing Type",
      fieldName: "FinancingType",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "attachments",
      name: "Offer Contract",
      fieldName: "attachments",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return (
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
        );
      },
    },

    {
      key: "column18",
      name: "Last Updated",
      fieldName: "Modified",
      minWidth: 130,
      maxWidth: 150,
      isResizable: true,
      onRender: (Item: any) => {
        return moment(Item.Created).format("ll");
      },
    },
  ];

  const modalheader = {
    root: {
      padding: "10px 5px",
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

  //Trestle API fetch
  const handlerApiFetch = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("client_id", "89994d04_f548_4c52_98d0_39cd691a037c");
    urlencoded.append("client_secret", "722b13623c6843899e72e883be10a64d");
    urlencoded.append("scope", "api");
    urlencoded.append("grant_type", "client_credentials");

    //  Get Access Token and passing it to get all the values
    fetch("https://api-prod.corelogic.com/trestle/oidc/connect/token", {
      // Replace with the correct token endpoint URL
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the response as JSON
      })
      .then((result) => {
        console.log(result); // The access token will be in result.access_token
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${result.access_token}`);
        // To Get All the Items from Trestle
        fetch(
          `https://api-prod.corelogic.com/trestle/odata/Property?$top=1000&$skip=0`,
          {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          }
        )
          .then((response) => response.json())
          .then((result) => {
            console.log(result.value);
          })
          .catch((error) => console.log("error", error));
        // To get selected
        fetch(
          `https://api-prod.corelogic.com/trestle/odata/Property?$filter=ListingId eq '${value.Title}'`,
          {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          }
        )
          .then((response) => response.json())
          .then((result) => {
            let FormData = { ...value };
            objSelectedProperty = result.value[0];
            if (result.value.length == 0) {
              window.alert("Please enter valid MLS number");
              console.log(objSelectedProperty);
              FormData.PropertyAddress = "";
              FormData.Status = "";
              FormData.Price = "";
              FormData.AgentName = "";
              FormData.AgentNumber = "";
              FormData.PeopleEmail = "";
              FormData.Sold4 = "";
              console.log(FormData);
              setvalue({ ...FormData });
            } else {
              console.log(objSelectedProperty);
              FormData.PropertyAddress = objSelectedProperty.UnparsedAddress;
              FormData.Status = objSelectedProperty.MlsStatus;
              FormData.Price = objSelectedProperty.ListPrice;
              FormData.AgentName = objSelectedProperty.ListAgentFullName;
              FormData.AgentNumber = objSelectedProperty.ListAgentDirectPhone;
              FormData.Email = objSelectedProperty.ListAgentEmail;
              FormData.Sold4 =
                objSelectedProperty.MlsStatus == "Closed"
                  ? objSelectedProperty.ClosePrice
                  : "";
              console.log(FormData);
              setvalue({ ...FormData });
            }
          })
          .catch((error) => console.log("error", error));
      })
      .catch((error) => console.log("error", error));
  };
  //sortFunction

  const sortFunction = (value) => {
    const sortedData = arrSecondary.slice().sort((a: any, b: any) => {
      const dateA = new Date(a.Created).getTime();
      const dateB = new Date(b.Created).getTime();
      if (!isNaN(dateA) && !isNaN(dateB)) {
        if (value === "newerToOlder") {
          return dateB - dateA;
        } else {
          return dateA - dateB;
        }
      }
    });
    setDuplicate([...sortedData]);
    let tempArr = sortedData;
    paginate(currentPage, [...tempArr]);
  };

  const selection = new Selection({
    onSelectionChanged: () => {
      const selectedItem: any[] = selection.getSelection();
      if (selectedItem.length > 0) {
        if (selectedItem.length == 1) {
          setId(selectedItem[0].ID);
          let _selectedItem = {
            Title: selectedItem[0].Title,
            Created: selectedItem[0].Created,
            PropertyAddress: selectedItem[0].PropertyAddress,
            Whereat: selectedItem[0].Whereat,
            AssignedTo: selectedItem[0].AssignedTo,
            Status: selectedItem[0].Status,
            Price: selectedItem[0].Price,
            ARV: selectedItem[0].ARV,
            Offer: selectedItem[0].Offer,
            FinancingType: selectedItem[0].FinancingType,
            AgentName: selectedItem[0].AgentName,
            OffMarket: selectedItem[0].OffMarket,
            Sold4: selectedItem[0].Sold4,
            OfferContract: selectedItem[0].OfferContract,
            AgentNumber: selectedItem[0].AgentNumber,
            Email: selectedItem[0].Email,
            Notes: selectedItem[0].Notes,
            Modified: selectedItem[0].Modified,
            PeopleEmail: selectedItem[0].AssignedTo,
            ID: selectedItem[0].ID,
            assignId: selectedItem[0].AssignedToId,
          };
          setEditdata({ ..._selectedItem });
          setSelect(true);
          setMultiSelect(false);
        } else {
          let temp = [];
          selectedItem.map((item) => temp.push(item.ID));
          setMultiSlectedId(temp);
          setMultiSelect(true);
        }
        // setvalue((prevValue) => ({ ...prevValue, selected: true }));
      } else {
        setSelect(false);
        setMultiSelect(false);
        // setvalue((prevValue) => ({ ...prevValue, selected: false }));
      }
      // console.log("Selected item:", value);
    },
  });

  const handleSelection = (selectedItem: any) => {
    // onSelectionChanged: () => {
    //   const selectedItem: any = selection.getSelection()[0];

    if (selectedItem) {
      setId(selectedItem.ID);

      let _selectedItem = {
        Title: selectedItem.Title,
        Created: selectedItem.Created,
        PropertyAddress: selectedItem.PropertyAddress,
        Whereat: selectedItem.Whereat,
        AssignedTo: selectedItem.AssignedTo,
        Status: selectedItem.Status,
        Price: selectedItem.Price,
        ARV: selectedItem.ARV,
        Offer: selectedItem.Offer,
        FinancingType: selectedItem.FinancingType,
        AgentName: selectedItem.AgentName,
        OffMarket: selectedItem.OffMarket,
        Sold4: selectedItem.Sold4,
        OfferContract: selectedItem.OfferContract,
        AgentNumber: selectedItem.AgentNumber,
        Email: selectedItem.Email,
        Notes: selectedItem.Notes,
        Modified: selectedItem.Modified,
        PeopleEmail: selectedItem.AssignedTo,
        ID: selectedItem.ID,
        assignId: selectedItem.AssignedToId,
      };
      // setEditdata({ ..._selectedItem });
      setvalue({ ..._selectedItem });
      setIsPane(true);
      setSelect(true);
      setIsEdit(true);
      GetAddachment();

      // setvalue((prevValue) => ({ ...prevValue, selected: true }));
    } else {
      setSelect(false);
      // setvalue((prevValue) => ({ ...prevValue, selected: false }));
    }

    // console.log("Selected item:", value);
    // },
  };
  function paginate(pagenumber: number, Data) {
    let allItems = Data;
    var lastIndex = pagenumber * totalPage;
    var firstIndex = lastIndex - totalPage;
    var paginatedItems = allItems.slice(firstIndex, lastIndex);
    // setCrntPage(pagenumber);
    currentPage = pagenumber;
    setrows(paginatedItems);
    setPaginateNumber([firstIndex, lastIndex]);
  }

  const getonChange = (key, _value) => {
    let FormData = { ...value };
    let newErrors = { ...error };
    FormData[key] = _value;

    if (
      key === "Price" ||
      key === "ARV" ||
      key === "Sold4" ||
      key === "Offer" ||
      key === "OfferContract"
    ) {
      // if (!/^\d*$/.test(_value)) {
      if (!/^-?\d*\.?\d*$/.test(_value)) {
        newErrors[key] = "Please enter a Number";
      } else {
        newErrors[key] = null;
      }
    }

    if (key === "Email") {
      if (!/^[^@]+@[^@]+\.[^.]+$/.test(_value)) {
        newErrors[key] = "Enter a valid email address";
      } else {
        newErrors[key] = null;
      }
    }

    if (key === "Title") {
      const trimmedValue = _value.trim();
      if (trimmedValue === "") {
        newErrors[key] = "Title is required";
      } else {
        const titleExists = masterData.some((item) => {
          return (
            item.Title.toLowerCase().trim() === trimmedValue.toLowerCase() &&
            item.ID !== FormData.ID
          );
        });

        if (titleExists) {
          newErrors[key] = "This value already exists";
          newErrors["Mls"] = "This value already exists ";
        } else {
          newErrors[key] = null;
          newErrors["Mls"] = "";
        }
      }
    }

    setError({ ...newErrors });
    setvalue({ ...FormData });
  };

  const getFile = (e: any) => {
    files = e.target.files;
    // document.getElementById("att").focus();

    attachFiles = [...attachment];
    for (let i = 0; i < files.length; i++) {
      attachFiles.push({
        fileName: files[i].name,
        content: files[i],
        isNew: true,
        isDelete: false,
        serverRelativeUrl: "",
        itemId: value.ID,
      });
    }
    setAttachment([...attachFiles]);
    // console.log(attachment, "attach");
  };

  const updatevalue = () => {
    setIsEdit(false);

    setIsPane(false);
    setLoader(true);
    sp.web.lists
      .getByTitle(listName)
      .items.getById(Id)
      .update({
        Title: value.Title.trim(),
        AssignedToId: value.assignId,
        PropertyAddress: value.PropertyAddress,
        Price: parseFloat(value.Price),
        ARV: parseFloat(value.ARV),
        Offer: value.Offer,
        FinancingType: value.FinancingType,
        AgentName: value.AgentName,
        OffMarket: value.OffMarket,
        Sold4: value.Sold4,
        Whereat: value.Whereat,
        OfferContract: value.OfferContract,
        AgentNumber: value.AgentNumber,
        Email: value.Email,
        Notes: value.Notes,
        Status: value.Status,
      })
      .then(async (res) => {
        let todelete = attachment.filter((val) => {
          return val.isNew == false && val.isDelete == true;
        });
        let toadd = attachment.filter((val) => {
          return val.isNew == true && val.isDelete == false;
        });

        if (todelete.length > 0) {
          todelete.forEach((val, i) => {
            sp.web.lists
              .getByTitle(listName)
              .items.getById(Id)
              .attachmentFiles.getByName(val.fileName)
              .delete()
              .then((res) => {
                addDataAfterEdit(toadd, Id);
              })
              .catch((error) => {
                setLoader(false);
              });
          });
        } else {
          addDataAfterEdit(toadd, Id);
        }

        // setIsPane(false);
        // SetReRender(true);
      })
      .catch((err) => {
        setLoader(false);
        // alert(err);
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

        .getByTitle(listName)

        .items.getById(Id)

        .attachmentFiles.addMultiple(newData)
        .then((arr) => {
          getData();
        })
        .catch((err) => {
          setLoader(false);
        });
    } else {
      getData();
      // alert("Updated");
    }
    // alert("Updated");
  }

  const deleteData = () => {
    setLoader(true);
    setIsdelete(false);
    setMultiSelect(false);
    {
      !multiSelect
        ? sp.web.lists
            .getByTitle(listName)
            .items.getById(Id)
            .delete()
            .then((res) => {
              // SetReRender(true);
              getData();
              setMultiSlectedId([]);
              // alert("deleted successfully");
            })
            .catch((err) => {
              // alert(err);
            })
        : multiSlectedId.map((id) => {
            sp.web.lists
              .getByTitle(listName)
              .items.getById(id)
              .delete()
              .then((res) => {
                // SetReRender(true);
                getData();
                setLoader(false);
                // alert("deleted successfully");
              })
              .catch((err) => {
                // alert(err);
              });
          });
    }
  };
  const onSave = async () => {
    setIsEdit(false);
    setIsPane(false);
    setLoader(true);

    if (value.Title == "") {
      setError({ ...error, Title: "Title is required" });
      setIsPane(true);
      return;
    }
    await sp.web.lists
      .getByTitle(listName)
      .items.add({
        Title: value.Title ? value.Title : "",
        AssignedToId: value.assignId !== undefined ? value.assignId : null,

        // Created: value.Created?value.Created:,
        PropertyAddress: value.PropertyAddress ? value.PropertyAddress : "",
        Whereat: value.Whereat ? value.Whereat : "",
        OfferContract: value.OfferContract ? value.OfferContract : "",

        Status: value.Status ? value.Status : "",
        // Price: value.Price !== undefined ? parseFloat(value.Price) : 0,
        Price:
          value.Price !== undefined
            ? Math.floor(parseFloat(value.Price) * 1000) / 1000
            : 0,
        ARV:
          value.ARV !== undefined
            ? Math.floor(parseFloat(value.ARV) * 1000) / 1000
            : 0,
        // ARV: value.ARV !== undefined ? parseFloat(value.ARV) : 0,
        Offer:
          value.Offer !== undefined
            ? parseFloat(value.Offer.replace(/[^0-9.-]+/g, ""))
            : 0,
        FinancingType: value.FinancingType,
        AgentName: value.AgentName ? value.AgentName : "",
        OffMarket: value.OffMarket ? value.OffMarket : false,
        Sold4:
          value.Sold4 !== undefined
            ? parseFloat(value.Sold4.toString().replace(/[^0-9.-]+/g, ""))
            : 0, // OfferContract: value.OfferContract,
        AgentNumber: value.AgentNumber ? value.AgentNumber : "",
        Email: value.Email ? value.Email : "",
        Notes: value.Notes ? value.Notes : "",

        // Modified: value.Modified,
        // PeopleEmail: value.PeopleEmail,
      })
      .then(async (res) => {
        let x = attachment.filter((a) => {
          return a.isDelete != true;
        });
        let countNew = 0;
        for (let i = 0; i < x.length; i++) {
          await sp.web.lists
            .getByTitle(listName)
            .items.getById(res.data.Id)
            .attachmentFiles.add(x[i].fileName, x[i].content)
            .then(async (res) => {
              countNew = countNew + 1;
              if (countNew >= x.length) {
                await getData();

                // SetReRender(true);
              }
              // setIsPane(false);
            })
            .catch((err) => {
              console.log(err);
            });
        }

        // sp.web.lists
        //   .getByTitle(listName)
        //   .items.getById(res.data.Id)
        //   .attachmentFiles.addMultiple(
        //     x.map((val) => {
        //       return {
        //         name: val.fileName,
        //         content: val.content,
        //       };
        //     })
        //   )
        //   .then((res) => {
        //     console.log("success");
        //     console.log(res, "res");
        //     setAttachment([]);
        //     alert("Created")
        //     // getData()
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });

        value.ARV = "";
        value.AgentName = "";
        value.AgentNumber = "";
        value.AssignedTo = null;
        value.Email = "";
        value.Notes = "";
        value.Title = "";
        value.OffMarket = false;
        value.Price = "";
        value.Sold4 = "";
        value.Offer = "";
        value.PropertyAddress = "";
        value.Whereat = "";
        value.Status = "";
        setvalue({ ...value });
        // setIsPane(false);
        getData();
        setLoader(false);
        // SetReRender(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getData = async () => {
    await sp.web.lists
      .getByTitle(listName)
      .items.select("*, AssignedTo/EMail,AssignedTo/Title,AttachmentFiles")
      .expand("AssignedTo", "AttachmentFiles")
      .top(5000)
      .orderBy("Created", false)
      .get()
      .then(async (res: any) => {
        DataArray = [];
        res.forEach((li) => {
          let arrGetAttach = [];
          li.AttachmentFiles.forEach((val) => {
            arrGetAttach.push({
              fileName: val.FileName,
              content: null,
              isNew: false,
              isDelete: false,
              serverRelativeUrl: val.ServerRelativeUrl,
              itemId: value.ID,
            });
          });
          DataArray.push({
            Title: li.Title ? li.Title : "",
            // Created: res[i].Created,
            PropertyAddress: li.PropertyAddress ? li.PropertyAddress : "",
            Whereat: li.Whereat,
            AssignedTo: li.AssignedTo ? li.AssignedTo.EMail : "",
            Created: li.Created,
            Status: li.Status,
            Price: li.Price,
            ARV: li.ARV,
            Offer: li.Offer,
            AgentName: li.AgentName,
            OffMarket: li.OffMarket,
            Sold4: li.Sold4,
            OfferContract: li.OfferContract,
            AgentNumber: li.AgentNumber,
            FinancingType: li.FinancingType,
            Email: li.Email,
            Name: li.AssignedTo?.Title ? li.AssignedTo?.Title : "",
            Notes: li.Notes,
            Modified: li.Modified,
            ID: li.ID,
            PeopleEmail: li.AssignedTo ? li.AssignedTo.EMail : "",
            assignId: li.AssignedToId ? li.AssignedToId : null,
            attachments: arrGetAttach,
          });
        });
        arrSecondary = [...DataArray];
        setmasterdata([...DataArray]);
        setDuplicate([...DataArray]);
        paginate(1, [...DataArray]);
        setLoader(false);
        isActive = true;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const GetAddachment = () => {
    let getattach = [];
    let objSectedData = masterData.filter((li) => li.ID == editdata.ID)[0];
    objSectedData.attachments.forEach((val) => {
      getattach.push({
        fileName: val.fileName,
        content: null,
        isNew: false,
        isDelete: false,
        serverRelativeUrl: val.ServerRelativeUrl,
        itemId: value.ID,
      });
    });
    setAttachment([...getattach]);
  };
  const calcelAttach = (index) => {
    let temp = [...attachment];
    if (temp[index].isNew) {
      temp.splice(index, 1);
    } else {
      temp[index].isDelete = true;
    }
    setAttachment([...temp]);
  };

  const handleSearch = (val) => {
    paginate(1, duplicate);
    let filteredResults = masterData.filter((item) =>
      val.property != ""
        ? item.PropertyAddress.toLowerCase().includes(
            val.property.trim().toLowerCase()
          )
        : item
    );
    filteredResults = filteredResults.filter((li) =>
      val.user.trim() != ""
        ? li.Name.toLowerCase().includes(val.user.trim().toLowerCase()) ||
          li.PeopleEmail.toLowerCase().includes(val.user.trim().toLowerCase())
        : li
    );
    filteredResults = filteredResults.filter((li) =>
      val.mls.trim() != ""
        ? li.Title.toLowerCase().includes(val.mls.trim().toLowerCase())
        : li
    );
    arrSecondary = filteredResults;
    console.log(filteredResults);
    // setPaginateNumber([paginateNumber[0],filteredResults])
    setDuplicate([...filteredResults]);
    sortFunction(val.sort);
  };

  // mobile Responsive Change
  const handleResponsiveChange = () => {
    setIsMobile(window.innerWidth <= 768);
  };
  useEffect(() => {
    setLoader(true);
    getData();

    // mobile Responsive Change
    handleResponsiveChange();
    window.addEventListener("resize", handleResponsiveChange);
    return () => {
      window.removeEventListener("resize", handleResponsiveChange);
    };
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
          }}
        >
          {!isMobile ? (
            <>
              <Label
                styles={{
                  root: {
                    fontSize: "16px",
                    FontWeights: "700",
                    padding: 0,
                  },
                }}
              >
                S Florida Properties
              </Label>
              {/* <Icon iconName="FavoriteStar" /> */}
            </>
          ) : (
            <></>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "20px 0",
            margin: "0 0 0 auto",
          }}
        >
          <div className="header_filter_wraper">
            {/* <div style={{ display: "flex", alignItems: "center", gap: "10px" }}> */}
            {/* <Label>Orginally inputted :</Label> */}
            <Dropdown
              styles={{
                root: {
                  width: 160,
                },
              }}
              defaultSelectedKey={selectedSortingOption}
              options={[
                { key: "newerToOlder", text: "Newer to Older" },
                { key: "olderToNewer", text: "Older to Newer" },
              ]}
              onChange={(e, val) => {
                setSelectedSortingOption(val.key as string);
                objFilter.sort = val.key as string;
                handleSearch(objFilter);
              }}
            />
            {/* </div> */}
            <SearchBox
              placeholder="Search Assigned To"
              styles={searchstyle}
              onChange={(_, newValue) => {
                objFilter.user = newValue;
                handleSearch(objFilter);
              }}
              // onClick={() => {
              //   handleSearch(objFilter);
              // }}
            />

            <SearchBox
              placeholder="Search Property Address"
              styles={searchstyle}
              onChange={(_, newValue) => {
                objFilter.property = newValue;
                handleSearch(objFilter);
              }}
              // onClick={() => {
              //   handleSearch(objFilter);
              // }}
              // onSearch={(val) => {}}
            />
            <SearchBox
              // MLS No./Off Market
              placeholder="Search MLS No"
              styles={searchstyle}
              onChange={(_, newValue) => {
                objFilter.mls = newValue;
                handleSearch(objFilter);
              }}
              // onClick={() => {
              //   handleSearch(objFilter);
              // }}
            />
          </div>
          {isMobile ? (
            <>
              <DefaultButton
                // disabled={!isActive}
                iconProps={{ iconName: "Add" }}
                styles={buttonstyle}
                className="header_btn"
                onClick={() => {
                  setIsPane(true);
                  let tempObj: Data = {
                    Title: "",
                    Created: null,
                    PropertyAddress: "",
                    Whereat: "",
                    AssignedTo: null,
                    Status: "",
                    Price: "",
                    ARV: "",
                    Offer: "",
                    FinancingType: "",
                    AgentName: "",
                    OffMarket: true,
                    Sold4: "",
                    OfferContract: "",
                    AgentNumber: "",
                    Email: "",
                    Notes: "",
                    Modified: null,
                    PeopleEmail: "",
                    ID: null,
                    assignId: null,
                  };
                  setvalue(tempObj);
                  setAttachment([]);
                  setIsEdit(false);
                  // setSelect(false);
                  // setvalue({ ...value });
                }}
              />
              {select && (
                <>
                  {!multiSelect && (
                    <DefaultButton
                      iconProps={{ iconName: "Edit" }}
                      className="header_btn"
                      // styles={buttonstyle}

                      styles={{
                        root: {
                          border: "none", // Remove the border
                        },
                      }}
                      onClick={(e: any) => {
                        setIsEdit(true);

                        setIsPane(true);
                        setvalue({ ...editdata });
                        GetAddachment();
                      }}
                    />
                  )}

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
                      setIsdelete(true);
                      setIsPane(false);
                    }}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <DefaultButton
                text="New"
                // disabled={!isActive}
                iconProps={{ iconName: "Add" }}
                styles={buttonstyle}
                onClick={() => {
                  setIsPane(true);
                  let tempObj: Data = {
                    Title: "",
                    Created: null,
                    PropertyAddress: "",
                    Whereat: "",
                    AssignedTo: null,
                    Status: "",
                    Price: "",
                    ARV: "",
                    Offer: "",
                    FinancingType: "",
                    AgentName: "",
                    OffMarket: true,
                    Sold4: "",
                    OfferContract: "",
                    AgentNumber: "",
                    Email: "",
                    Notes: "",
                    Modified: null,
                    PeopleEmail: "",
                    ID: null,
                    assignId: null,
                  };
                  setvalue(tempObj);
                  setAttachment([]);
                  setIsEdit(false);
                  // setSelect(false);
                  // setvalue({ ...value });
                }}
              />
              {select && (
                <>
                  {!multiSelect && (
                    <DefaultButton
                      text="Edit"
                      iconProps={{ iconName: "Edit" }}
                      // styles={buttonstyle}

                      styles={{
                        root: {
                          border: "none", // Remove the border
                        },
                      }}
                      onClick={(e: any) => {
                        setIsEdit(true);

                        setIsPane(true);
                        setvalue({ ...editdata });
                        GetAddachment();
                      }}
                    />
                  )}

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
                      setIsdelete(true);
                      setIsPane(false);
                    }}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div>
        {loader ? (
          <ShimmeredDetailsList
            setKey="items"
            items={[]}
            columns={columns}
            enableShimmer={true}
            // shimmerLines={10}
          />
        ) : rows.length === 0 ? (
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
        ) : (
          <DetailsList
            items={rows}
            columns={columns}
            selection={selection}
            selectionMode={SelectionMode.multiple}
            onItemInvoked={handleSelection}
            onShouldVirtualize={() => {
              return false;
            }}
          />
        )}
        {!loader && duplicate.length > 0 ? (
          <p>
            Showing{" "}
            <b style={{ fontSize: "12px" }}>
              {`${paginateNumber[0] + 1}`}-{" "}
              {`${
                paginateNumber[1] >= duplicate.length
                  ? duplicate.length
                  : paginateNumber[1]
              }`}
            </b>{" "}
            of <b style={{ fontSize: "12px" }}>{`${duplicate.length}`}</b>{" "}
            entries.
          </p>
        ) : (
          <p>
            Showing <b style={{ fontSize: "12px" }}>0</b> entries.
          </p>
        )}
        {rows.length > 0 || loader ? (
          <Pagination
            currentPage={currentPage}
            totalPages={
              duplicate.length > 0 ? Math.ceil(duplicate.length / 30) : 1
            }
            onChange={(page) => {
              paginate(page, duplicate);
            }}
            // style={{ margin: "auto" }}
          />
        ) : (
          ""
        )}
        {/* {masterData.length > 0 ? (
          <DetailsList
            items={masterData}
            columns={columns}
            selection={selection}
            selectionMode={SelectionMode.single}
            onShouldVirtualize={() => {
              return false;
            }}
            // setKey="set"
            // onItemInvoked={() => deselectSelectedItem()}
          />
        ) : (
          <></>
        )} */}
      </div>
      {/* 
      <ShimmeredDetailsList
        items={masterData} // Empty items array when loading
        columns={columns}
        enableShimmer={!masterData}
        selection={selection}
        selectionMode={SelectionMode.single}
        onShouldVirtualize={() => {
          return false;
        }} */}

      {/* /> */}
      {/* panel */}
      {isPane && (
        <Panel
          isOpen={true}
          styles={{
            main: {
              width: "50% !important",
            },
          }}
        >
          {/* <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 20px",
              borderBottom: "1px solid gray",
            }}
           >
            <div>
              <CommandBarButton
                iconProps={{ iconName: "Save" }}
                text="Save"
                title="Save"
                styles={modalheader}
                // style={{ padding: "10px 5px" }}
              />
              <CommandBarButton
                iconProps={{ iconName: "cancel" }}
                text="Cancel"
                title="Cancel"
                styles={modalheader}
                // style={{ padding: "10px 5px" }}
              />
              <CommandBarButton
                iconProps={{ iconName: "Link" }}
                text="Copy Link"
                styles={modalheader}
                // style={{ padding: "10px 5px" }}
              />
            </div>
            <div>
              <IconButton
                iconProps={{ iconName: "Edit" }}
                  menuProps={menuProps}
                styles={{
                  root: {
                    ".ms-Button-flexContainer": {
                      paddingRight: "15px",
                    },
                  },
                }}
              />
              <IconButton
                iconProps={{ iconName: "cancel" }}
                title="Close"
                  onClick={() => setPanel(false)}
              />
            </div>
          </div> */}
          {/* title */}
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
                {!isEdit ? "Add new record" : "Update the record"}
              </h3>
              <IconButton
                iconProps={{ iconName: "cancel" }}
                title="Close"
                onClick={() => {
                  setIsPane(false);
                  setError({
                    Mls: "",
                    Title: "",
                    Price: "",
                    Email: "",
                    ARV: "",
                    Offer: "",
                    Sold4: "",
                    OfferContract: "",
                  });
                }}
              />
            </div>
            {/* TextField */}

            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="TextField" style={{ marginRight: "10px" }} />

                <Label required styles={labelstyle}>
                  MLS No./Off Market
                </Label>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TextField
                  styles={textStyle}
                  placeholder="Enter the value here"
                  value={value.Title}
                  // id="Email"
                  // name="Email"
                  errorMessage={error.Title ? error.Title : ""}
                  onChange={(e, val) => {
                    getonChange("Title", val);
                  }}
                />
                {/* //lastchange */}
                <IconButton
                  onClick={() => {
                    value.Title == ""
                      ? alert("Please enter valid MLS No")
                      : handlerApiFetch();
                  }}
                  className={styles.btnSearchIcon}
                  iconProps={{ iconName: "Search" }}
                ></IconButton>
              </div>
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="TextField" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Property Address</Label>
              </div>

              <TextField
                styles={textStyle}
                placeholder="Enter the value here"
                value={value.PropertyAddress}
                id="property"
                name="property"
                onChange={(e, val) => {
                  getonChange("PropertyAddress", val);
                }}
              />
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="KaizalaLogo" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Source</Label>
              </div>

              <Dropdown
                placeholder="Select an option"
                // label="Technologies"
                defaultSelectedKey={value.Whereat}
                options={[
                  {
                    key: "MLS O Days",
                    text: "MLS O Days",
                  },

                  {
                    key: "Deep Dive",
                    text: "Deep Dive",
                  },
                  {
                    key: "OffMarket/Wholesale",
                    text: "OffMarket/Wholesale",
                  },
                  {
                    key: "Pocket Listing",
                    text: "Pocket Listing",
                  },
                  {
                    key: "FSBO",
                    text: "FSBO",
                  },
                  {
                    key: "Pack on Market",
                    text: "Pack on Market",
                  },
                  {
                    key: "Price Drop",
                    text: "Price Drop",
                  },
                  {
                    key: "Browardbuyers.com",
                    text: "Browardbuyers.com",
                  },
                  {
                    key: "Email Blast",
                    text: "Email Blast",
                  },
                  {
                    key: "Plot Point",
                    text: "Plot Point",
                  },
                ]}
                onChange={(e, val) => {
                  getonChange("Whereat", val.key);
                }}
              />
            </div>
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
                // showHiddenInUI={false}
                showHiddenInUI={true}
                principalTypes={[PrincipalType.User]}
                defaultSelectedUsers={
                  value.PeopleEmail ? [value.PeopleEmail] : []
                }
                // defaultSelectedUsers={["Chandru@palmcactus.com"]}
                resolveDelay={1000}
                onChange={(items: any[]) => {
                  if (items.length > 0) {
                    const selectedItem = items[0];
                    getonChange("assignId", selectedItem.id);
                    // getonChange("PeopleEmail", selectedItem.secondaryText);
                  } else {
                    // No selection, pass null or handle as needed
                    getonChange("assignId", null);
                  }
                }}
              />
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="KaizalaLogo" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Status</Label>
              </div>
              <Dropdown
                // label="Technologies"
                // defaultSelectedKey={value.Status}
                defaultSelectedKey={value.Status}
                onChange={(e, val) => {
                  getonChange("Status", val.key);
                }}
                placeholder="Select an option"
                options={[
                  { key: "Coming Soon", text: "Coming Soon" },
                  { key: "Active", text: "Active" },
                  {
                    key: "Active/Under Contract",
                    text: "Active/Under Contract",
                  },
                  { key: "Pending", text: "Pending" },
                  { key: "Closed", text: "Closed" },
                  { key: "PC Closed", text: "PC Closed" },
                  { key: "Temp Off Market", text: "Temp Off Market" },
                  // Add more options as needed
                ]}
                // placeholder="Select an option"
                // defaultSelectedKey={value.Status}
              />
            </div>

            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="AddTo" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Price</Label>
              </div>

              {/* <div className={classes.dollarInput}>
                <span>$</span> */}
              <TextField
                prefix="$"
                styles={dollarInputStyle}
                placeholder="Enter the value here"
                errorMessage={error.Price ? error.Price : null}
                value={value.Price}
                onChange={(e, val) => {
                  getonChange("Price", val);
                }}
              />
              {/* </div> */}
            </div>

            {/* dollar textfield */}
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="AddTo" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>ARV</Label>
              </div>

              {/* <div className={classes.dollarInput}> */}
              {/* <span>$</span> */}
              <TextField
                type="text"
                prefix="$"
                value={value.ARV}
                styles={dollarInputStyle}
                errorMessage={error.ARV ? error.ARV : null}
                placeholder="Enter the value here"
                onChange={(e, val) => {
                  getonChange("ARV", val);
                }}
              />
              {/* </div> */}
              {/* {error&& <Label></Label>} */}
            </div>

            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="TextField" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Offer</Label>
              </div>

              <TextField
                styles={dollarInputStyle}
                prefix="$"
                placeholder="Enter the value here"
                errorMessage={error.Offer ? error.Offer : null}
                value={value.Offer}
                id="offer"
                name="offer"
                onChange={(e, val) => {
                  getonChange("Offer", val);
                }}
              />
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="TextField" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Buy Price</Label>
              </div>

              <TextField
                styles={textStyle}
                placeholder="Enter the value here"
                value={value.OfferContract}
                errorMessage={error.OfferContract ? error.OfferContract : null}
                // id="Sold 4"
                // name="Sold 4"
                onChange={(e, val) => {
                  getonChange("OfferContract", val);
                }}
              />
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="TextField" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Sold Price</Label>
              </div>

              <TextField
                styles={textStyle}
                placeholder="Enter the value here"
                value={value.Sold4}
                errorMessage={error.Sold4 ? error.Sold4 : null}
                id="Sold Price"
                name="Sold Price"
                onChange={(e, val) => {
                  getonChange("Sold4", val);
                }}
              />
            </div>

            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="TextField" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Agent Name</Label>
              </div>

              <TextField
                styles={textStyle}
                placeholder="Enter the value here"
                value={value.AgentName}
                // id="Sold 4"
                // name="Sold 4"
                onChange={(e, val) => {
                  getonChange("AgentName", val);
                }}
              />
            </div>

            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="TextField" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Agent Number</Label>
              </div>

              <TextField
                styles={textStyle}
                placeholder="Enter the value here"
                value={value.AgentNumber}
                // id="Sold 4"
                // name="Sold 4"
                onChange={(e, val) => {
                  getonChange("AgentNumber", val);
                }}
              />
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="TextField" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Agent Email</Label>
              </div>

              <TextField
                styles={textStyle}
                placeholder="Enter the value here"
                errorMessage={error.Email ? error.Email : null}
                value={value.Email}
                // id="Sold 4"
                // name="Sold 4"
                onChange={(e, val) => {
                  getonChange("Email", val);
                }}
              />
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon
                  iconName="TransitionPush"
                  style={{ marginRight: "10px" }}
                />
                <Label styles={labelstyle}>Off Market</Label>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                  // border: "1px solid #000",
                  background: "##faf8f9",
                }}
              >
                <Checkbox
                  label="Yes"
                  checked={value.OffMarket}
                  onChange={(e, val) => {
                    getonChange("OffMarket", val);
                  }}
                />
              </div>
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="ListMirrored" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Notes</Label>
              </div>

              <TextField
                styles={textStyle}
                placeholder="Enter the value here"
                value={value.Notes}
                // id="Sold 4"
                // name="Sold 4"
                onChange={(e, val) => {
                  getonChange("Notes", val);
                }}
                multiline
                rows={5}
              />
            </div>

            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="KaizalaLogo" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Financing Type</Label>
              </div>

              <Dropdown
                placeholder="Select an option"
                // label="Technologies"
                defaultSelectedKey={value.FinancingType}
                options={[
                  {
                    key: "Cash",
                    text: "Cash",
                  },

                  {
                    key: "Private Money",
                    text: "Private Money",
                  },
                  {
                    key: "Hard Money",
                    text: "Hard Money",
                  },
                  {
                    key: "Conventional",
                    text: "Conventional",
                  },
                ]}
                onChange={(e, val) => {
                  getonChange("FinancingType", val.key);
                }}
              />
            </div>

            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="Attach" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Offer Contract</Label>
              </div>
              {attachment.length > 0 &&
                attachment.map((val, index) => {
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
                  // console.log(val.FileName);
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

            <div style={{ marginTop: "25px", display: "flex" }}>
              <PrimaryButton
                onClick={() => {
                  isEdit ? updatevalue() : onSave();

                  // setIsEdit(false);
                }}
                disabled={
                  !value.Title.trim() ||
                  error.Mls ||
                  error.ARV ||
                  error.Price ||
                  error.Email ||
                  error.Sold4 ||
                  error.Offer ||
                  error.OfferContract
                    ? true
                    : false
                }
                text={isEdit ? "Update" : "Save"}
                styles={{
                  root: {
                    borderRadius: "4px",
                    backgroundColor: "#7a7574",
                    color: "#fff",
                    marginRight: "15px",
                  },
                  rootHovered: {
                    backgroundColor: "#7a7574",
                    color: "#fff",
                  },
                }}
              />
              <DefaultButton
                onClick={() => {
                  setIsPane(false);
                  setError({
                    Mls: "",
                    Title: "",
                    Price: "",
                    Email: "",
                    ARV: "",
                    Offer: "",
                    Sold4: "",
                    OfferContract: "",
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
      )}
      <Modal
        isOpen={isdelete}
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
            onClick={() => setIsdelete(false)}
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
              setIsdelete(false);
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
      {/* {hamburgerActive ?  */}
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
            <Dropdown
              className="textField_box"
              styles={{
                root: {
                  width: 160,
                },
              }}
              defaultSelectedKey={filterValue.sort}
              options={[
                { key: "newerToOlder", text: "Newer to Older" },
                { key: "olderToNewer", text: "Older to Newer" },
              ]}
              onChange={(_, userValue) => {
                setFilterValue({
                  ...filterValue,
                  sort: userValue.key as string,
                });
                // setSelectedSortingOption(userValue.key as string);
              }}
              // onChange={(e, val) => {
              //   setSelectedSortingOption(val.key as string);
              //   objFilter.sort = val.key as string;
              //   // handleSearch(objFilter);
              // }}
            />
            {/* </div> */}
            <SearchBox
              placeholder="Search Assigned To"
              className="textField_box"
              styles={searchstyle}
              value={filterValue.user}
              onChange={(_, userValue) =>
                setFilterValue({ ...filterValue, user: userValue })
              }
            />

            <SearchBox
              placeholder="Search Property Address"
              className="textField_box"
              styles={searchstyle}
              value={filterValue.property}
              onChange={(_, userValue) =>
                setFilterValue({ ...filterValue, property: userValue })
              }
            />
            <SearchBox
              // MLS No./Off Market
              placeholder="Search MLS No"
              className="textField_box"
              styles={searchstyle}
              value={filterValue.mls}
              onChange={(_, userValue) =>
                setFilterValue({ ...filterValue, mls: userValue })
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
                  user: "",
                  property: "",
                  mls: "",
                  sort: "newerToOlder",
                });
                setFilterValue({
                  user: "",
                  property: "",
                  mls: "",
                  sort: "newerToOlder",
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
      {/* :<></>
      }  */}
      <div
        className="filter_icon"
        onClick={() => setHamburgerActive(!hamburgerActive)}
      >
        <img src={Hamburger_img} width="20px" height="20px" />
      </div>
    </div>
  );
};
export default MainComponent;
