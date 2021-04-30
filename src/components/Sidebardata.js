import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
  
export const SidebarData = [
  {
    title: "Master",
    path: "/master",
    icon: <AiIcons.AiFillHome />,
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
      },{
        title: "ProductMaster",
        path: "/master/productmaster",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "AddSeller",
        path: "/master/addseller",
        icon: <IoIcons.IoIosPaper />,
      },
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
        title: "BatchCode",
        path: "/procurement/batchcode",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
    ],
  },
 
  {
    title: "Packing",
    path: "/packing",
    icon: <FaIcons.FaEnvelopeOpenText />,
  
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  
    subNav: [
      {
        title: "CurrentStock",
        path: "/packing/currentstock",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "InventoryDispatch",
        path: "/packing/inventorydispatch",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "PackingProcess",
        path: "/packing/packingprocess",
        icon: <IoIcons.IoIosPaper />,
      },

    ],
  },


  {
    title: "Distibution",
    path: "/distribution",
    icon: <FaIcons.FaEnvelopeOpenText />,
  
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  
    subNav: [
      {
        title: "Orders",
        path: "/distribution/orders",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "OrderStatus",
        path: "/distribution/orderstatus",
        icon: <IoIcons.IoIosPaper />,
      },

    ],
  },


  {
    title: "Support",
    path: "/support",
    icon: <IoIcons.IoMdHelpCircle />,
  },

  {
    title: "Contact",
    path: "/contact",
    icon: <FaIcons.FaPhone />,
  },

];