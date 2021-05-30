import axios from 'axios';
import React, { Component } from 'react'
import { Row,Col,CardHeader ,Card, Container, CardBody, CardFooter, Form, FormGroup, Label,Input,CardSubtitle,Button, Modal,ModalHeader, ModalBody, ModalFooter,Collapse} from 'reactstrap'
import ReactPaginate from 'react-paginate';
import './pagination.css';
import DeleteIcon from '@material-ui/icons/Delete';
class Addhub extends Component {

    constructor(props){
        super(props);
        this.state={
            name:'',
            gst:'',
            email:'',
            phone:'',
            street:'',
            door:'',
            area:'',
            city:'',
            state:'',
            country:'',
            pin:'',
            confirmmodal:false,
            baseurl:'http://retco-server.us-east-1.elasticbeanstalk.com/api',
            hubdet:[],
           addhubopen:false,

            searchdata:[],
            searchinput:'',
            offset:0,
            perpage:2,
            currentpage:0,
            pagecount:0,

            editmodal:false,
            uname:'',
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
    }
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentDidMount(){
    this.gethub()
  }


  
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

  const data=this.state.hubdet

  const split=data.slice(this.state.offset,this.state.offset+this.state.perpage)

  this.setState({

    pagecount:Math.ceil(data.length/this.state.perpage),
    searchdata:split

  })

}




  gethub(){

    axios.get('http://localhost:8013/hub').then(res=>{

      var split=res.data.slice(this.state.offset, this.state.offset + this.state.perpage)
      this.setState({
        pagecount:Math.ceil(res.data.length/this.state.perpage),
          hubdet:res.data,
          searchdata:split
      })
    })

  }

 posthub=()=>{
    
    const warehouse={
      name:this.state.name,
      gstin:this.state.gst,
      phone:this.state.phone,
      email:this.state.email,
      address:{
        addressLine1:this.state.door,
        addressLine2:this.state.street,
        addressLine3:this.state.area,
        city:this.state.city,
        state:this.state.state,
        pin:this.state.pin
      }  
    }
   
//`${this.state.baseurl}/warehouse/add`
    axios.post( 'http://localhost:8013/hub',warehouse).then(res=>{
        console.log('posted warehouse',res.data)
        this.setState({
          name:'',
          gst:'',
          email:'',
          phone:'',
          street:'',
          door:'',
          area:'',
          city:'',
          state:'',
          country:'',
          pin:'',
          confirmmodal:false

        },()=>{
        document.getElementById('name').value=''
        document.getElementById('gst').value=''
        document.getElementById('phone').value=''
        document.getElementById('email').value=''
        document.getElementById('doorno').value=''
        document.getElementById('street').value=''
        document.getElementById('area').value=''
        document.getElementById('city').value=''
        document.getElementById('state').value=''
        document.getElementById('country').value=''
        document.getElementById('pin').value=''
          
          this.gethub()
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
let filterdata=this.state.hubdet.filter(val=>{

return(
  val.name.toLowerCase().includes(searchinput.toLowerCase()) ||
  val.gstin.toLowerCase().includes(searchinput.toLowerCase()) 
)
})
this.setState({
searchdata:filterdata
})
}


editdata(id,currentwarehouseid,e){

  let tempwarehouse=this.state.searchdata
  tempwarehouse.map((wh,ind)=>{
    if(id===ind){
      
      let tempaddress=(Object.values(wh.address).join()).split(',')
      
      this.setState({
    upindex:currentwarehouseid,    
    uname:wh.name,
    ugst:wh.gstin,
    uemail:wh.email,
    uphone:wh.phone,
    udoor:tempaddress[0],
    ustreet:tempaddress[1],
    uarea:tempaddress[2],
    ucity:tempaddress[3],
    ustate:tempaddress[4],
    upin:tempaddress[5],
    editmodal:!this.state.editmodal
      })
    }
  })

}

puthub=()=>{

  let updatewarehousewithid={

      name:this.state.uname,
      gstin:this.state.ugst,
      email:this.state.uemail,
      phone:this.state.uphone,
      address:{
        addressLine1:this.state.udoor,
        addressLine2:this.state.ustreet,
        addressLine3:this.state.uarea,
        city:this.state.ucity,
        state:this.state.ustate,
        pin:this.state.upin
      }

  }

axios.put(`http://localhost:8012/warehouse/${this.state.upindex}`,updatewarehousewithid).then(res=>{

console.log(res.data);

this.setState({
  editmodal:false,
  uname:'',
  ugst:'',
  uemail:'',
  uphone:'',
  udoor:'',
  ustreet:'',
  uarea:'',
  ucity:'',
  ustate:'',
  upin:'',
  upindex:-1,
},()=>{
  this.gethub()
})

})

}

    render() {
        return (
            <Container>
                <div className="App">
                    <br></br>
                    <Row>
                    <Col md="5">
                    <center><h5>ADD HUB</h5></center>
                    <Card>
                        <CardHeader>ENTER DETAIL</CardHeader>
                    <CardBody>
                
                <FormGroup row>
                
                <Label sm={3} for="name">NAME</Label>
                <Col sm={5}>  
                <Input id="name"   onChange={(e) => {
                  
                  this.setState({ name: e.target.value});
                }} />
                
                </Col>  
                </FormGroup>
              
                <FormGroup row>
                  <Label sm={3} for="gst">GST</Label>
                  <Col sm={5}>
                  <Input id="gst"  onChange={(e) => {
                  
                  this.setState({ gst: e.target.value});
                }} />
                  </Col>
                  
                </FormGroup>
                <FormGroup row>
                  <Label sm={3} for="email">EMAIL</Label>
                  <Col sm={5}>
                  <Input id="email" type="email" onChange={(e) => {
                    
                    this.setState({ email:e.target.value });
                  }} />
                  </Col>
                  
                </FormGroup>

                <FormGroup row>
                  <Label sm={3} for="phone">PHONE</Label>
                  <Col sm={5}>
                  <Input id="phone" onChange={(e) => {

                    this.setState({ phone:e.target.value });
                    }} />

                  </Col>
                 
                </FormGroup>
                
                <CardSubtitle className="mb-2 text-muted">ADDRESS</CardSubtitle>
                  
                <FormGroup row>
                  <Label sm={3} for="doorno">DOOR NO</Label>
                  <Col sm={5}>
                  <Input id="doorno"  onChange={(e) => {
                    
                    this.setState({ door:e.target.value });
                  }} />
                  </Col>
                  
                </FormGroup>
                <FormGroup row>
                  <Label sm={3} for="street">STREET</Label>
                  <Col sm={5}>
                  <Input id="street"  onChange={(e) => {

                    this.setState({ street: e.target.value});
                    }} />
                  </Col>
                  
                </FormGroup>
                <FormGroup row>
                  <Label sm={3} for="area">AREA</Label>
                  
                  <Col sm={5}>
                  <Input id="area"  onChange={(e) => {

                    this.setState({ area: e.target.value});
                    }} />
                  </Col>
                  
                </FormGroup>
                <FormGroup row>
                  <Label sm={3} for="city">CITY</Label>
                  <Col sm={5}>
                  <Input id="city"  onChange={(e) => {

                    this.setState({ city: e.target.value});
                    }} />
                  </Col>
                  
                </FormGroup>
                <FormGroup row>
                  <Label sm={3} for="state">STATE</Label>
                  <Col sm={5}>
                  <Input id="state"  onChange={(e) => {

                    this.setState({ state: e.target.value});
                    }} />
                  </Col>
                 
                </FormGroup>
                <FormGroup row>
                  <Label sm={3} for="country">COUNTRY</Label>
                  <Col sm={5}>
                  <Input id="country"  onChange={(e) => {

                    this.setState({ country: e.target.value});
                    }} />
                  </Col>
                 
                </FormGroup>
                <FormGroup row>
                  <Label sm={3} for="pin">PIN CODE</Label>
                  <Col sm={5}>
                  <Input id="pin"  onChange={(e) => {

                    this.setState({ pin: e.target.value});
                    }} />
                  </Col>

                </FormGroup>
                        </CardBody>
                        <CardFooter>
                            <center><Button color="success" onClick={()=>{
                              
                              if(this.state.name&&this.state.gst&&this.state.phone&&this.state.email&&this.state.door&&this.state.area&&this.state.street&&this.state.city&&this.state.state&&this.state.country&&this.state.pin)
                              {
                                this.setState({confirmmodal:true})
                              }
                            
                                else{
                                alert("Fill All details")
                                }
                              }
                            }  >ADD</Button></center>
                              
                        </CardFooter>
                    </Card>
                    </Col>
                    <Col md="1"></Col>
                    <Col md="6">
                    <center><h5>EDIT HUB</h5></center>
                      
                      <Card>
                        <CardHeader>ALL HUB</CardHeader>
                            <CardBody>
                            <b>Search</b>: <input
                            style={{ marginLeft: 5 }}
                            type="text"
                            placeholder="Type to search..."
                            value={this.state.searchinput}
                            onChange={e => this.handlesearch(e)}
                            />
                             <DeleteIcon onClick={()=>this.setState({searchinput:'',searchdata:this.state.hubdet})}></DeleteIcon>
        
                      {this.state.searchdata.length === 0 && <span>No records found!</span> }
                              {this.state.searchdata.map((h,ind)=>{
                                return(
                                  <>
                                  <Card>
                                  <CardBody>
                                  <Row><Col>NAME:{' '}<b>{h.name}</b></Col></Row>
                          <Row><Col>GST:{' '}<b>{h.gstin}</b></Col></Row>
                          <Row><Col>PHONE:{' '}<b>{h.phone}</b></Col></Row>
                          <Row><Col>EMAIL:{' '}<b>{h.email}</b></Col></Row>
                          <Row><Col>ADDRESS:{' '}<b>{Object.values(h.address).join()}</b></Col></Row>
                                  </CardBody>
                                  <CardFooter>
                                    <Button size="sm" color="primary" onClick={(e)=>this.editdata(ind,h.id,e)}>EDIT</Button>
                                  </CardFooter>
                                </Card>
                                <br></br>
                                </>
                                )
                              })}
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
                            </CardBody>
                      </Card>

                    </Col>
                    </Row>
                </div>
                    <Modal isOpen={this.state.confirmmodal} toggle={()=>this.setState({confirmmodal:false})}>
                    <ModalHeader toggle={()=>this.setState({confirmmodal:false})}>CONFIRM WAREHOUSE</ModalHeader>
                    <ModalBody>
                      <Card>
                        <CardBody>
                        <Row><Col>NAME:<b>{this.state.name}</b></Col></Row>
                        <Row><Col>GST:<b>{this.state.gst}</b></Col></Row>
                        <Row><Col>PHONE:<b>{this.state.phone}</b></Col></Row>
                        <Row><Col>EMAIL:<b>{this.state.email}</b></Col></Row>
                        <Row><Col>ADDRESS:<b>{this.state.door},{this.state.street},{this.state.area},{this.state.city},{this.state.state},{this.state.country}-{this.state.pin}</b></Col></Row>
                        </CardBody>
                      </Card>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="success" onClick={this.posthub}>CONFIRM</Button>
                      <Button color="danger" onClick={()=>this.setState({confirmmodal:false})}>CANCEL</Button>
                    </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.editmodal} toggle={()=>this.setState({editmodal:false})}>
                      <ModalHeader toggle={()=>this.setState({editmodal:false})}>EDIT</ModalHeader>
                      <ModalBody>
                      <Card>
            <CardBody>
                <FormGroup >
                
                <Label>NAME</Label>
                  
                  
                <Input id="name" value={this.state.uname}  onChange={(e) => {
                  
                  this.setState({ uname: e.target.value});
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
                  <Label for="pin">PIN CODE</Label>
                  <Input id="pin" value={this.state.upin} onChange={(e) => {

                    this.setState({ upin: e.target.value});
                  }} />
                </FormGroup>
                </CardBody>
                </Card>
            
                      </ModalBody>
                    <ModalFooter>
                      <Button color="success" onClick={this.puthub}>EDIT</Button>
                      <Button color="danger" onClick={()=>this.setState({editmodal:false})}>CLOSE</Button>
                    </ModalFooter>
                    </Modal>

            </Container>
            
        )
    }
}

export default Addhub
