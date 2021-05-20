import axios from 'axios';
import React, { Component } from 'react'
import { Button, Card, CardBody, CardTitle, Container, Modal, ModalBody, ModalFooter, ModalHeader, Table,Row,Col, Input } from 'reactstrap';
import DeleteIcon from '@material-ui/icons/Delete';




class Packingprocess extends Component {

    constructor(props){
        super(props);
        this.state={
            packingdata:[],
            addpriceopen:false,
            variantname:'',
            variantquantity:0,
            variantunit:'',
            selectedstock:0,
            selectedprod:'',
            postquantity:0,
            tempvariants:[],
            tempunit:'',
            confirmpriceopen:false,
            procuredprodid:0,
            prodgrpid:0
        }

    }
    componentDidMount(){
        this.getpackingdata()
    }

    toggleaddpricemodal(stock,prodname,variants,unit,procid,prodid){
        this.setState({
            selectedstock:stock,
            selectedprod:prodname,
            tempvariants:variants,
            tempunit:unit,
            procuredprodid:procid,
            prodgrpid:prodid,
            addpriceopen:!this.state.addpriceopen
        })
    }

    getpackingdata(){
        axios.get('http://localhost:8011/pack').then(res=>{
            console.log(res.data)

            this.setState({
                packingdata:res.data
            })
        })
        
    }

    selectedvariant(val){
        let a=[]
        a=val.split(' ')
        this.setState({
            variantquantity:a[0],
            variantname:val,
            variantunit:a[1]
        })

    }

    deletepack=()=>{
        this.setState({
            postquantity:0
        })
        
        document.getElementById('package').value=''
    }

    confirmpack(){
        if(this.state.postquantity>0)
        this.setState({
            confirmpriceopen:!this.state.confirmpriceopen
        })
    }

    postpack=()=>{
        const warehousepack={
            timestamp:null,
            effectiveStock:this.state.postquantity,
            warehouseUnpackedStockId:this.state.procuredprodid,
            productId:this.state.prodgrpid
        }
        axios.post('http://localhost:8012/packpending',warehousepack).then(res=>{
            console.log('posted',res.data)
        
            this.setState({
                addpriceopen:false,
                variantname:'',
                variantquantity:0,
                variantunit:'',
                selectedstock:0,
                selectedprod:'',
                postquantity:0,
                tempvariants:[],
                tempunit:'',
                confirmpriceopen:false,
                procuredprodid:0,
                prodgrpid:0
            })

        })

    }

    render() {
        return (
            <Container>
                <div className="App">
                    <center><h3>PACKING PROCESS</h3></center>
                    <br></br>
                    <Table hover>
                        <thead>
                            <tr>
                                <th>Sno</th>
                                <th>Batch Code</th>
                                <th>Product Name</th>
                                <th>Stock</th>
                                <th>Unit</th>
                                <th>Variants</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.packingdata.map((pd,ind)=>{
                                
                                return(
                                    <tr key={ind}>
                                        <td>{ind+1}</td>
                                        <td>{pd.batchCode}</td>
                                        <td>{pd.productGroupName}</td>
                                        <td>{pd.stock}</td>
                                        <td>{pd.unit}</td>
                                        <td>
                                       
                                        {pd.products.map((pr,i)=>{
                                            
                                            return(
                                                <li>{pr.quantity+pr.unit}</li>
                                                )
                                        })}
                                        
                                                    
                                       
                                        </td>
                                        
                                        
                                        <td><Button color="primary" onClick={()=>this.toggleaddpricemodal(pd.stock,pd.productGroupName,pd.products,pd.unit,pd.procuredProductId,pd.productGroupId)}>ADD</Button></td>
                                    </tr>
                                )
                            })}
                            <tr>

                            </tr>
                        </tbody>

                    </Table>
                    <Modal size="lg" isOpen={this.state.addpriceopen} toggle={()=>{this.setState({addpriceopen:false,tempvariants:[],variantname:'',variantquantity:0,tempunit:'',variantunit:''})}}>
                        <ModalHeader toggle={()=>{this.setState({addpriceopen:false,tempvariants:[],variantname:'',variantquantity:0,tempunit:'',variantunit:''})}}>
                            ADD PACKING
                        </ModalHeader>
                        <ModalBody>
                            <Card>
                                <CardBody>
                                
                                    <Row><Col sm={8}>PRODUCT NAME: <b>{this.state.selectedprod}</b></Col></Row>
                                   
                                    <Row><Col sm={8}>STOCK AVAILABLE: <b>{this.state.selectedstock}</b></Col></Row>
                                    
                                    <Row><Col sm={8}>VARIANT: {' '}
                                    
                                        <select id="packingvariant" onChange={(e)=>this.selectedvariant(e.target.value)}>
                                            <option value=""></option>
                                            {this.state.tempvariants.map(pr=>{
                                                return(
                                                    <option value={pr.quantity+' '+pr.unit}>{pr.quantity+' '+pr.unit}</option>
                                                )
                                            })}
                                        
                                        </select></Col></Row>
                                    <br></br>
                                    {this.state.variantquantity>0?( <Row>{' '}<b>{this.state.variantname}</b> PACKAGE:{' '}
                                    <Col sm={3} >
                                    <Input id="package" placeholder="Enter Quantity" onChange={(e)=>{

                                        if(e.target.value==='')
                                        {
                                            this.setState({
                                                postquantity:0
                                            })

                                        }
                                        else{

                                            if(this.state.variantunit===this.state.tempunit){
                                                if(parseFloat(e.target.value)*parseFloat(this.state.variantquantity)<=this.state.selectedstock)
                                                {
                                                    this.setState({
                                                        postquantity:parseFloat(e.target.value)
                                                    })
                                                }
                                                else{
                                                    alert('Stock Unavailable')
                                                    document.getElementById('package').value=''

                                                }
                                                
                                            }
                                            else{
                                                if((parseFloat(e.target.value)*parseFloat(this.state.variantquantity))/1000<=this.state.selectedstock)
                                                {   
                                                    this.setState({
                                                        postquantity:parseFloat(e.target.value)
                                                    })

                                                }
                                                else{
                                                    alert('Stock Unavailable')
                                                    document.getElementById('package').value=''

                                                }
                                            }
                                        }

                                        }
                                        }/>
                                        </Col>
                                        <Col><DeleteIcon onClick={this.deletepack}/></Col>
                                     </Row>):(<></>)}
                                   
                                    
                                </CardBody>
                            </Card>
                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="success" onClick={()=>this.confirmpack()}>PACK</Button>
                            <Button size="sm" color="danger" onClick={()=>{this.setState({addpriceopen:false,tempvariants:[],variantname:'',variantquantity:0,tempunit:'',variantunit:''})}} >CANCEL</Button>
                            
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.confirmpriceopen} toggle={()=>this.confirmpack()}>
                        <ModalHeader  toggle={()=>this.confirmpack()}> CONFIRM PACKING</ModalHeader>
                            <ModalBody >
                                <Card>
                                <CardBody>
                                <Row><Col sm={8}>PRODUCT NAME: <b>{this.state.selectedprod}</b></Col></Row>
                                <Row><Col sm={8}>VARIANT: <b>{this.state.variantname}</b></Col></Row>
                                <Row><Col sm={10}>PACKING QUANTITY:<b>{this.state.postquantity}</b></Col></Row>
                                    
                                </CardBody>
                                </Card>
                                   
                                   
                            </ModalBody>
                            <ModalFooter>
                                <Button color='success' size="sm" onClick={this.postpack}>CONFIRM</Button>
                                <Button color='danger' size="sm" onClick={()=>this.confirmpack()}>CANCEL</Button>
                            </ModalFooter>
                       
                    </Modal>
                
                </div>

            </Container>
            
        )
    }
}

export default Packingprocess
