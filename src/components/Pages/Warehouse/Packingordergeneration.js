import axios from 'axios';
import React, { Component } from 'react'
import { Container, FormGroup,Label,Row,Col, Input, Card, CardBody,CardTitle ,Table, Button, ModalBody, ModalHeader, ModalFooter,Modal} from 'reactstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import ReactToPrint from "react-to-print";

class Packingordergeneration extends Component {
    constructor(props){
        super(props);
        this.state={
            procprod:[],
            selectprod:'',
            selectbcode:'',
            selectvariantlist:[],
            selectvariant:'',
            quantity:0,
            tabledata:[],
            printmodal:false,
            chk:false


        }
    }

    componentDidMount(){
        this.getproduct()
    }
    
    getproduct(){
        axios.get('http://localhost:8011/pack').then(res=>{
                this.setState({
                    procprod:res.data
                })
        })
    }
    choosenproduct(e){

        let tempprod=this.state.procprod.filter(it=> it.productGroupName===e.target.value)
        console.log('filter',tempprod)
        let tempvar=[]
        let tempbcode=''
        tempprod.map(it=>{
            tempbcode=it.batchCode
            it.products.map(vr=>{
                tempvar.push(vr.quantity+' '+vr.unit)
            })
           
        })
        console.log('variant',tempvar,'bcode',tempbcode)

        this.setState({
            selectprod:e.target.value,
            selectbcode:tempbcode,
            selectvariantlist:tempvar
        })
    }

    datatotable=()=>{
        let temptable={
            name:this.state.selectprod,
            bcode:this.state.selectbcode,
            variant:this.state.selectvariant,
            package:this.state.quantity
        }
        this.setState({
            tabledata:[...this.state.tabledata,temptable],
            selectprod:'',
            selectbcode:'',
            selectvariantlist:[],
            selectvariant:'',
            quantity:0,

        })
        document.getElementById('productname').value=''

    }

    deletefromtable(index){
        let tempdel=this.state.tabledata
        tempdel.splice(index,1)
        this.setState({
            tabledata:tempdel
        })
    }

    deleteprinted(){
        this.setState({
            tabledata:[],
            printmodal:false,
            chk:false
            
        })
    }

    render() {
        return (
            <Container>
                <div className="App">
                    <center><h3>PACKING ORDER GENERATION</h3></center>
                    <br></br>
                    <Card>
                    <CardBody>
                    <CardTitle tag="h6">DAILY PACKING ALLOTMENT</CardTitle>  
                    <br></br>
                    <FormGroup row>
                        <Label for="productname" sm={2}>PRODUCT NAME</Label>
                        <Col sm={5}>
                            <select id="productname" onChange={(e)=>this.choosenproduct(e)} >
                                <option value=""></option>
                                {this.state.procprod.map((pr,ind)=>{
                                    return(
                                        <option value={pr.productGroupName}>{pr.productGroupName}</option>
                                    )
                                })}
                            </select>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="batchcode" sm={2}>BATCH CODE</Label>
                        <Col sm={2}>
                            <Input id="batchcode" value={this.state.selectbcode} />
                        </Col>
                    </FormGroup>
                    {this.state.selectprod.length>0?
                    (
                    <FormGroup row>
                        <Label for="productvariant" sm={2}>VARIANT</Label>
                        <Col sm={5}>
                            <select id="productvariant" onChange={(e)=>this.setState({selectvariant:e.target.value})}>
                                <option value=""></option>
                                {this.state.selectvariantlist.map(vr=>{
                                    return(
                                        <option value={vr}>{vr}</option>
                                    )
                                })}
                            </select>
                            
                        </Col>
                    </FormGroup>
                ):(<></>)}
                    {this.state.selectvariant.length>0 && this.state.selectprod.length>0?
                    (
                    <FormGroup row>
                        <Label for="quantity" sm={2}>QUANTITY</Label>
                        <Col sm={2}>
                            <Input id="quantity" placeholder="Enter Quantity" onChange={(e)=>{
                                if(e.target.value==='')
                                {
                                    this.setState({
                                        quantity:0
                                    })
                                }
                                else{
                                    this.setState({
                                        quantity:parseFloat(e.target.value)
                                    })
                                }
                            
                            }}/>
                        </Col>
                       <Button color="primary" onClick={this.datatotable}>ADD</Button>     
                    </FormGroup>
                    
                    ):(<></>)}
                    
                    </CardBody>
                    </Card>
                    <br></br>
                    <Card>
                        <CardBody>
                            <CardTitle tag="h6">CHECK PACKING ORDER</CardTitle>
                            <Table size="sm">
                        <thead>
                            <tr>
                                <th>SNo</th>
                                <th>Product Name</th>
                                <th>Batch Code</th>
                                <th>Variant</th>
                                <th>Quantity</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.tabledata.map((td,ind)=>{
                                return(
                                    <tr key={ind}>
                                        <td>{ind+1}</td>
                                        <td>{td.name}</td>
                                        <td>{td.bcode}</td>
                                        <td>{td.variant}</td>
                                        <td>{td.package}</td>
                                        <td><DeleteIcon onClick={()=>this.deletefromtable(ind)}/></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                        <center><Button color="success" size="sm" onClick={()=>this.setState({printmodal:true})}>PRINT</Button></center>
                        </CardBody>
                    </Card>
                   <Modal isOpen={this.state.printmodal} toggle={()=>{this.setState({printmodal:!this.state.printmodal})}}>
                       <ModalHeader toggle={()=>{this.setState({printmodal:!this.state.printmodal})}}>PACKING ORDER</ModalHeader>
                       <ModalBody>
                        <ComponentToPrint
                ref={(el) => (this.componentRef = el)}
                data={this.state.tabledata}
                        />
                       </ModalBody>
                       <ModalFooter>
              <Row>
              <Col>
              <ReactToPrint
                trigger={() => <Button>Print</Button>}
                content={() => this.componentRef}
              />
              </Col>
              <Col >
              <Input type="checkbox" onClick={()=>{this.setState({chk:!this.state.chk})}}/>{' '}
                PRINTED</Col>
                <Col>
              {this.state.chk?(
              <Button color="danger" onClick={() => this.deleteprinted()}>
                Close
              </Button>
              ):(<h1>{''}</h1>)}
              </Col>
              </Row>
            </ModalFooter>
                   </Modal>
                </div>
    
            </Container>
            )
    }
}

class ComponentToPrint extends Component {
    constructor(props) {
      super(props);
      this.state = {
        tabledata: this.props.data
      };
    
    }
  
    render() {
      return (
        <Table>
        <thead>
            <tr>
                <th>SNo</th>
                <th>Product Name</th>
                <th>Batch Code</th>
                <th>Variant</th>
                <th>Quantity</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
      
          {this.state.tabledata.map((td,ind)=>{
                                return(
                                    <tr key={ind}>
                                        <td>{ind+1}</td>
                                        <td>{td.name}</td>
                                        <td>{td.bcode}</td>
                                        <td>{td.variant}</td>
                                        <td>{td.package}</td>
                                      </tr>
                                )
                            })}
        </tbody>
        </Table>
                                  
          
       
     );
    }
  }
  

export default Packingordergeneration
