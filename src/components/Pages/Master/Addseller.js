import axios from 'axios';
import React, { Component } from 'react';
import { Container,Col,Row,Card, CardBody, CardSubtitle, CardFooter,Button } from 'reactstrap';
import { Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table} from 'reactstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ReactPaginate from 'react-paginate';
import './pagination.css'


class Addseller extends Component {

    
  constructor(props) {
    super(props);

    this.state={


      fullsellerdet:[],

        sellername:'',
        gst:'',
        email:'',
        phone:'',
        address:{
            addressLine1:'',
            addressLine2:'',
            addressLine3:'',
            city:'',
            state:'',
            country:'',
            pin:''

        },
            ndoor:'',
            nstreet:'',
            narea:'',
            ncity:'',
            nstate:'',
            ncountry:'',
            npin:'',
            isOpen:false,
            iseditOpen:false,
            ischeck:false,
            isupdate:false,
            addressflag:0,

            usellername:'',
            ugst:'',
            uemail:'',
            uphone:'',
            udoor:'',
            ustreet:'',
            uarea:'',
            ucity:'',
            ustate:'',
            ucountry:'',
            upin:'',
            upindex:-1,

            searchdata:[],
            searchinput:'',
            offset:0,
            perpage:5,
            currentpage:0,
            pagecount:0
            

    }
    this.handlePageClick = this.handlePageClick.bind(this);
}


    componentDidMount(){
 
      this.getsellerdetail();

    }

    openpost = () => this.setState({ isOpen: ! this.state.isOpen });
    editopenpost = () => this.setState({ iseditOpen: ! this.state.iseditOpen });
    checkseller=()=>this.setState({ischeck:!this.state.ischeck});
    updatemodal=()=>this.setState({isupdate:!this.state.isupdate});





handlePageClick=(e)=>{
  const selectedpage=e.selected;
  const offset=selectedpage*this.state.perpage


this.setState({
  currentpage:selectedpage,
  offset:offset
},()=>{

  this.loaddata()

})

}

loaddata(){

  const data=this.state.fullsellerdet

  const split=data.slice(this.state.offset,this.state.offset+this.state.perpage)

  this.setState({

    pagecount:Math.ceil(data.length/this.state.perpage),
    searchdata:split

  })

}






    getsellerdetail(){
     
     
      axios.get('http://localhost:8000/fullsellerdetail').then((response)=>{

      console.log('get',response.data)

      
     
     
     
      let a=[]
      if(response.data.length>0){

      response.data.map((data)=>{

          let b={}

          b={
            id:data.id,
            name:data.name,
            gst:data.gst,
            phone:data.phone,
            email:data.email,
            address:Object.values(data.address).join()
          }
        
        
        a.push(b)


      })
      
    }
    console.log('hey',a)

    var split=a.slice(this.state.offset, this.state.offset + this.state.perpage)

    this.setState({
      pagecount:Math.ceil(a.length/this.state.perpage),
      fullsellerdet:a,
      searchdata:split
    })
    


      })
    }

   


addseller(){

this.setState({

  address:{
      addressLine1:this.state.ndoor,
      addressLine2:this.state.nstreet,
      addressLine3:this.state.narea,
      city:this.state.ncity,
      state:this.state.nstate,
      country:this.state.ncountry,
      pin:this.state.npin

  },
  isOpen:false,
  addressflag:1
})
console.log(this.state.address)


}


deletenewseller=()=>{

  this.setState({

    sellername:'',
        gst:'',
        email:'',
        phone:'',
        address:{
            addressLine1:'',
            addressLine2:'',
            addressLine3:'',
            city:'',
            state:'',
            country:'',
            pin:''

        },
            ndoor:'',
            nstreet:'',
            narea:'',
            ncity:'',
            nstate:'',
            ncountry:'',
            npin:'',
            isOpen:false,
            iseditOpen:false,
            ischeck:false,
            addressflag:0
  })

}


editseller(){

this.setState({
  address:{
    addressLine1:this.state.ndoor,
    addressLine2:this.state.nstreet,
    addressLine3:this.state.narea,
    city:this.state.ncity,
    state:this.state.nstate,
    country:this.state.ncountry,
    pin:this.state.npin

},

  iseditOpen:false,
  addressflag:1
})

}


 addsellerpost=()=>{

  let addnseller=JSON.stringify(
      {
        name:this.state.sellername,
        gst:this.state.gst,
        email:this.state.email,
        phone:this.state.phone,
        address:this.state.address
      }
      )

    

  
  
  axios.post('http://localhost:8000/fullsellerdetail',addnseller,{headers:{"Content-Type" : "application/json"}}).then((res)=>{

      console.log('POSTED',res.data)

      this.setState({
        

        sellername:'',
        gst:'',
        email:'',
        phone:'',
        address:{
            addressLine1:'',
            addressLine2:'',
            addressLine3:'',
            city:'',
            state:'',
            country:'',
            pin:''

        },
            ndoor:'',
            nstreet:'',
            narea:'',
            ncity:'',
            nstate:'',
            ncountry:'',
            npin:'',
            isOpen:false,
            iseditOpen:false,
            ischeck:false,
            addressflag:0

      })

  })

  }

  async deleteallseller(id,e){
    await axios.delete(`http://localhost:8000/fullsellerdetail/${id}`).then((res)=>
    {
      console.log(res.status);
      console.log(res.data);
      
     
    }
    );

  }

updateseller(id,currentsellerid,e){

let tempsellerdetail=this.state.searchdata
tempsellerdetail.map((data,index)=>{
  
if(id==index){
  console.log(index)

  let tempaddress=(data.address).split(',')
  
  this.setState({
    upindex:currentsellerid,
    isupdate:!this.state.isupdate,
    usellername:data.name,
    ugst:data.gst,
    uemail:data.email,
    uphone:data.phone,
    udoor:tempaddress[0],
    ustreet:tempaddress[1],
    uarea:tempaddress[2],
    ucity:tempaddress[3],
    ustate:tempaddress[4],
    ucountry:tempaddress[5],
    upin:tempaddress[6]
      
  })

}


})
}

putseller=()=>{

  let updatesellerwithid={

      name:this.state.usellername,
      gst:this.state.ugst,
      email:this.state.uemail,
      phone:this.state.uphone,
      address:{
        addressLine1:this.state.udoor,
        addressLine2:this.state.ustreet,
        addressLine3:this.state.uarea,
        city:this.state.ucity,
        state:this.state.ustate,
        country:this.state.ucountry,
        pin:this.state.upin
      }

  }

axios.put(`http://localhost:8000/fullsellerdetail/${this.state.upindex}`,updatesellerwithid).then(res=>{

console.log(res.data);

this.setState({
  isupdate:false,
  usellername:'',
  ugst:'',
  uemail:'',
  uphone:'',
  udoor:'',
  ustreet:'',
  uarea:'',
  ucity:'',
  ustate:'',
  ucountry:'',
  upin:'',
  upindex:-1,


})

})

}



handlesearch=(e)=>{
  this.setState({searchinput:e.target.value},()=>{


    this.globalsearch();

  })
}

globalsearch=()=>{

let searchinput=this.state.searchinput;
let filterdata=this.state.fullsellerdet.filter(val=>{

return(
  val.name.toLowerCase().includes(searchinput.toLowerCase()) ||
  val.gst.toLowerCase().includes(searchinput.toLowerCase()) 



)


})

this.setState({

searchdata:filterdata

})

}
  




    render() {

      
     
      

      let sellerdata=this.state.searchdata.map((data,index)=>{

       
        return(
          <tr key={index}>
            <td>{index+1}</td>
          <td>{data.name}</td>
          <td>{data.gst}</td>
          <td>{data.email}</td>
          <td>{data.phone}</td>
         
          
          <td>{data.address}
          </td>

          <td> <DeleteIcon onClick={(e)=>this.deleteallseller(data.id,e)}></DeleteIcon></td>
          <td> <EditIcon onClick={(e)=>this.updateseller(index,data.id,e)}></EditIcon></td>
          </tr>
        )

      }
       
      )

        return (
        
        <Container>
          <div className="App">
           <center> <h3>SELLER DETAILS</h3></center>
          <Row>
            <Col xs='auto'> 
          <Button color="success" onClick={this.openpost}>
            ADD SELLER
          </Button>
          </Col>
         </Row>
          <Modal isOpen={this.state.isOpen} toggle={this.openpost}>
          <ModalHeader toggle={this.openpost}>
            ADD SELLER
          </ModalHeader>
          <ModalBody>
             <Card>
            <CardBody>
                <FormGroup >
                
                <Label for="sellername">SELLER NAME</Label>
                  
                  
                <Input id="productgroupId"   onChange={(e) => {
                  
                  this.setState({ sellername: e.target.value});
                }} />
                </FormGroup>
              
                <FormGroup>
                  <Label for="gst">GST</Label>
                  <Input id="gst"  onChange={(e) => {
                  
                    this.setState({ gst: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="email">EMAIL</Label>
                  <Input id="email" type="email" onChange={(e) => {
                    
                    this.setState({ email:e.target.value });
                  }} />
                </FormGroup>

                <FormGroup>
                  <Label for="phone">PHONE</Label>
                  <Input id="phone" onChange={(e) => {

                    this.setState({ phone:e.target.value });
                  }} />
                </FormGroup>
                
                <CardSubtitle className="mb-2 text-muted">ADDRESS</CardSubtitle>
                  
                <FormGroup>
                  <Label for="doorno">DOOR NO</Label>
                  <Input id="doorno"  onChange={(e) => {
                    
                    this.setState({ ndoor:e.target.value });
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="street">STREET</Label>
                  <Input id="street"  onChange={(e) => {

                    this.setState({ nstreet: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="area">AREA</Label>
                  <Input id="area"  onChange={(e) => {

                    this.setState({ narea: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="city">CITY</Label>
                  <Input id="city"  onChange={(e) => {

                    this.setState({ ncity: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="state">STATE</Label>
                  <Input id="state"  onChange={(e) => {

                    this.setState({ nstate: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="country">COUNTRY</Label>
                  <Input id="country"  onChange={(e) => {

                    this.setState({ ncountry: e.target.value});
                  }} />
                </FormGroup><FormGroup>
                  <Label for="pin">PIN CODE</Label>
                  <Input id="pin"  onChange={(e) => {

                    this.setState({ npin: e.target.value});
                  }} />
                </FormGroup>
         </CardBody>
         </Card>
         
         </ModalBody>
          <ModalFooter>
         <Button color="success" size="sm" onClick={this.addseller.bind(this)}>ADD</Button>
         
         <Button color="danger" size="sm" onClick={this.openpost}>Cancel</Button>
         </ModalFooter>
         
          </Modal>


          <Modal isOpen={this.state.iseditOpen} toggle={this.editopenpost}>
          <ModalHeader toggle={this.editopenpost}>
            EDIT SELLER
          </ModalHeader>
          <ModalBody>
             <Card>
            <CardBody>
                <FormGroup >
                
                <Label for="sellername">SELLER NAME</Label>
                  
                  
                <Input id="productgroupId" value={this.state.sellername}  onChange={(e) => {
                  
                  this.setState({ sellername: e.target.value});
                }} />
                </FormGroup>
              
                <FormGroup>
                  <Label for="gst">GST</Label>
                  <Input id="gst" value={this.state.gst} onChange={(e) => {
                  
                    this.setState({ gst: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="email">EMAIL</Label>
                  <Input id="email" type="email" value={this.state.email} onChange={(e) => {
                    
                    this.setState({ email:e.target.value });
                  }} />
                </FormGroup>

                <FormGroup>
                  <Label for="phone">PHONE</Label>
                  <Input id="phone" value={this.state.phone} onChange={(e) => {

                    this.setState({ phone:e.target.value });
                  }} />
                </FormGroup>
                
                <CardSubtitle className="mb-2 text-muted">ADDRESS</CardSubtitle>
                  
                <FormGroup>
                  <Label for="doorno">DOOR NO</Label>
                  <Input id="doorno" value={this.state.ndoor} onChange={(e) => {
                    
                    this.setState({ ndoor:e.target.value });
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="street">STREET</Label>
                  <Input id="street" value={this.state.nstreet} onChange={(e) => {

                    this.setState({ nstreet: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="area">AREA</Label>
                  <Input id="area" value={this.state.narea} onChange={(e) => {

                    this.setState({ narea: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="city">CITY</Label>
                  <Input id="city" value={this.state.ncity} onChange={(e) => {

                    this.setState({ ncity: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="state">STATE</Label>
                  <Input id="state" value={this.state.nstate} onChange={(e) => {

                    this.setState({ nstate: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="country">COUNTRY</Label>
                  <Input id="country" value={this.state.ncountry} onChange={(e) => {

                    this.setState({ ncountry: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="pin">PIN CODE</Label>
                  <Input id="pin" value={this.state.npin} onChange={(e) => {

                    this.setState({ npin: e.target.value});
                  }} />
                </FormGroup>
         </CardBody>
         </Card>
         
         </ModalBody>
          <ModalFooter>
         <Button color="success" size="sm" onClick={this.editseller.bind(this)}>Edit</Button>
         
         <Button color="danger" size="sm" onClick={this.editopenpost}>Cancel</Button>
         </ModalFooter>
         
          </Modal>


          <Modal isOpen={this.state.isupdate} toggle={this.updatemodal}>
          <ModalHeader toggle={this.updatemodal}>
            UPDATE SELLER
          </ModalHeader>
          <ModalBody>
          <Card>
            <CardBody>
                <FormGroup >
                
                <Label for="sellername">SELLER NAME</Label>
                  
                  
                <Input id="productgroupId" value={this.state.usellername}  onChange={(e) => {
                  
                  this.setState({ usellername: e.target.value});
                }} />
                </FormGroup>
              
                <FormGroup>
                  <Label for="gst">GST</Label>
                  <Input id="gst" value={this.state.ugst} onChange={(e) => {
                  
                    this.setState({ ugst: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="email">EMAIL</Label>
                  <Input id="email" type="email" value={this.state.uemail} onChange={(e) => {
                    
                    this.setState({ uemail:e.target.value });
                  }} />
                </FormGroup>

                <FormGroup>
                  <Label for="phone">PHONE</Label>
                  <Input id="phone" value={this.state.uphone} onChange={(e) => {

                    this.setState({ uphone:e.target.value });
                  }} />
                </FormGroup>
                
                <CardSubtitle className="mb-2 text-muted">ADDRESS</CardSubtitle>
                  
                <FormGroup>
                  <Label for="doorno">DOOR NO</Label>
                  <Input id="doorno" value={this.state.udoor} onChange={(e) => {
                    
                    this.setState({ udoor:e.target.value });
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="street">STREET</Label>
                  <Input id="street" value={this.state.ustreet} onChange={(e) => {

                    this.setState({ ustreet: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="area">AREA</Label>
                  <Input id="area" value={this.state.uarea} onChange={(e) => {

                    this.setState({ uarea: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="city">CITY</Label>
                  <Input id="city" value={this.state.ucity} onChange={(e) => {

                    this.setState({ ucity: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="state">STATE</Label>
                  <Input id="state" value={this.state.ustate} onChange={(e) => {

                    this.setState({ ustate: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="country">COUNTRY</Label>
                  <Input id="country" value={this.state.ucountry} onChange={(e) => {

                    this.setState({ ucountry: e.target.value});
                  }} />
                </FormGroup>
                <FormGroup>
                  <Label for="pin">PIN CODE</Label>
                  <Input id="pin" value={this.state.upin} onChange={(e) => {

                    this.setState({ upin: e.target.value});
                  }} />
                </FormGroup>
         </CardBody>
         </Card>
         
         </ModalBody>
         
         <ModalFooter>
         <Button color="success" size="sm" onClick={this.putseller} >Edit</Button>
         
         <Button color="danger" size="sm" onClick={this.updatemodal}>Cancel</Button>
         </ModalFooter>
          </Modal>



          <br></br>
          <Row>
          <Col>
          <center><h5>NEW SELLER</h5></center>
        
          <Table striped>
          <thead>
            <tr>
              
             <th>NAME</th>
             <th>GST</th>
             
              <th>EMAIL</th>
             
              
              <th>PHONE</th>
              <th>ADDRESS</th>
            </tr>
            </thead>
            {this.state.addressflag==1?(
            <tbody>
              <tr>

              <td>{this.state.sellername}</td>
              <td>{this.state.gst}</td>
              <td>{this.state.email}</td>
              <td>{this.state.phone}</td>
              <td>
              {
              Object.values(this.state.address).join()
              }
              </td>
              <td>
              <DeleteIcon onClick={this.deletenewseller}></DeleteIcon>
              </td>
              <td>
                <EditIcon onClick={this.editopenpost}></EditIcon>
              </td>
            </tr>
            <tr>
              <td colSpan="3"></td>
              
              <td>
             
           <Button  color="success" size="sm" onClick={this.checkseller}>CONFIRM</Button>
              </td>
            </tr>
            </tbody>
            
            ):(<tbody></tbody>)
            
            }
            
            
            
          </Table>
          </Col>  
          </Row>
          
          <br></br>
          
          <Modal isOpen={this.state.ischeck} toggle={this.checkseller}>
          <ModalHeader toggle={this.checkseller}>
            CONFIRM SELLER
          </ModalHeader>
          <ModalBody>
            
            <div>
              <tr><td>Name:{this.state.sellername}</td></tr>
             
              <tr><td> GST:{this.state.gst}</td></tr>
              <tr><td>EMAIL:{this.state.email}</td></tr>
              <tr><td>PHONE:{this.state.phone}</td></tr>
              
              <tr><td>ADDRESS:{
              Object.values(this.state.address).join()
              }</td></tr>
            </div>
           
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.addsellerpost}>Add</Button>
            <Button color="danger" onClick={this.checkseller}>Cancel</Button>
          </ModalFooter>
          </Modal>
          



          <Row>
          <Col >
          <center><h5>ALL SELLER</h5></center>
          
            
        <b>Search</b>: <input
        style={{ marginLeft: 5 }}
        type="text"
        placeholder="Type to search..."
        value={this.state.searchinput}
        onChange={e => this.handlesearch(e)}
      
        />
        <DeleteIcon onClick={()=>this.setState({searchinput:'',searchdata:this.state.fullsellerdet})}></DeleteIcon>


        
            {this.state.searchdata.length === 0 && <span>No records found!</span> }
            
         <Row>
         <br></br>
          <Table striped>
           
          <thead>
            <tr>
              <th>SNo</th>
             <th>NAME</th>
             <th>GST</th>
             
              <th>EMAIL</th>
             
              
              <th>PHONE</th>
              <th>ADDRESS</th>
            </tr>
            
            </thead>
            <tbody>
              {sellerdata}
            </tbody>

          </Table>
          </Row>
          <Row>
          <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.pagecount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}/>

          </Row>
           
          </Col>
          
           </Row>

         </div>
        </Container>
        )
    }
}

export default Addseller
