import axios from 'axios';
import React, { Component } from 'react';
import { Row,Col,CardBody, CardHeader, Container ,Card, CardFooter, Button, Table, Label, CardSubtitle, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Form} from 'reactstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import ReactPaginate from 'react-paginate';
import './pagination.css';


 class Orderstatus extends Component {
     constructor(props){
         super(props);
         this.state={
             order:[],
             selectorderid:0,
             cancelconfirm:false,
             recieveconfirm:false,
             tempproducts:[],
             
             recievedorder:[],
             checkrecievedorder:false,
             updatestock:[],
             displayupdatestock:[],

             updatestockid:0,
             inputunitmodal:false,
             unit:0,

             tempcheckselect:[],
             displaybatchcode:'',

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
         this.getorder()
     }
     getorder(){
         axios.get('http://localhost:8022/orderstatus').then(res=>{
             console.log(res.data)

             let temp=[]
             temp=res.data
             var split=temp.slice(this.state.offset, this.state.offset + this.state.perpage)
 

             this.setState({
                 order:res.data,
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
      
        const data=this.state.order
      
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
      let filterdata=this.state.order.filter(val=>{
      
      return(
        val.status.toLowerCase().includes(searchinput.toLowerCase()) ||
        val.orderedTimestamp.substring(0,10).split('-').reverse().join('-').toLowerCase().includes(searchinput.toLowerCase())
      )

      })
      this.setState({
      searchdata:filterdata
      })
      }



     cancelconfirmmodal(id,products)
     {
         this.setState({
             cancelconfirm:!this.state.cancelconfirm,
             selectorderid:id,
             tempproducts:products
            })
        }
     
     recieveconfirmmodal(id,products)
     {
         this.setState({
             recieveconfirm:!this.state.recieveconfirm,
             selectorderid:id,
             tempproducts:products
            })
        }

     cancelorder(){

        //put req with id /order/cancel
       /* axios.put(`url${this.state.selectorderid}`).then(res=>{

       })*/
        alert('Cancelled Order',this.state.selectorderid)
        this.setState({
            selectorderid:0,
            cancelconfirm:false
        })

     }
     receiveorder(){
          //put req with id for PUT /api/hub/order/deliver/{id}
       /* axios.put(`url${this.state.selectorderid}`).then(res=>{

        use response for updating [
                            {
                                "hubStockId": 0,
                                "units": 0
                            }
                            ]
                        then use this to update recieved stock PUT /api/hub/order/receive/{id}

       })*/

       axios.get('http://localhost:8023/allottedBatchList').then(res=>{
           console.log('ipodhiku idhu thaa response',res.data)

           this.setState({
                recievedorder:res.data,
               checkrecievedorder:true
           })
       })
     }

     unitinputmodal(id,bcode,ind){
         if(this.state.tempcheckselect.includes(ind)){
             alert('Already added')
         }
         else{

            this.setState({
                updatestockid:id,
                inputunitmodal:true,
                tempcheckselect:[...this.state.tempcheckselect,(ind)],
                displaybatchcode:bcode
            })
    
    
         }
        console.log('id',id,'chk',this.state.tempcheckselect)
     }



     unitrecieved(){

       
        const temporder=this.state.recievedorder.filter(i=>i.id===this.state.updatestockid)
            console.log('filter',temporder)
        let tempdisplay={}
        let temprecievedunits={}
        temporder.map(tmp=>{
            tempdisplay={
                batchCode:tmp.batchCode,
                productGroupName:tmp.productGroupName,
                variant:tmp.quantity+' '+tmp.measurementUnit,
                unitsallotted:tmp.allottedStock,
                units:this.state.unit

            }
            console.log('fake',tempdisplay)
            temprecievedunits={
                hubStockId:tmp.id,
                units:this.state.unit
            }
            console.log('original',temprecievedunits)
        })

        this.setState({
            displayupdatestock:[...this.state.displayupdatestock,tempdisplay],
            updatestock:[...this.state.updatestock,temprecievedunits],
            inputunitmodal:false
        })

        document.getElementById('unit').value=''

     }

     deletebatch(ind){
         let temp1=this.state.updatestock
         let temp2=this.state.displayupdatestock
         temp1.splice(ind,1)
         temp2.splice(ind,1)
         this.setState({
             updatestock:temp1,
             displayupdatestock:temp2,
             tempcheckselect:this.state.tempcheckselect.splice(ind+1,1)
         })
     }

     putrecievedorder=()=>{
         //axios.put()

         if(this.state.updatestock.length===this.state.recievedorder.length){

         
         alert('put')

         console.log('ans',this.state.updatestock)

         this.setState({
            selectorderid:0,
            cancelconfirm:false,
            recieveconfirm:false,
            tempproducts:[],
            
            recievedorder:[],
            checkrecievedorder:false,
            updatestock:[],
            displayupdatestock:[],

            updatestockid:0,
            inputunitmodal:false,
            unit:0,

            tempcheckselect:[],
            displaybatchcode:''
         })

     }
     else{
         alert('Fill all detail')
     }
    }
    render() {
        return (
            <Container>
                <div className="App">
                    <center><h4>ORDER STATUS</h4></center>
                    <br></br>
                    <Row>
                            <b>Search</b>: <input
                        style={{ marginLeft: 5 }}
                        type="text"
                        placeholder="Type to search..."
                        value={this.state.searchinput}
                        onChange={e => this.handlesearch(e)}
                    
                        />
                        <DeleteIcon onClick={()=>this.setState({searchinput:'',searchdata:this.state.order})}></DeleteIcon>
                        {this.state.searchdata.length === 0 && <span>No records found!</span> }
                        </Row>
                        <br></br>
                    {this.state.searchdata.map((ord,ind)=>{
                        return(
                        <>
                        <Card>
                        <CardHeader>
                           <b>WAREHOUSE STATUS:</b>{ord.status}
                           <Row><Col><b>ORDER ID:{ord.id}</b></Col></Row>
                            <Row><Col><b>ORDER DATE:</b>{' '}{ord.orderedTimestamp.substring(0,10).split('-').reverse().join('-')}</Col></Row>
                            </CardHeader>
                        <CardBody>
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>SNo</th>
                                        <th>PRODUCT NAME</th>
                                        <th>VARIANT</th>
                                        <th>UNITS ORDERED</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {ord.orderedProducts.map((pr,i)=>{
                                        return(
                                            <tr>
                                                <td>{i+1}</td>
                                                <td>{pr.productGroupName}</td>
                                                <td>{pr.quantity+' '+pr.measurementUnit}</td>
                                                <td>{pr.units}</td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                               
                            </Table>
                        </CardBody>
                        <CardFooter>
                            {ord.status==="DELIVERED"?(<Button size="sm" color="success" onClick={()=>this.recieveconfirmmodal(ord.id,ord.orderedProducts)}>RECEIVED</Button>):(<Button size="sm" color="danger" onClick={()=>this.cancelconfirmmodal(ord.id,ord.orderedProducts)}>CANCEL</Button>)}
                           
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

                    <Modal isOpen={this.state.cancelconfirm} toggle={()=>this.setState({cancelconfirm:false,selectorderid:0,tempproducts:[]})}>
                        <ModalHeader toggle={()=>this.setState({cancelconfirm:false,selectorderid:0,tempproducts:[]})}>CONFIRM CANCEL</ModalHeader>
                        <ModalBody>
                            Do you want to cancel order: {this.state.selectorderid}
                            <br></br>
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>SNo</th>
                                        <th>PRODUCT NAME</th>
                                        <th>VARIANT</th>
                                        <th>UNITS ORDERED</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.tempproducts.map((pr,i)=>{
                                        return(
                                            <tr>
                                                <td>{i+1}</td>
                                                <td>{pr.productGroupName}</td>
                                                <td>{pr.quantity+' '+pr.measurementUnit}</td>
                                                <td>{pr.units}</td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                               
                            </Table>

                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="success" onClick={()=>this.cancelorder()}>CONFIRM</Button>
                            <Button size="sm" color="danger" onClick={()=>this.setState({cancelconfirm:false,selectorderid:0,tempproducts:[]})}>CLOSE</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.recieveconfirm} toggle={()=>this.setState({recieveconfirm:false,selectorderid:0,tempproducts:[]})}>
                        <ModalHeader toggle={()=>this.setState({recieveconfirm:false,selectorderid:0,tempproducts:[]})}>CONFIRM RECIEVE</ModalHeader>
                        <ModalBody>
                        <Table hover>
                                <thead>
                                    <tr>
                                        <th>SNo</th>
                                        <th>PRODUCT NAME</th>
                                        <th>VARIANT</th>
                                        <th>UNITS ORDERED</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.tempproducts.map((pr,i)=>{
                                        return(
                                            <tr>
                                                <td>{i+1}</td>
                                                <td>{pr.productGroupName}</td>
                                                <td>{pr.quantity+' '+pr.measurementUnit}</td>
                                                <td>{pr.units}</td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                               
                            </Table>
                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="success" onClick={()=>this.receiveorder()}>RECIEVE</Button>
                            <Button size="sm" color="danger" onClick={()=>this.setState({recieveconfirm:false,selectorderid:0,tempproducts:[]})}>CLOSE</Button>
                        </ModalFooter>
                    </Modal>


                    <Modal size="lg" isOpen={this.state.checkrecievedorder}>
                        <ModalHeader>RECIEVED ORDER BATCHLIST</ModalHeader>
                        <ModalBody>
                        <Card>
                            <CardBody>
                           <Card>
                            <CardBody>
                                <Table hover>
                                    <thead>
                                    <tr>
                                        <th>SNo</th>
                                        <th>BATCH CODE</th>
                                        <th>PRODUCT NAME</th>
                                        <th>VARIANT</th>
                                        <th>UNITS ALLOTTED</th>
                                        <th>UNITS RECIEVED</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.recievedorder.map((rec,ind)=>{

                                            return(
                                                <tr>
                                                    <td>{ind+1}</td>
                                                    <td>{rec.batchCode}</td>
                                                    <td>{rec.productGroupName}</td>
                                                    <td>{rec.quantity+' '+rec.measurementUnit}</td>
                                                    <td>{rec.allottedStock}</td>
                                                    <td><Button size="sm" color="primary" onClick={()=>this.unitinputmodal(rec.id,rec.batchCode,ind+1)}>ENTER UNITS</Button></td> 
                                                    
                                                </tr>
                                            )

                                        }
                                        )
                                        }
                                          
                                    </tbody>
                                </Table>

                                <Card>

                                </Card>
                                
                            </CardBody> 
                            </Card> 
                            
                            <Card>
                            <CardBody>
                                <Table hover>
                                <thead>
                                    <tr>
                                        <th>SNo</th>
                                        <th>BATCH CODE</th>
                                        <th>PRODUCT NAME</th>
                                        <th>VARIANT</th>
                                       
                                        <th>UNITS ALLOTED</th>
                                        <th>UNITS RECIEVED</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.displayupdatestock.map((dis,ind)=>{

                                        return(
                                            <tr>
                                                <td>{ind+1}</td>
                                                <td>{dis.batchCode}</td>
                                                <td>{dis.productGroupName}</td>
                                                <td>{dis.variant}</td>
                                                <td>{dis.unitsallotted}</td>
                                                <td>{dis.units}</td> 
                                                <td><DeleteIcon onClick={()=>this.deletebatch(ind)}/></td>
                                                
                                            </tr>
                                        )

                                        }
                                        )
                                        }
                                    </tbody>
                                </Table>
                            </CardBody>
                            </Card>
                            
                            </CardBody>
                            
                                 
                        </Card>
                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="success" onClick={this.putrecievedorder}>UPDATE</Button>
                        </ModalFooter>
                    </Modal>
                    
                    <Modal  isOpen={this.state.inputunitmodal} toggle={()=>this.setState({inputunitmodal:false,updatestockid:0,tempcheckselect:this.state.tempcheckselect.splice(this.state.updatestockid,1)})}>
                        <ModalHeader toggle={()=>this.setState({inputunitmodal:false,updatestockid:0,tempcheckselect:this.state.tempcheckselect.splice(this.state.updatestockid,1)})}>Enter Recieved Input :{this.state.displaybatchcode}</ModalHeader>
                        <ModalBody>
                            <FormGroup row>
                            <Label sm={4}>ENTER UNIT</Label>
                            <Col sm={4}><Input id="unit" onChange={(e)=>{
                                if(e.target.value===''){
                                    this.setState({
                                        unit:0
                                    })
                                }
                                    else{
                                        this.setState({
                                            unit:parseFloat(e.target.value)
                                        })
                                    }
                                
                            }}/></Col>
                            </FormGroup>
                            
                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="success" onClick={()=>this.unitrecieved()}>ADD</Button>
                            <Button size="sm" color="danger" onClick={()=>this.setState({inputunitmodal:false,updatestockid:0,tempcheckselect:this.state.tempcheckselect.splice(this.state.updatestockid,1)})}>CLOSE</Button>
                        </ModalFooter>
                    </Modal>
                   
                </div>

            </Container>
            )
    }
}

export default Orderstatus
