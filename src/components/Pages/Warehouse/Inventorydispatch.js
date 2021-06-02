import { ContactSupportOutlined } from '@material-ui/icons';
import axios from 'axios';
import React, { Component } from 'react'
import { Row,Col,CardBody, CardHeader, Container ,Card, CardFooter, Button, Table, Label, CardSubtitle, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input} from 'reactstrap';
import ReactToPrint from "react-to-print";
import ReactPaginate from 'react-paginate';
import './pagination.css';
import DeleteIcon from '@material-ui/icons/Delete';

class Inventorydispatch extends Component {
    constructor(props){
        super(props);
        this.state={
            orders:[],
            tempbatchlist:[],
            batchlistmodal:false,
            gettotalstock:0,
            allotmodal:false,
            newstockallot:0,
            huborderunit:0,
            allotconfirm:false,
            cancelconfirm:false,
            dispatchconfirm:false,
            allotproductid:0,

            cancelproductname:'',
            cancelproductid:0,
            cancelproductvariant:'',

            dispatchorderselect:[],
            dispatchorderid:0,
            chk:false,
            printmodal:false,
            printflag:0,

            searchdata:[],
            searchinput:'',
            offset:0,
            perpage:2,
            currentpage:0,
            pagecount:0
        }
        this.handlePageClick = this.handlePageClick.bind(this);
        
    }


    allotconfirmmodal=()=>{this.setState({allotconfirm:!this.state.allotconfirm})}

    cancelconfirmmodal(){
    this.setState({
    cancelconfirm:!this.state.cancelconfirm,
    cancelproductname:'',
    cancelproductid:0,
    cancelproductvariant:''})}

    dispatchconfirmmodal(){
        this.setState({
            dispatchconfirm:!this.state.dispatchconfirm,
            dispatchorderselect:[]
        })}

    
    componentDidMount(){
        this.getorders()
    }
    getorders(){
        axios.get('http://localhost:8018/warehouseorders').then(res=>{
            console.log('orders',res.data)

            let temp=[]
            temp=res.data
            var split=temp.slice(this.state.offset, this.state.offset + this.state.perpage)


            this.setState({
                orders:res.data,
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
      
        const data=this.state.orders
      
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
      let filterdata=this.state.orders.filter(val=>{
      
      return(
        val.hubName.toLowerCase().includes(searchinput.toLowerCase()) ||
        val.orderedTimestamp.substring(0,10).split('-').reverse().join('-').toLowerCase().includes(searchinput.toLowerCase())
      )

      })
      this.setState({
      searchdata:filterdata
      })
      }

      

    openbatchlist(batchlist){
        this.setState({
            tempbatchlist:batchlist,
            batchlistmodal:true
        })
    }


    allotstock(unit,id){
        axios.get('http://localhost:8019/allotpending').then(res=>{
        console.log(res.data,"chk single element")

        let totstock=0
        res.data.map(st=>{
            totstock=st.totalstock
        })
        this.setState({
            gettotalstock:totstock,
            allotmodal:true,
            huborderunit:unit,
            allotproductid:id
        })
        console.log("prodid",id,'totstock',totstock)

        })
    }
   
    putallot=()=>{
        //put req but now sample post
        const putstock={
            unitsToBeAllotted:this.state.newstockallot}
        axios.post('http://localhost:8020/allotput',putstock).then(res=>{
                console.log('new stock alloted')
                this.setState({
                    gettotalstock:0,
                    allotmodal:false,
                    newstockallot:0,
                    huborderunit:0,
                    allotconfirm:false,
                    allotproductid:0

                },()=>{
                    this.getorders()
                })
        })
    }

    cancelproduct(id,name,variant){
        this.setState({
            cancelproductname:name,
            cancelproductid:id,
            cancelproductvariant:variant,
            cancelconfirm:true
        })
    }

    putcancel=()=>{
        //need to put but now xcuse
       /* axios.put().then(res=>{
            console.log('deleted product')
        })*/
        alert('Canceled',this.state.cancelproductid)
        this.setState({
            cancelproductname:'',
            cancelproductid:0,
            cancelproductvariant:'',
            cancelconfirm:false
        },()=>{
            this.getorders()
        })
    }

    dispatchorder(id){
        let filterorder=this.state.orders.filter(i=>i.id===id)
        console.log(filterorder,'After filter')
        this.setState({
            dispatchorderselect:filterorder,
            dispatchconfirm:true,
            dispatchorderid:id
        })
    }

    putdispatch=()=>{
        //needs to connect fa now simple alert
        /*axios.put(''${dispatchorderid})*/
        
        alert('DISPATCHED',this.state.dispatchorderid)

        this.setState({
            dispatchorderselect:[],
            dispatchorderid:0,
            dispatchconfirm:false,
            printflag:0
        },()=>{this.getorders()})
    }

    deleteprinted(){
        this.setState({
            printmodal:false,
            chk:false,
            printflag:1
            
        })
    }

    render() {
        return (
            <Container>
                <div className="App">
                    <center><h4>ORDER DISPATCH</h4></center>
                    <Card>
                        <CardHeader>
                           <center>ORDERS</center> 
                            <Row>
                            <b>Search</b>: <input
                        style={{ marginLeft: 5 }}
                        type="text"
                        placeholder="Type to search..."
                        value={this.state.searchinput}
                        onChange={e => this.handlesearch(e)}
                    
                        />
                        <DeleteIcon onClick={()=>this.setState({searchinput:'',searchdata:this.state.orders})}></DeleteIcon>
                        {this.state.searchdata.length === 0 && <span>No records found!</span> }
                        </Row>
                        <br></br>
                        </CardHeader>
                        
                        <CardBody>
                        {this.state.searchdata.map((odr,ind)=>{
                            return(
                                <>
                                <Card>
                                    <CardHeader>
                                        <Row>{ind+1})<Col><b>HUB:</b>{' '}{odr.hubName}</Col></Row>
                                        <Row><Col><b>ORDER DATE:</b>{' '}{odr.orderedTimestamp.substring(0,10).split('-').reverse().join('-')}</Col></Row>
                                    </CardHeader>
                                    <CardBody>
                                    <CardSubtitle>PRODUCT LIST</CardSubtitle>
                                    <Table hover size="md">
                                        <thead>
                                            <tr>
                                                <th>SNo</th>
                                                <th>PRODUCT NAME</th>
                                                <th>VARIANT</th>
                                                <th>UNITS ORDERED</th>
                                                <th>MANAGE</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {odr.orderedProducts.map((opr,i)=>{
                                                return(
                                                    <tr key={i}>
                                                        <td>{i+1}</td>
                                                        <td>{opr.productGroupName}</td>
                                                        <td>{opr.quantity+' '+opr.measurementUnit}</td>
                                                        <td>{opr.units}</td>
                                                        
                                                            {opr.status==='CANCELLED'?(
                                                                <td>{opr.status}</td>
                                                            ):(<> </> )}

                                                            {opr.status==='PENDING'?(
                                                                <td>
                                                                <Button size="sm" color="primary" onClick={()=>this.allotstock(opr.units,opr.id)}>ALLOT</Button>{' '}
                                                                <Button size="sm" color="danger" onClick={()=>this.cancelproduct(opr.id,opr.productGroupName,opr.quantity+' '+opr.measurementUnit)}>CANCEL</Button> 
                                                                </td>
                                                            ):(<></>)}

                                                            {opr.status==='ACCEPTED'?(
                                                                <td>
                                                                <Button size="sm" color="success" onClick={()=>this.openbatchlist(opr.allottedBatchList)}>VIEW BATCH</Button>{' '}
                                                                <Button size="sm" color="danger" onClick={()=>this.cancelproduct(opr.id,opr.productGroupName,opr.quantity+' '+opr.measurementUnit)}>CANCEL</Button> 
                                                                </td>
                                                            ):(<></>)}
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    </CardBody>
                                    <CardFooter>
                                        <Button color="success" size="sm" onClick={()=>this.dispatchorder(odr.id)}>DISPATCH</Button>
                                    </CardFooter>
                                </Card>
                                <br></br>
                                </>
                            )
                        })}

                        </CardBody>
                        <CardFooter>
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
                        </CardFooter>
                    </Card>
                    
                        <Modal isOpen={this.state.batchlistmodal} toggle={()=>this.setState({batchlistmodal:false})}>
                            <ModalHeader toggle={()=>this.setState({batchlistmodal:false})}>ALLOTED BATCH</ModalHeader>
                            <ModalBody>
                            <Table size="sm">
                                            <thead>
                                                <tr>
                                                    <th>SNo</th>
                                                    <th>BATCH CODE</th>
                                                    <th>ALLOTED STOCK</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.tempbatchlist.map((bl,ind)=>{
                                                return(
                                                    <tr key={ind}>
                                                        <td>{ind+1}</td>
                                                        <td>{bl.batchCode}</td>
                                                        <td>{bl.allottedStock}</td>
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                        </Table>
                                
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" size="sm" onClick={()=>this.setState({batchlistmodal:false})}>CLOSE</Button>
                            </ModalFooter>
                        </Modal>


                        <Modal isOpen={this.state.allotmodal} toggle={()=>this.setState({allotmodal:false,newstockallot:0,allotproductid:0})}>
                            <ModalHeader toggle={()=>this.setState({allotmodal:false,newstockallot:0,allotproductid:0})}>ALLOT STOCK</ModalHeader>
                            <ModalBody>
                                <FormGroup row>
                                    <Label sm={4}>ENTER QUANTITY</Label>
                                   <Col sm={4}> <Input id="unitstoallot" onChange={(e)=>{
                                        if(e.target.value===''){
                                            this.setState({
                                                newstockallot:0
                                            })

                                        }
                                        else{
                                            if(parseFloat(e.target.value)<=this.state.gettotalstock && parseFloat(e.target.value)<=this.state.huborderunit){
                                                this.setState({
                                                    newstockallot:parseFloat(e.target.value)
                                                })
                                            }
                                            else{
                                                alert('No stock available')
                                                document.getElementById('unitstoallot').value=''
                                            }
                                           
                                        }
                                    }}/></Col>
                                </FormGroup>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="success" size="sm" onClick={this.allotconfirmmodal}>ALLOT</Button>
                                <Button color="danger" size="sm" onClick={()=>this.setState({allotmodal:false,newstockallot:0,allotproductid:0})}>CANCEL</Button>
                            </ModalFooter>
                        </Modal>  


                        <Modal isOpen={this.state.allotconfirm} toggle={this.allotconfirmmodal}>
                        <ModalHeader toggle={this.allotconfirmmodal}>CONFIRM ALLOT</ModalHeader>
                        <ModalBody>
                            NEW STOCK ALLOTED:{this.state.newstockallot}
                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="success" onClick={this.putallot}>CONFIRM</Button>
                            <Button size="sm" color="danger" onClick={this.allotconfirmmodal}>CLOSE</Button>          
                        </ModalFooter>
                        </Modal>    


                        <Modal isOpen={this.state.cancelconfirm} toggle={()=>this.cancelconfirmmodal()}>
                        <ModalHeader toggle={()=>this.cancelconfirmmodal()}>CONFIRM CANCEL</ModalHeader>
                        <ModalBody>
                                Are you sure to delete <b>{this.state.cancelproductname},{this.state.cancelproductvariant}</b>?
                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="success" onClick={this.putcancel}>CONFIRM</Button>
                            <Button size="sm" color="danger" onClick={()=>this.cancelconfirmmodal()}>CANCEL</Button>
                        </ModalFooter>
                        </Modal>

                        <Modal isOpen={this.state.dispatchconfirm} toggle={()=>this.dispatchconfirmmodal()}>
                        <ModalHeader toggle={()=>this.dispatchconfirmmodal()}>CONFIRM DISPATCH</ModalHeader>
                        <ModalBody>
                                
                        {this.state.dispatchorderselect.map((odr,ind)=>{
                            return(
                                <>
                                <Card>
                                    <CardHeader>
                                        
                                        <Row>{ind+1})<Col><b>HUB:</b>{' '}{odr.hubName}</Col></Row>
                                        <Row><Col><b>ORDER DATE:</b>{' '}{odr.orderedTimestamp.substring(0,10).split('-').reverse().join('-')}</Col></Row>
                                    </CardHeader> 
                                    <CardBody>
                                    <CardSubtitle>PRODUCT LIST</CardSubtitle>
                                    <Table hover size="md">
                                        <thead>
                                            <tr>
                                                <th>SNo</th>
                                                <th>PRODUCT NAME</th>
                                                <th>VARIANT</th>
                                                <th>UNITS ORDERED</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {odr.orderedProducts.map((opr,i)=>{
                                                if(opr.status!='CANCELLED'){
                                                    return(
                                                        <tr key={i}>
                                                            <td>{i+1}</td>
                                                            <td>{opr.productGroupName}</td>
                                                            <td>{opr.quantity+' '+opr.measurementUnit}</td>
                                                            <td>{opr.units}</td> 
                                                        </tr>
                                                    )
                                                }
                                                
                                            })}
                                        </tbody>
                                    </Table>
                                    </CardBody>
                                </Card>
                                </>
                            )})}
                        </ModalBody>
                        <ModalFooter>
                            {this.state.printflag===1?(
                            <Button color="success" size="sm" onClick={this.putdispatch}>DISPATCH</Button>)
                            :(
                                <Button color="success" size="sm" onClick={()=>this.setState({printmodal:true})}>PRINT</Button>
                            )}
                            <Button color="danger" size="sm" onClick={()=>this.dispatchconfirmmodal()}>CANCEL</Button>
                        </ModalFooter>
                        </Modal>  


                       <Modal isOpen={this.state.printmodal} toggle={()=>{this.setState({printmodal:!this.state.printmodal,printflag:0})}}>
                       <ModalHeader toggle={()=>{this.setState({printmodal:!this.state.printmodal,printflag:0})}}>PACKING ORDER</ModalHeader>
                       <ModalBody>
                        <ComponentToPrint
                            ref={(el) => (this.componentRef = el)}
                            data={this.state.dispatchorderselect}
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
        ewaybilldata: this.props.data
      };
    
    }
  
    render() {
      return (
          <>
        {this.state.ewaybilldata.map((odr,ind)=>{
             return(
                 <>
                <Card>
                <CardHeader>
                    <Row><Col><b>HUB:</b>{' '}{odr.hubName}</Col></Row>
                    <Row><Col><b>ORDER DATE:</b>{' '}{odr.orderedTimestamp.substring(0,10).split('-').reverse().join('-')}</Col></Row>
                </CardHeader> 
                <CardBody>
                        <CardSubtitle>PRODUCT LIST</CardSubtitle>
                        <Table>
                        <thead>
                            <tr>
                            <th>SNo</th>
                            <th>PRODUCT NAME</th>
                            <th>VARIANT</th>
                            <th>UNITS ORDERED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {odr.orderedProducts.map((opr,i)=>{
                                if(opr.status!='CANCELLED'){
                                    return(
                                        <tr key={i}>
                                            <td>{i+1}</td>
                                            <td>{opr.productGroupName}</td>
                                            <td>{opr.quantity+' '+opr.measurementUnit}</td>
                                            <td>{opr.units}</td> 
                                        </tr>
                                    )
                                }
                                
                            })}
                            </tbody>
                        </Table>
                        </CardBody> 
                        </Card>

                        </> 
                         )})}  

                </>
      )
}  
} 


export default Inventorydispatch
