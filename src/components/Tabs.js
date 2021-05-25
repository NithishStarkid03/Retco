import React from 'react'
import "../App.css";
import Sidebar from "./Sidebar";
import { Switch, Route,Redirect } from "react-router-dom";

import Contact from "./Pages/ContactUs";
import Support from "./Pages/Support";





import Packingprocess from './Pages/Packing/Packingprocess';
import Currentstock from './Pages/Packing/Currentstock';
import Inventorydispatch from './Pages/Packing/Inventorydispatch';
import Packingordergeneration from './Pages/Packing/Packingordergeneration';


import Purchaseentry from './Pages/Procurement/Purchaseentry';
import Payments from './Pages/Procurement/Payments';
import Paymenthistory from './Pages/Procurement/Paymenthistory';


import Addproduct from './Pages/Master/Addproduct';
import Customer from './Pages/Master/Customer';
import Pricing from './Pages/Master/Pricing';
import ProductMaster from './Pages/Master/Productmaster';
import Addseller from './Pages/Master/Addseller';
import Productcategory from './Pages/Master/Productcategory';
import Pricinghistory from './Pages/Master/Pricinghistory';



import Huborder from './Pages/Hub/Huborder';
import Hubstock from './Pages/Hub/Hubstock';
import Orderstatus from './Pages/Hub/Orderstatus';
import Customerorder from './Pages/Hub/Customerorder';

import Addwarehouse from './Pages/Management/Addwarehouse';
import Addhub from './Pages/Management/Addhub';




import Home from './Pages/Home';


import 'bootstrap/dist/css/bootstrap.min.css';




function Tabs() {
    return (
        <div>
        <Sidebar />
        <Switch>
          <Route path="/home" component={Home}/>
          

                <Route path="/master/addproduct" exact component={Addproduct} />
                <Route path="/master/customer" exact component={Customer} />
                <Route path="/master/pricing" exact component={Pricing} />
                <Route path="/master/productmaster" exact component={ProductMaster} />
                <Route path="/master/addseller" exact component={Addseller} />
                <Route path="/master/productmaster/:id" exact component={Productcategory} />
                <Route path="/master/pricinghistory" exact component={Pricinghistory} />
                 
          
          
         

                <Route path="/procurement/purchaseentry" exact component={Purchaseentry} />
                <Route path="/procurement/payments" exact component={Payments} />
                <Route path="/procurement/paymenthistory" exact component={Paymenthistory} />
                


          

                <Route path="/packing/currentstock" exact component={Currentstock} />
                <Route path="/packing/packingprocess" exact component={Packingprocess} />
                <Route path="/packing/inventorydispatch" exact component={Inventorydispatch} />
                <Route path="/packing/packingordergeneration" exact component={Packingordergeneration} />



                 

                  <Route path="/hub/huborder" exact component={Huborder} />
                  <Route path="/hub/orderstatus" exact component={Orderstatus} />
                  <Route path="/hub/hubstock" exact component={Hubstock} />
                  <Route path="/hub/customerorder" exact component={Customerorder} />
                  

                  <Route path="/management/addwarehouse" exact component={Addwarehouse}/>
                  <Route path="/management/addhub" exact component={Addhub}/>
                   


          <Route path="/contact" exact component={Contact} />
          <Route path="/support" exact component={Support} />

          <Redirect to="/home"/>
        </Switch>
      </div>
   
   )
}

export default Tabs

