import axios from 'axios';
import React, { Component } from 'react'
import { Button, Card, CardBody, CardTitle, Container, Modal, ModalBody, ModalFooter, ModalHeader, Table,Row,Col, Input } from 'reactstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import ReactPaginate from 'react-paginate';
import './pagination.css'





class Packingprocess extends Component {

    constructor(props){
        super(props);
        this.state={
            packingdata:[],
            addpackopen:false,
            variantname:'',
            variantquantity:0,
            variantunit:'',
            variantid:0,
            selectedstock:0,
            selectedprod:'',
            postquantity:0,
            tempvariants:[],
            tempunit:'',
            confirmpriceopen:false,
            procuredprodid:0,
            prodgrpId:0,

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
        this.getpackingdata()
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
  
    const data=this.state.packingdata
  
    const split=data.slice(this.state.offset,this.state.offset+this.state.perpage)
  
    this.setState({
  
      pagecount:Math.ceil(data.length/this.state.perpage),
      searchdata:split
  
    })
  
  }
  
  
  

    toggleaddpackmodal(stock,prodname,variants,unit,procid,prodid){
        this.setState({
            selectedstock:stock,
            selectedprod:prodname,
            tempvariants:variants,
            tempunit:unit,
            procuredprodid:procid,
            prodgrpId:prodid,
            addpackopen:!this.state.addpackopen
        })
    }

    getpackingdata(){
        axios.get('http://localhost:8011/pack').then(res=>{
            console.log(res.data)

            var split=res.data.slice(this.state.offset, this.state.offset + this.state.perpage)


            this.setState({
                packingdata:res.data,
                searchdata:split,
                pagecount:Math.ceil(res.data.length/this.state.perpage)
            })
        })
        
    }

    selectedvariant(val){
        let a=[]
        a=val.split(' ')
        this.setState({
            variantquantity:a[0],
            variantname:a[0]+' '+a[1],
            variantunit:a[1],
            variantid:a[2]
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
            effectiveStock:this.state.postquantity,
            warehouseUnpackedStockId:this.state.procuredprodid,
            productId:this.state.variantid
        }
        axios.post('http://localhost:8012/packpending',warehousepack).then(res=>{
            console.log('posted',res.data)
        
            this.setState({
                addpackopen:false,
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
                prodgrpId:0,
                variantid:0,

                searchdata:[],
                searchinput:'',
                offset:0,
                perpage:5,
                currentpage:0,
                pagecount:0
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
  let filterdata=this.state.packingdata.filter(val=>{
  
  return(
    val.productGroupName.toLowerCase().includes(searchinput.toLowerCase()) ||
    val.batchCode.toLowerCase().includes(searchinput.toLowerCase()) 
  )
  
  })
  this.setState({
  searchdata:filterdata
  })
  }
  


    render() {
        return (
            <Container>
                <div className="App">
                    <center><h3>PACKING PROCESS</h3></center>
                    <br></br>
                    <b>Search</b>: <input
        style={{ marginLeft: 5 }}
        type="text"
        placeholder="Type to search..."
        value={this.state.searchinput}
        onChange={e => this.handlesearch(e)}
      
        />
        <DeleteIcon onClick={()=>this.setState({searchinput:'',searchdata:this.state.packingdata})}></DeleteIcon>


        
            {this.state.searchdata.length === 0 && <span>No records found!</span> }
            
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
                            {this.state.searchdata.map((pd,ind)=>{
                                
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
                                        
                                        
                                        <td><Button color="primary" onClick={()=>this.toggleaddpackmodal(pd.stock,pd.productGroupName,pd.products,pd.unit,pd.procuredProductId,pd.productGroupId)}>ADD</Button></td>
                                    </tr>
                                )
                            })}
                            <tr>

                            </tr>
                        </tbody>

                    </Table>
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


                    <Modal size="lg" isOpen={this.state.addpackopen} toggle={()=>{this.setState({addpackopen:false,tempvariants:[],variantname:'',variantquantity:0,tempunit:'',variantunit:'',variantid:0})}}>
                        <ModalHeader toggle={()=>{this.setState({addpackopen:false,tempvariants:[],variantname:'',variantquantity:0,tempunit:'',variantunit:'',variantid:0})}}>
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
                                                    <option value={pr.quantity+' '+pr.unit+' '+pr.id}>{pr.quantity+' '+pr.unit}</option>
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
                            <Button size="sm" color="danger" onClick={()=>{this.setState({addpackopen:false,tempvariants:[],variantname:'',variantquantity:0,tempunit:'',variantunit:'',variantid:0})}} >CANCEL</Button>
                            
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
