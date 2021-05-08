import axios from 'axios';
import React, { Component } from 'react'
import { Button,ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardBody } from 'reactstrap';
import { Container, Row, Col,Form,Card } from 'reactstrap';

import { Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table} from 'reactstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Editmodal from './Editmodal';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link } from "react-router-dom";
import Modalchild from './Barcode';

class Purchaseentry extends Component {
  
  
  constructor(props) {
    super(props);

    
    

    this.state={

      dropdownopen:false,
      sellerdet:[],
      handleseller:'',
      sellerconfirm:'',
      productdet:[],
      

      additionalcost:0,
      billno:'',
      billdate:'',
      procuredproduct:[
      {
      priceperunit: 0,
      totalunits: 0,
      measurementunit: '',
      quantityperunit: 0,
      productgroupId: '',
      tax:0,
    },

    
  ],    

      newpriceperunit:0,
      newtotalunits: 0,
      newmeasurementunit: '',
      newquantityperunit: 0,
      newproductgroupId: '',
      ntax:0,
      taxflag:0,
      paidamtflag:false,
      paidamt:0,

      addprocmodal:false,
      totalcost:0,
      requiredItem: 0,
      payment:'',
      isOpen: false,
      promptnewseller:0,
      confirmpostflag:0,
      barcodedet:[],
      barcodeflag:false


}
    this.deleteattribute=this.deleteattribute.bind(this);
    this.replaceModalItem = this.replaceModalItem.bind(this);
    this.saveModalDetails = this.saveModalDetails.bind(this);
 
    
    

  }


  async componentDidMount(){
    this.getseller();
    this.getproduct();
    
}

  

  toggle(){ 
    this.setState({
      dropdownopen:! this.state.dropdownopen});

  }

  getseller(){
    axios.get('http://localhost:3001/seller').then((res)=>{

    console.log(res.data)

    this.setState({
      sellerdet:res.data,

    });

    })
    
  }

  getproduct(){
    axios.get('http://localhost:8001/product').then((res)=>{

    console.log(res.data)

    this.setState({
      productdet:res.data,

    });

    })
    
  }


  handleselectseller=(event)=>{
    console.log(event.target.value);
    
    let f=0
    if(!event.target.value){
       f=1
    }
    
    let chk=event.target.value

    this.state.sellerdet.map((s)=>{

      if(s.name.toLowerCase().includes(chk.toLowerCase())){

              f=1
              this.setState({
                handleseller:event.target.value
                
              }); 
          
          } 
          
          
        }
       
      

    )


    if(f===0){
      console.log('ila',this.state.handleseller)
      this.setState({
        promptnewseller:1
      })
      
      
    }
    else{
      this.setState({
        promptnewseller:0
      })
        
    }
  
  }



  sendseller=event=>{
    event.preventDefault();
    const sellerid=this.state.handleseller;
    this.setState({
      sellerconfirm:sellerid
    })
  }







  toggleaddprocModal(){


    this.setState({
        addprocmodal:! this.state.addprocmodal,
        

    });
  }
 

addproc(){
  this.setState({
    
    procuredproduct:[
      ...this.state.procuredproduct,
      {
        priceperunit:this.state.newpriceperunit,
        totalunits: this.state.newtotalunits,
        measurementunit: this.state.newmeasurementunit,
        quantityperunit: this.state.newquantityperunit,
        productgroupId: this.state.newproductgroupId,
        tax:this.state.ntax,
      }

    ],
    newpriceperunit:0,
    newtotalunits: 0,
    newmeasurementunit: '',
    addprocmodal:false, 
    ntax:0,
    taxflag:0,
    taxin:false,
    totalcost:(this.state.totalcost)+((this.state.newtotalunits*this.state.newpriceperunit)*(1+(this.state.ntax/100))),
  })
  console.log(this.state.billno)
  

  console.log(this.state.procuredproduct)
  
 
}  
 

deleteattribute(id){
 
  let chk=0
  let costup=this.state.procuredproduct.map((i,index)=>{
    if(i.productgroupId){
      if(index==id){
    
        chk=Math.abs(this.state.totalcost-((i.totalunits*i.priceperunit)*(1+(i.tax/100))))

    this.setState(
      {
          totalcost:chk   
      }
    )
  }
    }
  })
  
  
  let tempdel = this.state.procuredproduct;
    tempdel.splice(id, 1);
    this.setState({ procuredproduct: tempdel,requiredItem:0 });
    console.log(this.state.procuredproduct)



    /*this.setState({

      procuredproduct:[{priceperunitquantity: '',
      totalunits: '',
      measurementunit: '',
      quantityperunit: '',
      productgroupId: '',
      prodcost:''}],
      totalcost:0

    })*/
    
}


replaceModalItem(index) {
  this.setState({
    requiredItem: index
  });
  console.log(index)
}



saveModalDetails(item) {
  
  const requiredItem = this.state.requiredItem;
  let tempprocured = this.state.procuredproduct;
  let preval=(this.state.procuredproduct[requiredItem].totalunits*this.state.procuredproduct[requiredItem].priceperunit)*(1+(this.state.procuredproduct[requiredItem].tax/100))
  tempprocured[requiredItem] = item;
  
  
  console.log(preval)
  this.setState({ procuredproduct: tempprocured });
  console.log(this.state.totalcost)

  let chk=0
  let costup=this.state.procuredproduct.map((i,index)=>{
    if(i.productgroupId){
      if(index==requiredItem){
    
        chk=Math.abs((this.state.totalcost+((i.totalunits*i.priceperunit)*(1+(i.tax/100))))-preval)

    this.setState(
      {
          totalcost:chk   
      }
    )
  }
    }
  })

  console.log(this.state.procuredproduct)
}


openpost = () => 
{
  if(this.state.additionalcost>=0 && this.state.payment && this.state.procuredproduct.length>0 && this.state.billno && this.state.sellerconfirm){
  this.setState({ isOpen: ! this.state.isOpen });
  }
  else{
    alert('fill all details')
  }

}

handlepost=()=>{
  axios.get('http://localhost:8003/procuredproducts').then((res)=>{

      console.log(res.data)
  
      this.setState({
        barcodedet:res.data,
        barcodeflag:!this.state.barcodeflag
       
  
      });
  
      })
      


 console.log('bathcodedet:',this.state.barcodedet,'flag',this.state.barcodeflag)

let procurement={}

 if(this.state.payment==='PARTIAL_PAID'){

  procurement={

    bill_no:this.state.billno,
    bill_date:this.state.billdate,
    additionalcost:this.state.additionalcost,
    status:this.state.payment,
    paidAmt:this.state.paidamt,
    addProcuredProductList:this.state.procuredproduct.filter((item,index)=>index>0),
    sellerId:this.state.sellerconfirm
  
 }
 document.getElementById('paidamt').value = ''

}

else
{
   procurement={

  bill_no:this.state.billno,
  bill_date:this.state.billdate,
  additionalcost:this.state.additionalcost,
  status:this.state.payment,
  paidAmt:null,
  addProcuredProductList:this.state.procuredproduct.filter((item,index)=>index>0),
  sellerId:this.state.sellerconfirm
}

}

document.getElementById('addcost').value = ''



axios.post('http://localhost:8002/proc',procurement).then((response)=>{

  console.log(response);
  
  
this.setState({
         
  
       
        dropdownopen:false,
        handleseller:'',
        sellerconfirm:'',
       
       
      
      
        additionalcost:0,
        billno:'',
        billdate:'',
        procuredproduct:[
        {
        priceperunit: 0,
        totalunits: 0,
        measurementunit: '',
        quantityperunit: 0,
        productgroupId: '',
        tax:0,
      },
      
      
      ],    
      
        newpriceperunit:0,
        newtotalunits: 0,
        newmeasurementunit: '',
        newquantityperunit: 0,
        newproductgroupId: '',
        ntax:0,
        paidamt:0,
        paidamtflag:false,
        addprocmodal:false,
        totalcost:0,
        requiredItem: 0,
        payment:'',
        isOpen: false,
  
})


  
 
  
})
}


handlebarcodemodal=(barcodereturn)=>{
  console.log('return',barcodereturn)
  this.setState({
    barcodeflag:barcodereturn
  })

}

deltax(id){

  if(id==='taxpercent'){
    document.getElementById('taxpercent').value = ''
    this.setState({taxflag:0,ntax:0})
  }
else{
  document.getElementById('taxamt').value = ''
  this.setState({taxflag:0,ntax:0})
}
}

deleteadditionalcost(id){
  document.getElementById(id).value = ''

  this.setState({
    additionalcost:0
  })

}
deletepaidamt(id){

  document.getElementById(id).value = ''
  this.setState({
    paidamt:0
  })
}


paymentstatus(val){
  if(val==='PARTIAL_PAID'){
    this.setState({
      payment:val,
      paidamtflag:!this.state.paidamtflag

    })
  }
  else{
  this.setState({
    payment:val 
  })
}

}

 
  render() {
    


    const requiredItem = this.state.requiredItem;

    let modalData = this.state.procuredproduct[requiredItem];




    let datas=this.state.procuredproduct.map((i,index)=>{

      if(i.productgroupId ){
       
      return (

        <tr>
          
              <td>{i.productgroupId}</td>
              <td>Rs.{i.priceperunit}</td>
              <td>{i.totalunits}</td>
              <td>{i.measurementunit}</td>
              <td>Rs.{i.totalunits*i.priceperunit}</td>
              <td>{i.quantityperunit}</td>
              <td>{i.tax}</td>
            
              <td>Rs.{(i.priceperunit*i.totalunits)*(1+(i.tax/100))}</td>
              
              <td>

              <EditIcon data-toggle="modal" data-target="#editmodal" onClick={()=>this.replaceModalItem(index)}></EditIcon>
              
              </td>
              <td>
                
              <DeleteIcon onClick={()=>this.deleteattribute(index)}></DeleteIcon>
              </td>
          
        </tr>


      )

      }
     
    })

    
    
    let sellerdet=this.state.sellerdet.map((s)=>{

    return (
        <option value={s.name}>{s.id}</option>
    )
  });





  return(

    <Container>
    
    <div className="App">
       <center><h3>PROCUREMENT</h3></center>
    <Form onSubmit={this.sendseller}>  
    <Row>
    <Col xs="auto">
    <ButtonDropdown isOpen={this.state.dropdownopen} toggle={this.toggle.bind(this)} >
     <DropdownToggle caret color="primary">
     SELECT SELLER
    </DropdownToggle>
    <DropdownMenu>
    <input type="text" list='seller' placeholder="Search" onSelect={this.handleselectseller}></input>
    
    <datalist id="seller" >
    {sellerdet}
    </datalist>
    </DropdownMenu>
    </ButtonDropdown>
    </Col>

    <Col xs="3">
    <Button color="success" size="md" className="mr-2" >SELECT</Button>
    </Col>

    {this.state.promptnewseller===1?(<Col >
    <Link to="/master/addseller">
    <Button color="primary" onClick={()=>this.setState({promptnewseller:0})}>ADD NEW SELLER</Button>
    </Link>
    </Col>
    ):(<></>)
    }
    
    </Row>
    </Form>
    <br></br>
    
    
    {this.state.sellerconfirm.length>0?(
      <div>
      <Row>
        <Col xs="auto">
      <Label for="sellername">SELLER NAME</Label>
        </Col>
      </Row>
      <Row>
      <Col xs="auto">
      
     <Input id="sellername" value={this.state.sellerconfirm}/>  
    </Col>
   
    <DeleteIcon  onClick={()=>this.setState({sellerconfirm:''})}></DeleteIcon>
    
    </Row>

<br></br>
    <Row>
      <Col xs="auto">
        <FormGroup>
      
            <Label for="billno">BILL NO</Label>
            <Row>
              <Col xs='auto'>
            <Input id="billno" required value={this.state.billno} onChange={(e) => {
              
              this.state.billno = e.target.value;

              this.setState({ billno:this.state.billno });
            }} />
            </Col>
            <DeleteIcon  onClick={() => this.setState({billno:''})}></DeleteIcon>
          
            </Row>
          </FormGroup>
         </Col>
         <Col>
        <FormGroup>
      
            <Label for="billdate">BILL DATE</Label>
            <Row>
              <Col xs='auto'>
            <Input id="billdate"  type="date" value={this.state.billdate} onChange={(e) => {
              
              this.state.billdate = e.target.value;

              this.setState({ billdate:this.state.billdate });
            }} />
            </Col>
            <DeleteIcon  onClick={() => this.setState({billdate:''})}></DeleteIcon>
          
            </Row>
          </FormGroup>
         </Col>


    </Row>
    
      
    <Button className="my-3" color="primary" onClick={this.toggleaddprocModal.bind(this)}>Add Product</Button>
    <h5>BILL NO:{this.state.billno}</h5>
    </div>
    ):(
      <h1></h1>
    )}



    <Modal isOpen={this.state.addprocmodal} toggle={this.toggleaddprocModal.bind(this)}>
        <ModalHeader toggle={this.toggleaddprocModal.bind(this)}>Add</ModalHeader>
        <ModalBody>
        
        <FormGroup >
           
            <Label for="productgroupId">PRODUCT NAME</Label>
           
            
          <Input list="productgroupId" type="text" placeholder="search"  onChange={(e) => {
            
            this.setState({ newproductgroupId: e.target.value});
          }} />
          <datalist id="productgroupId">
            {
              this.state.productdet.map(result=>
                {
                  return(
                    <option >{result.productgroupName}</option>
                  )
                }
                
                )
            }

          </datalist>
          </FormGroup>
        
          
          <FormGroup>
            <Label for="priceperunit">COST PER UNIT</Label>
            <Input id="priceperunit" required  onChange={(e) => {
               if((e.target.value)===''){
                this.setState({ newpriceperunit:0})   
               }
              else{
              this.setState({ newpriceperunit:parseFloat(e.target.value) });
              }
            }} />
          </FormGroup>

          <FormGroup>
            <Label for="totalunits">TOTAL UNITS</Label>
            <Input id="totalunits" required  onChange={(e) => {

                      if((e.target.value)===''){
                        this.setState({ newtotalunits:0})   
                      }
                      else{
              this.setState({ newtotalunits:parseFloat(e.target.value )});
            }
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="measurementunit">MEASUREMENT UNIT</Label>
            

          <select name="measurementunit" value={this.state.newmeasurementunit} id="measurementunit" onChange={(e)=>{this.setState({ newmeasurementunit:e.target.value })}}>
            <option >...</option>

            <option value="KILOGRAM">KILOGRAM</option>
            <option value="GRAM">GRAM</option>
            <option value="LITRE">LITRE</option>
            <option value="MILLILITRE">MILLILITRE</option>
            <option value="UNIT">UNIT</option>
            
            </select>
          </FormGroup>
          <FormGroup>
            <Label for="quantityperunit">QUANTITY PER UNIT</Label>
            <Input id="quantityperunit" required  onChange={(e) => {

              this.setState({ newquantityperunit: e.target.value});
            }} />
          </FormGroup>

          <FormGroup>
            <Label for="productcost">PRODUCT COST</Label>
            <Input id="productcost" value={1*this.state.newtotalunits*this.state.newpriceperunit}
            />
          </FormGroup>

          <FormGroup>
            
          <Label for="tax">TAX</Label>
          <Row>
            <Col>
          <Label for="taxpercent">PERCENTAGE</Label>
            </Col>
            
            <Col>
          
          <Label for="taxamt">AMOUNT</Label>
          
          </Col>
          </Row>
          <Row>
            <Col>
          <Input id="taxpercent" placeholder={this.state.taxflag+'%'} onChange={(e)=>{
            
            if(e.target.value===''){

              var temp=0
              this.setState({ntax:temp,taxflag:temp})
            
            }
            else{
              var temp=parseFloat(e.target.value)

              let taxamt=temp/100*(this.state.newpriceperunit*this.state.newtotalunits)

            this.setState({ntax:temp,taxflag:taxamt})
            
            } 
            }}/></Col>
            <Col>
             <DeleteIcon onClick={()=>this.deltax('taxpercent')}/>
            </Col>
            <Col>
          <Input id="taxamt" placeholder={'Rs'+this.state.taxflag} onChange={(e)=>{
            
            if(e.target.value===''){

              var temp=0
              this.setState({ntax:temp,taxflag:temp})
            
            }
            else{
              
              var temp=parseFloat(e.target.value)

              let taxpercent=(temp*100)/(this.state.newpriceperunit*this.state.newtotalunits)

            this.setState({ntax:taxpercent,taxflag:taxpercent})
            
            } 
            }} />
            </Col>
            <Col>
             <DeleteIcon onClick={()=>this.deltax('taxamt')}/>
            </Col>
           
           
            </Row>
            

          </FormGroup>
         

          <FormGroup>
            <Label for="productcostwithtax">PRODUCT COST WITH TAX</Label>
            
            <Input id="productcostwithtax" value={(1*this.state.newtotalunits*this.state.newpriceperunit)*(1+(this.state.ntax/100))}
            />
            
          </FormGroup>

         
          

        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={this.addproc.bind(this)}>Add</Button>{' '}
          <Button color="secondary" onClick={this.toggleaddprocModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>
      



      
    

   



        
           
     
            <Table >
            <thead>
            <tr>
              
             <th>PRODUCT GROUPID</th>
            
             
              <th>PRICE PER UNIT</th>
              <th>TOTAL UNITS</th>
              <th>MEASUREMENT UNIT</th>
              <th>PRODUCT COST</th>
              <th>QUANTITY PER UNIT</th>
              <th>TAX%</th>
              <th>PRODUCT COST+TAX</th>
              
              
            </tr>
            </thead>
            <tbody>
             {datas}
            </tbody>
            
            </Table>

            <Editmodal
            productgroupId={modalData.productgroupId}
            tax={modalData.tax}
          priceperunit={modalData.priceperunit}
          totalunits={modalData.totalunits}
          measurementunit={modalData.measurementunit}
          quantityperunit={modalData.quantityperunit}
          productdet={this.state.productdet}
          saveModalDetails={this.saveModalDetails}
        />


              
            <h4><center>TOTAL COST:{this.state.totalcost}</center></h4>
           
           
            <Label for="payment">PAYMENT STATUS</Label>
            <Row>

            <FormGroup>
            
            
            <Col xs='auto'>
            <select name="payment" value={this.state.payment} id="payment" onChange={(e)=>this.paymentstatus(e.target.value)}>
            <option value="empty">...</option>
            <option value="PAID">PAID</option>

            <option value="PARTIAL_PAID">PARTIAL PAID</option>
            <option value="UNPAID">UNPAID</option>
            
            </select>{'  '}
            <DeleteIcon  onClick={() => this.setState({payment:''})}/>{'  '}
            
            </Col>
           
          
            </FormGroup>
          
            
            
            {this.state.paidamtflag?(<>
              <Col xs='auto'>
              <Label >PAID AMOUNT</Label>
              </Col>
            
            <FormGroup>
            <Col xs='auto'>
            <Input id="paidamt"  onChange={(e) => {
              if(e.target.value===''){
                this.state.paidamt = 0;
                this.setState({ paidamt:this.state.paidamt });
              }
             else{
              this.state.paidamt = parseFloat(e.target.value);
              this.setState({ paidamt:this.state.paidamt });
              }
             
            }} />{' '}
            
            
            
            
            </Col>
            </FormGroup>
            <DeleteIcon  onClick={() =>this.deletepaidamt('paidamt')}/>
            
         
         
            </>):(<h3></h3>)}
            
            </Row>
          

            
            
            
            <FormGroup>
            <Label for="addcost">ADDITIONAL COST</Label>
            <Row>
            <Col xs='auto'>
            
            <Input id="addcost" required  onChange={(e) => {
              if(e.target.value===''){
                this.state.additionalcost = 0;
                this.setState({ additionalcost:this.state.additionalcost });
              }
             else{
              this.state.additionalcost = parseFloat(e.target.value);
              this.setState({ additionalcost:this.state.additionalcost });
              }
             
            }} />
            </Col>
            <DeleteIcon  onClick={() =>this.deleteadditionalcost('addcost')}>Delete</DeleteIcon>
            
            </Row>
            </FormGroup>
          <Row>
            <h4>ADDITIONAL COST: Rs.{this.state.additionalcost}</h4>
          </Row>
      
          

          <Row>
            <Col
            className="d-flex align-items-center justify-content-center" >
            <Button color="success" onClick={this.openpost}>
              CONFIRM
            </Button>
            </Col>
          </Row>
         

        <Modal isOpen={this.state.isOpen} toggle={this.openpost}>
          <ModalHeader toggle={this.openpost}>
            CONFIRM PROCUREMENT
          </ModalHeader>
          <ModalBody>

            
              <Table>
              <thead>
                <tr>
                  
                <th>SELLER</th>
               
                <th>BILL NUMBER</th>
                <th>BILL DATE</th>
                
                  <th>PAYMENT STATUS</th>
                  
                  <th>ADDITIONAL COST</th>
                  </tr>
                </thead>
                <tbody>
             
                <td>{this.state.sellerconfirm}</td>
                <td>{this.state.billno}</td>
              <td>{this.state.billdate}</td>
              {this.state.payment==='PARTIAL_PAID'?(<td>{this.state.payment}{' '}AMOUNT PAID:{this.state.paidamt}</td>):(<td>{this.state.payment}</td>)}
              <td>Rs.{this.state.additionalcost}</td>
              
              

              </tbody>
              </Table>
              <Table responsive >
            <thead>
            <tr>
              <th>SNo</th>
              
             <th>PRODUCT GROUPID</th>
             <th>PRICE PER UNIT</th>
              <th>TOTAL UNITS</th>
              <th>MEASUREMENT UNIT</th>
             <th>PRODUCT COST</th>
             
              
              <th>QUANTITY PER UNIT</th>
              <th>TAX%</th>
              <th>PRODUCTCOST + TAX</th>
              
            </tr>
            </thead>
            <tbody>
           { this.state.procuredproduct.map((i,index)=>{
              
            
          if(i.productgroupId ){
 
            return (

            <tr>
    
        <td>{index}</td>
        <td>{i.productgroupId}</td>
        <td>Rs.{i.priceperunit}</td>
        <td>{i.totalunits}</td>
        <td>{i.measurementunit}</td>
        <td>Rs.{i.priceperunit*i.totalunits}</td>
       

        <td>{i.quantityperunit}</td>
        <td>{i.tax}</td>
        <td>Rs.{(i.priceperunit*i.totalunits)*(1+(i.tax/100))}</td>

        </tr>
            )
           }
          })
        }

        
            </tbody>
        
        
            </Table>
            
            <center><h6>Total=Rs.{parseFloat(this.state.totalcost)+parseFloat(this.state.additionalcost)}</h6></center>
        

          
          </ModalBody>
          <ModalFooter>
          
          <Button color="success" onClick={this.handlepost}>
              CONFIRM
            </Button>
            
            <Button color="danger" onClick={this.openpost}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        
        <Modalchild barcodedet={this.state.barcodedet} flag={this.state.barcodeflag} barcodecallback={this.handlebarcodemodal}/>


    </div>

    </Container>

  )
  

}
}

export default Purchaseentry;
