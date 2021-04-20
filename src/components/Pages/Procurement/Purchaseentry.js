import axios from 'axios';
import React, { Component } from 'react'
import { Button,ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Container, Row, Col,Form } from 'reactstrap';
import Purchaseentrydetails from './Purchaseentrydetails';
import { Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table} from 'reactstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Editmodal from './Editmodal';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

class Purchaseentry extends Component {
  
  
  constructor(props) {
    super(props);

    
    

    this.state={

      dropdownopen:false,
      sellerdet:[],
      handleseller:'',
      sellerconfirm:'',


      additionalcost:'',
      billno:'',
      procuredproduct:[
      {
      priceperunitquantity: '',
      totalunits: '',
      measurementunit: '',
      quantityperunit: '',
      productgroupId: '',
      prodcost:''
    },

    
  ],    

      newpriceperunitquantity:'',
      newtotalunits: '',
      newmeasurementunit: '',
      newquantityperunit: '',
      newproductgroupId: '',
      
      newprodcost:'',
      addprocmodal:false,
      totalcost:0,
      requiredItem: 0,
  error:null
    


}
    this.deleteattribute=this.deleteattribute.bind(this);
    this.replaceModalItem = this.replaceModalItem.bind(this);
    this.saveModalDetails = this.saveModalDetails.bind(this);
 
    
    

  }


  async componentDidMount(){
    this.getseller();
}

  toggle(){ 
    this.setState({
      dropdownopen:! this.state.dropdownopen});

  }

  getseller(){
    axios.get('http://localhost:3000/seller').then((res)=>{

    console.log(res.data)

    this.setState({
      sellerdet:res.data,

    });

    })
  }

  handleselect=(event)=>{
    console.log(event.target.value);
    

    this.setState({
      handleseller:event.target.value
    });
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
        priceperunitquantity:this.state.newpriceperunitquantity,
        totalunits: this.state.newtotalunits,
        measurementunit: this.state.newmeasurementunit,
        quantityperunit: this.state.newquantityperunit,
        productgroupId: this.state.newproductgroupId,
        prodcost:this.state.newprodcost
      }

    ],
    addprocmodal:false,
    totalcost:parseInt(this.state.totalcost)+parseInt(this.state.newprodcost),
  })
  console.log(this.state.billno)
  
  console.log(parseInt(this.state.newprodcost))
  console.log(this.state.procuredproduct)
  
 
}  
 

deleteattribute(id){
 
  let chk=0
  let costup=this.state.procuredproduct.map((i,index)=>{
    if(i.productgroupId){
      if(index==id){
    
        chk=Math.abs(this.state.totalcost-parseInt(i.prodcost))

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
    this.setState({ procuredproduct: tempdel });
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
  tempprocured[requiredItem] = item;
  
  this.setState({ procuredproduct: tempprocured });

  console.log(this.state.procuredproduct)
}




 
  render() {
    


    const requiredItem = this.state.requiredItem;

    let modalData = this.state.procuredproduct[requiredItem];




    let datas=this.state.procuredproduct.map((i,index)=>{

      if(i.productgroupId ){
       
      return (

        <tr>
          
              <td>{i.productgroupId}</td>
              <td>{i.prodcost}</td>
              <td>{i.priceperunitquantity}</td>
              <td>{i.totalunits}</td>
   
              <td>{i.quantityperunit}</td>
              <td>{i.measurementunit}</td>
              
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
       <h1>PROCUREMENT</h1>
    <Form onSubmit={this.sendseller}>  
    <Row>
    <Col xs="auto">
    <ButtonDropdown isOpen={this.state.dropdownopen} toggle={this.toggle.bind(this)} >
     <DropdownToggle caret color="primary">
     SELECT VENDOR
    </DropdownToggle>
    <DropdownMenu>
    <input type="text" list='seller' placeholder="Search" onSelect={this.handleselect}></input>
    <datalist id="seller" >
    {sellerdet}
    </datalist>
    </DropdownMenu>
    </ButtonDropdown>
    </Col>

    <Col xs="3">
    <Button color="success" size="md" className="mr-2" >SELECT</Button>
    </Col>

    </Row>
    </Form>
    
    <h3>SELLER NAME: {this.state.sellerconfirm}</h3>

    <FormGroup>
      
            <Label for="billno">BILL NO</Label>
            <Row>
              <Col xs='auto'>
            <Input id="billno" required value={this.state.billno} onChange={(e) => {
              
              this.state.billno = e.target.value;

              this.setState({ billno:this.state.billno });
            }} />
            </Col>
            <EditIcon onClick={(e)=>this.setState({billno:e.target.value})}/>
            <DeleteIcon  onClick={() => this.setState({billno:''})}></DeleteIcon>
          
            </Row>
          </FormGroup>
         
 
    
    
    {this.state.sellerconfirm.length>0?(
    <Button className="my-3" color="primary" onClick={this.toggleaddprocModal.bind(this)}>Add Product</Button>
    ):(
      <h1></h1>
    )}



    <Modal isOpen={this.state.addprocmodal} toggle={this.toggleaddprocModal.bind(this)}>
        <ModalHeader toggle={this.toggleaddprocModal.bind(this)}>Add</ModalHeader>
        <ModalBody>
        
        <FormGroup>
            <Label for="productgroupId">PRODUCT GROUPID</Label>
            <Input id="productgroupid" required  onChange={(e) => {
            
              this.setState({ newproductgroupId: e.target.value});
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="productcost">PRODUCT COST</Label>
            <Input id="productcost" required  onChange={(e) => {
            
              this.setState({ newprodcost: e.target.value});
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="priceperunitquantity">PRICEPERQUANTITY</Label>
            <Input id="priceperunitquantity" required  onChange={(e) => {
              
              this.setState({ newpriceperunitquantity:e.target.value });
            }} />
          </FormGroup>

          <FormGroup>
            <Label for="totalunits">TOTAL UNITS</Label>
            <Input id="totalunits" required  onChange={(e) => {

              this.setState({ newtotalunits:e.target.value });
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="measurementunit">MEASUREMENT UNIT</Label>
            <Input id="measurementunit" required  onChange={(e) => {
             
              this.setState({ newmeasurementunit:e.target.value });
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="quantityperunit">QUANTITY PER UNIT</Label>
            <Input id="quantityperunit" required  onChange={(e) => {

              this.setState({ newquantityperunit: e.target.value});
            }} />
          </FormGroup>

         
          

        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={this.addproc.bind(this)}>Add</Button>{' '}
          <Button color="secondary" onClick={this.toggleaddprocModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>
      



      
    

   



        
            <h3>BILL NO:{this.state.billno}</h3>
     
            <Table >
            <thead>
            <tr>
              
             <th>PRODUCT GROUPID</th>
             <th>PRODUCT COST</th>
             
              <th>PRICE PER QUANTITY</th>
              <th>TOTAL UNITS</th>
              
              <th>QUANTITY PERUNIT</th>
              <th>MEASUREMENT UNIT</th>
            </tr>
            </thead>
            <tbody>
             {datas}
            </tbody>
            
            </Table>

            <Editmodal
            productgroupId={modalData.productgroupId}
          prodcost={modalData.prodcost}
          priceperunitquantity={modalData.priceperunitquantity}
          totalunits={modalData.totalunits}
          measurementunit={modalData.measurementunit}
          quantityperunit={modalData.quantityperunit}
          saveModalDetails={this.saveModalDetails}
        />


              
            <h3><center>TOTAL COST:{this.state.totalcost}</center></h3>
            <FormGroup>
            <Label for="addcost">ADDITIONAL COST</Label>
            <Row>
            <Col xs='auto'>
            
            <Input id="addcost" required value={this.state.additionalcost} onChange={(e) => {
             
              this.state.additionalcost = e.target.value;

              this.setState({ additionalcost:this.state.additionalcost });
            }} />
            </Col>
           <EditIcon onClick={(e)=> this.setState({additionalcost:e.target.value})} />
            <DeleteIcon  onClick={() => this.setState({additionalcost:''})}>Delete</DeleteIcon>
            
            </Row>
            </FormGroup>
          
            <h3>ADDITIONAL COST: {this.state.additionalcost}</h3>
      
            
      

    </div>

    </Container>

  )
  

}
}

export default Purchaseentry;
