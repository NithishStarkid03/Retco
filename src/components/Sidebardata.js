import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import * as GiIcons from "react-icons/go";
import * as BsIcons from "react-icons/bs";



  
export const SidebarData = [
  {
    title: "Master",
    path: "/master",
    icon: <GiIcons.GoDeviceDesktop/>,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  
    subNav: [
      {
        title: "Addproduct",
        path: "/master/addproduct",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Customer",
        path: "/master/customer",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Pricing",
        path: "/master/pricing",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "ProductMaster",
        path: "/master/productmaster",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "AddSeller",
        path: "/master/addseller",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Pricing History",
        path: "/master/pricinghistory",
        icon: <IoIcons.IoIosPaper />,
      }

    ],
  },
  {
    title: "Procurement",
    path: "/procurement",
    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  
    subNav: [
      {
        title: "PurchaseEntry",
        path: "/procurement/purchaseentry",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Payments",
        path: "/procurement/payments",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Payment History",
        path: "/procurement/paymenthistory",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
     
    ],
  },
 
  {
    title: "Packing",
    path: "/packing",
    icon:<GiIcons.GoPackage/>,
  
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  
    subNav: [
      
      {
        title: "PackingProcess",
        path: "/packing/packingprocess",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Packing Order Generation",
        path: "/packing/packingordergeneration",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Packing History",
        path: "/packing/currentstock",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "InventoryDispatch",
        path: "/packing/inventorydispatch",
        icon: <IoIcons.IoIosPaper />,
      },

    ],
  },

{
  title: "Hub",
    path: "/hub",
    icon:  <BsIcons.BsBagFill />,
  
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  
    subNav: [
      
      {
        title: "Hub Order",
        path: "/hub/huborder",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Order Status",
        path: "/hub/orderstatus",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Hub Stock",
        path: "/hub/hubstock",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Customer Order",
        path: "/hub/customerorder",
        icon: <IoIcons.IoIosPaper />,
      },

    ],
 

},


{
  title: "Management",
  icon: <FaIcons.FaUserAlt/>,
  iconClosed: <RiIcons.RiArrowDownSFill />,
  iconOpened: <RiIcons.RiArrowUpSFill />,

  subNav: [
      
    {
      title: "Add Warehouse",
      path: "/management/addwarehouse",
      icon: <IoIcons.IoIosPaper />,
    },
    {
      title: "Add Hub",
      path: "/management/addhub",
      icon: <IoIcons.IoIosPaper />,
    },
  ]


},
  
  {
    title: "About",
    path: "/about",
    icon: <IoIcons.IoMdHelpCircle />,
  },

  {
    title: "Contact",
    path: "/contact",
    icon: <FaIcons.FaPhone />,
  },

];