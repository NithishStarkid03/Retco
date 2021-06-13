import axios from 'axios'
import React, { Component } from 'react'
import { Card, CardBody, CardFooter, CardHeader, Container,Button, Row, Col, Table, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap'
import ReactPaginate from 'react-paginate';
import './pagination.css';
import DeleteIcon from '@material-ui/icons/Delete';

 class Customerorder extends Component {
    
    constructor(props){
        super(props)
        this.state={
            customerorder:[],
            baseurl:'http://retco-server.us-east-1.elasticbeanstalk.com/api',
            selectedprodid:0,
            updateunitmodal:false,
            cancelconfirmmodal:false,
            proddetail:'',
            updateunit:0,
            dispatchconfirm:false,
            deliverconfirm:false,
            orderid:0,

            searchdata:[],
            searchinput:'',
            offset:0,
            perpage:2,
            currentpage:0,
            pagecount:0
        }
        this.handlePageClick = this.handlePageClick.bind(this);
        
        
    }
    componentDidMount(){
        this.getorders()
    }
   
    getorders(){

        axios.get('http://localhost:8024/customerorder').then(res=>{
            console.log(res.data)

            let temp=[]
            temp=res.data
            var split=temp.slice(this.state.offset, this.state.offset + this.state.perpage)



            this.setState({
                customerorder:res.data,
                pagecount:Math.ceil(temp.length/this.state.perpage),
                searchdata:split

            })
        })

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
      
        const data=this.state.customerorder
      
        const split=data.slice(this.state.offset,this.state.offset+this.state.perpage)
      
        this.setState({
      
          pagecount:Math.ceil(data.length/this.state.perpage),
          searchdata:split
      
        })
      
      }

      handlesearch=(e)=>{
        this.setState({searchinput:e.target.value},()=>{
      
      
          this.globalsearch();
      
        })
      }
      
      globalsearch=()=>{
      
      let searchinput=this.state.searchinput;
      let filterdata=this.state.customerorder.filter(val=>{
      
      return(
        
        val.orderedTimestamp.substring(0,10).split('-').reverse().join('-').toLowerCase().includes(searchinput.toLowerCase())
      )

      })
      this.setState({
      searchdata:filterdata
      })
      }



    cancelprod=()=>{

        axios.put(`${this.state.baseurl}/customer/order/product/cancel/${this.state.selectedprodid}`).then(res=>{
            console.log('CANCELEDD',res.data)

            this.setState({
                selectedprodid:0,
                cancelconfirmmodal:false,
                proddetail:''
            })
        })

    }
    updateprod=()=>{
        axios.put(`${this.state.baseurl}/customer/order/product/update/${this.state.selectedprodid}/${this.state.updateunit}`).then(res=>{
            console.log('UPDATED',res.data)
        this.setState({
            updateunitmodal:false,
            selectedprodid:0,
            updateunit:0,
            proddetail:''
        })
    })
}

putdispatch=()=>{
    axios.put(`${this.state.baseurl}/customer/order/dispatch/${this.state.orderid}`).then(res=>{
        console.log('DISPATCHED',res.data)

        this.setState({
            orderid:0,
            dispatchconfirm:false,
        })
    })   
}

putdeliver=()=>{
    axios.put(`${this.state.baseurl}/customer/order/deliver/${this.state.orderid}`).then(res=>{
        console.log('DELIVERED',res.data)

        this.setState({
            orderid:0,
            deliverconfirm:false,
        })
    })   
}



   

    render() {
        
        return (
           <Container>
               <div className="App">
                   <center><h4>CUSTOMER ORDER</h4></center>
                   <Row>
                            <b>Search</b>: <input
                        style={{ marginLeft: 5 }}
                        type="text"
                        placeholder="Type to search..."
                        value={this.state.searchinput}
                        onChange={e => this.handlesearch(e)}
                    
                        />
                        <DeleteIcon onClick={()=>this.setState({searchinput:'',searchdata:this.state.customerorder})}></DeleteIcon>
                        {this.state.searchdata.length === 0 && <span>No records found!</span> }
                        </Row>
                        <br></br>
                   {this.state.searchdata.map((ord,ind)=>{
                       return(
                           <>
                           <Card>
                               <CardHeader>
                                   <Row>
                                       <Col><b>ORDER ID:</b> {ord.id}</Col>
                                   </Row>
                                   <Row>
                                       <Col><b>ORDERED DATE:</b> {ord.orderedTimestamp.substring(0,10).split('-').reverse().join('-')}</Col>
                                   </Row>
                               </CardHeader>
                               <CardBody>
                                   <Row>
                                    <Col>
                                    <Card>
                                        <CardHeader><b>BILLING STATUS</b></CardHeader>
                                        <CardBody>
                                        <Row>
                                            <Col><b>MODE OF PAYMENT:</b> {ord.customerOrderPayment.modeOfPayment}</Col>
                                        </Row>    
                                        <Row>
                                            <Col><b>PAID AMOUNT:</b> {ord.customerOrderPayment.amount}</Col>
                                        </Row>
                                        <Row>    
                                            <Col><b>PAID DATE:</b> {ord.customerOrderPayment.paidTimestamp.substring(0,10).split('-').reverse().join('-')}</Col>
                                        </Row>
                                        <Row>
                                            <Col><b>BILLING ADDRESS:</b> {Object.values(ord.customerOrderPayment.billingAddress).join()}</Col> 
                                        </Row>
                                        </CardBody>
                                    </Card>
                                    </Col>

                                    <Col>
                                    <Card>
                                        <CardHeader><b>DELIVERY ADDRESS</b></CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col>{Object.values(ord.customerOrderFulfillment.deliveryAddress).join()}</Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                    </Col>

                                   </Row>
                                   <br></br>
                                   <Row>
                                       <Col><b>ORDERED PRODUCTS:</b></Col>
                                       <Table hover>
                                           <thead>
                                               <tr>
                                                   <th>SNo</th>
                                                   <th>BATCHCODE</th>
                                                   <th>PRODUCT NAME</th>
                                                   <th>VARIANT</th>
                                                   <th>UNITS ORDERED</th>
                                                   <th></th>
                                               </tr>
                                           </thead>
                                           <tbody>
                                            {ord.orderedProducts.map((prod,i)=>{
                                                return(
                                                    <tr>
                                                        <td>{i+1}</td>
                                                        <td>{prod.batchCode}</td>
                                                        <td>{prod.productName}</td>
                                                        <td>{prod.quantity+' '+prod.measurementUnit}</td>
                                                        <td>{prod.units}</td>
                                                        <td><Button size="sm" color="danger" onClick={()=>this.setState({selectedprodid:prod.id,cancelconfirmmodal:true,proddetail:prod.batchCode+' '+prod.productName})}>CANCEL</Button>{' '}
                                                        <Button size="sm" color="primary" onClick={()=>this.setState({
                                                            selectedprodid:prod.id,updateunitmodal:true,proddetail:prod.batchCode+' '+prod.productName+' '+prod.quantity+prod.measurementUnit+' '+prod.units+'UNITS'
                                                        })}>UPDATE</Button></td>
                                                    </tr>
                                                )
                                            })}
                                           </tbody>
                                       </Table>
                                   </Row>
                               </CardBody>
                               <CardFooter>
                                   {ord.customerOrderFulfillment.status==='ORDERED'?(<Button size="sm" color="primary" onClick={()=>this.setState({dispatchconfirm:true,orderid:ord.id})}>DISPATCH</Button>):(<></>)}
                                   {ord.customerOrderFulfillment.status==='DISPATCHED'?(<Button size="sm" color="primary" onClick={()=>this.setState({deliverconfirm:true,orderid:ord.id})}>DELIVERED</Button>):(<></>)} 
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

                   <Modal isOpen={this.state.cancelconfirmmodal} toggle={()=>this.setState({cancelconfirmmodal:false,selectedprodid:0,proddetail:''})}>
                       <ModalHeader toggle={()=>this.setState({cancelconfirmmodal:false,selectedprodid:0,proddetail:''})}>CANCEL CONFIRM</ModalHeader>
                       <ModalBody>
                        Do you want to cancel {this.state.proddetail}?
                       </ModalBody>
                       <ModalFooter>
                           <Button size="sm" color="success" onClick={this.cancelprod}>CONFIRM</Button>
                           <Button size="sm" color="danger" onClick={()=>this.setState({cancelconfirmmodal:false,selectedprodid:0,proddetail:''})}>CLOSE</Button>
                       </ModalFooter>
                   </Modal>

                   <Modal size="lg" isOpen={this.state.updateunitmodal} toggle={()=>this.setState({updateunitmodal:false,selectedprodid:0,proddetail:'',updateunit:0})}>
                       <ModalHeader toggle={()=>this.setState({cancelconfirmmodal:false,selectedprodid:0,proddetail:'',updateunit:0})}>UPDATE CONFIRM</ModalHeader>
                       <ModalBody>
                        <FormGroup row>
                        <Label sm={3}>ENTER UNIT</Label>
                        <Col sm={3}>
                        <Input id="updateunit" onChange={(e)=>{
                            if(e.target.value===''){
                                this.setState({
                                    updateunit:0
                                })
                            }
                            else{
                                this.setState({
                                    updateunit:parseFloat(e.target.value)
                                })
                            }
                        }}/>
                        </Col>
                        </FormGroup>
                        <Row>
                            <Col sm={8}>
                            PRODUCT DETAIL:{this.state.proddetail}  
                            </Col>
                            <Col>
                            UPDATED UNIT:{this.state.updateunit}
                            </Col>
                        </Row>
                       </ModalBody>
                       <ModalFooter>
                           <Button size="sm" color="success" onClick={this.updateprod}>CONFIRM</Button>
                           <Button size="sm" color="danger" onClick={()=>this.setState({updateunitmodal:false,selectedprodid:0,proddetail:'',updateunit:0})}>CLOSE</Button>
                       </ModalFooter>
                   </Modal>

                   <Modal isOpen={this.state.dispatchconfirm} toggle={()=>this.setState({orderedid:0,dispatchconfirm:false})}>
                       <ModalHeader toggle={()=>this.setState({orderedid:0,dispatchconfirm:false})}>CONFIRM DIPATCH</ModalHeader>
                       <ModalBody>
                           Do you want to dispatch order {this.state.orderid}?
                       </ModalBody>
                       <ModalFooter>
                           <Button size="sm" color="success" onClick={this.putdispatch}>CONFIRM</Button>
                           <Button size="sm" color="danger" onClick={()=>this.setState({orderedid:0,dispatchconfirm:false})}>CLOSE</Button>
                           
                       </ModalFooter>
                   </Modal>

                   <Modal isOpen={this.state.deliverconfirm} toggle={()=>this.setState({orderedid:0,deliverconfirm:false})}>
                       <ModalHeader toggle={()=>this.setState({orderedid:0,deliverconfirm:false})}>CONFIRM DELIVER</ModalHeader>
                       <ModalBody>
                       ORDER {this.state.orderid} is Delivered!
                       </ModalBody>
                       <ModalFooter>
                           <Button size="sm" color="success" onClick={this.putdeliver}>CONFIRM</Button>
                           <Button size="sm" color="danger" onClick={()=>this.setState({orderedid:0,deliverconfirm:false})}>CLOSE</Button>
                       </ModalFooter>
                   </Modal>
               </div>
           </Container>
        )
    }
}

export default Customerorder
