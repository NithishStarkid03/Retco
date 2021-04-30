import React from 'react'
import "../App.css";
import Sidebar from "./Sidebar";
import { Switch, Route,Redirect } from "react-router-dom";

import Contact from "./Pages/ContactUs";
import Support from "./Pages/Support";
import Mastertab from './Pages/Master/Mastertab';

import Distributiontab from './Pages/Distribution/Distributiontab';

import Procurementtab from './Pages/Procurement/Procurementtab';

import Packingtab from './Pages/Packing/Packingtab';

import Packingprocess from './Pages/Packing/Packingprocess';
import Currentstock from './Pages/Packing/Currentstock';
import Inventorydispatch from './Pages/Packing/Inventorydispatch';

import Purchaseentry from './Pages/Procurement/Purchaseentry';
import Payments from './Pages/Procurement/Payments';
import Batchcode from './Pages/Procurement/Batchcode';

import Addproduct from './Pages/Master/Addproduct';
import Customer from './Pages/Master/Customer';
import Pricing from './Pages/Master/Pricing';
import ProductMaster from './Pages/Master/Productmaster';
import Addseller from './Pages/Master/Addseller';

import Orderstatus from './Pages/Distribution/Orderstatus';
import Orders from './Pages/Distribution/Orders';

import Home from './Pages/Home';


import 'bootstrap/dist/css/bootstrap.min.css';



function Tabs() {
    return (
        <div>
        <Sidebar />
        <Switch>
          <Route path="/home" component={Home}/>
          
          <Route path="/master" exact component={Mastertab} />

                <Route path="/master/addproduct" exact component={Addproduct} />
                <Route path="/master/customer" exact component={Customer} />
                <Route path="/master/pricing" exact component={Pricing} />
                <Route path="/master/productmaster" exact component={ProductMaster} />
                <Route path="/master/addseller" exact component={Addseller} />
                

          <Route path="/distribution" exact component={Distributiontab} />

                <Route path="/distribution/orders" exact component={Orders} />
                <Route path="/distribution/orderstatus" exact component={Orderstatus} />
          
          
          <Route path="/procurement" exact component={Procurementtab} />

                <Route path="/procurement/purchaseentry" exact component={Purchaseentry} />
                <Route path="/procurement/payments" exact component={Payments} />
                <Route path="/procurement/batchcode" exact component={Batchcode} />
                


          <Route path="/packing" exact component={Packingtab} />

                <Route path="/packing/currentstock" exact component={Currentstock} />
                <Route path="/packing/packingprocess" exact component={Packingprocess} />
                <Route path="/packing/inventorydispatch" exact component={Inventorydispatch} />
          
          <Route path="/contact" exact component={Contact} />
          <Route path="/support" exact component={Support} />

          <Redirect to="/home"/>
        </Switch>
      </div>
   
   )
}

export default Tabs

