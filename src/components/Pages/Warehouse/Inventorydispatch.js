import { ContactSupportOutlined } from '@material-ui/icons';
import axios from 'axios';
import React, { Component } from 'react'

import { Row,Col,CardBody, CardHeader, Container ,Card, CardFooter, Button, Table, Label, CardSubtitle, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input} from 'reactstrap';

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
            cancelproductvariant:''
        }
    }


    allotconfirmmodal=()=>{this.setState({allotconfirm:!this.state.allotconfirm})}

    cancelconfirmmodal(){
    this.setState({
    cancelconfirm:!this.state.cancelconfirm,
    cancelproductname:'',
    cancelproductid:0,
    cancelproductvariant:''})}

    dispatchconfirmmodal=()=>{this.setState({dispatchconfirm:!this.state.dispatchconfirm})}

    
    componentDidMount(){
        this.getorders()
    }
    getorders(){
        axios.get('http://localhost:8018/warehouseorders').then(res=>{
            console.log('orders',res.data)

            this.setState({
                orders:res.data
            })
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

    render() {
        return (
            <Container>
                <div className="App">
                    <center><h4>ORDER DISPATCH</h4></center>
                    <Card>
                        <CardHeader>
                            ORDERS
                        </CardHeader>
                        <CardBody>
                        {this.state.orders.map((odr,ind)=>{
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
                                        <Button color="success" size="sm">DISPATCH</Button>
                                    </CardFooter>
                                </Card>
                                <br></br>
                                </>
                            )
                        })}
                        </CardBody>
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
                </div>
            </Container>
        )
    }
}

export default Inventorydispatch
