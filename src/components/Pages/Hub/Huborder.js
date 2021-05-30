import axios from 'axios';
import React, { Component } from 'react';
import { Form, FormGroup, Table } from 'reactstrap';
import {Container,Row,Col,Modal,Card, CardBody, CardHeader, Label,Input,Button, CardFooter,ModalBody,ModalFooter,ModalHeader} from 'reactstrap';
import DeleteIcon from '@material-ui/icons/Delete';

class Huborder extends Component {
    constructor(props){
        super(props);
        this.state={
            proddet:[],
            prodname:'',
            variants:[],
            cart:[],
            variantchoosen:'',
            variantchoosenid:0,
            quantity:0,
            confirmordermodal:false
        }
    }
    componentDidMount(){
        this.getproducts()
    }
    getproducts(){
        axios.get('http://localhost:8014/allprod').then(res=>{
            
            this.setState({
                proddet:res.data
            })
        })
    }
    selectproduct(e){
        let temp=e.target.value
        let tempproduct=this.state.proddet.filter(vr=>vr.productGroupName===temp)
        console.log('1',temp,'2',tempproduct)

        let variantlist=[]
        tempproduct.map((vr,ind)=>{
            variantlist=vr.products
        })

        console.log(variantlist)
        
        this.setState(
            {
                prodname:temp,
                variants:variantlist            
            })
    }

    selectvariant(e){
        let temp=e.target.value.split(' ')
        
        this.setState({
            variantchoosen:temp[0]+' '+temp[1],
            variantchoosenid:temp[2]
        })
            
    }

    cartadd=()=>{
        let cartdata={
            name:this.state.prodname,
            variant:this.state.variantchoosen,
            variantid:this.state.variantchoosenid,
            quantity:this.state.quantity
        }
        this.setState({
            cart:[...this.state.cart,cartdata],
            prodname:'',
            variants:[],
            variantchoosen:'',
            variantchoosenid:0,
            quantity:0

        })
        console.log(cartdata,'---',this.state.cart)
        document.getElementById('quantity').value=''
        document.getElementById('variant').value=''
        document.getElementById('product').value=''
        
    }

    deleteitem(ind){
        let tempdel=this.state.cart
        tempdel.splice(ind,1)
        this.setState({
            cart:tempdel
        })

    }


    postorder=()=>{
        let tempcart=this.state.cart
        let order=[]
        tempcart.map((pr,i)=>{
            let temp={
                productId:pr.variantid,
                quantity:pr.quantity
            }
            order.push(temp)
        })
        let postcart={
            orderedProducts:order
        }
        console.log(postcart)
        axios.post('http://localhost:8015/huborder',postcart).then(res=>{
            console.log('posted order')

            this.setState({
                prodname:'',
                variants:[],
                cart:[],
                variantchoosen:'',
                variantchoosenid:0,
                quantity:0,
                confirmordermodal:false

            })
        })
    }

    render() {
        return (
            <Container>
            <center><h3>HUB ORDERS</h3></center>
            <Card>
                <CardHeader>ORDER PRODUCTS</CardHeader>
                <CardBody>
                    <FormGroup row>
                    <Label sm={3}>PRODUCTS</Label>
                    <Col sm={4}>
                        <Input list="products" id="product" placeholder="Search Product..." onChange={(e)=>this.selectproduct(e)}></Input>
                        <datalist id="products">
                            <option value="" selected disabled></option>
                            {this.state.proddet.map((pr,ind)=>{
                                return(
                                    <option value={pr.productGroupName}>{pr.productGroupName}</option>
                                )
                            })}
                        </datalist>
                    </Col>
                    </FormGroup>
                    {this.state.prodname.length>0?(
                        <FormGroup row>
                            <Label sm={3}>VARIANT</Label>
                            <Col sm={4}>
                                <select id="variant" onChange={(e)=>this.selectvariant(e)}>
                                    <option value="" selected disabled></option>
                                    {this.state.variants.map((vr,ind)=>{
                                        return(
                                        <option value={vr.quantity+' '+vr.measurementUnit+' '+vr.productId}>{vr.quantity+' '+vr.measurementUnit}</option>
                                    )})}
                                </select>
                            </Col>

                        </FormGroup>
                    ):(<></>)}
                    {this.state.prodname.length>0 && this.state.variantchoosen.length>0?(
                        <>
                        <FormGroup row>
                            <Label sm={3}>QUANTITY</Label>
                            <Col sm={4}>
                            <Input id="quantity" placeholder="Enter Quantity" onChange={(e)=>{
                                if(e.target.value===''){
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
                        </FormGroup>
                        <FormGroup row>
                        <Label sm={3}><Button color="success" onClick={this.cartadd}>ADD</Button></Label>
                        </FormGroup>
                        </>
                    ):(<></>)}
                   
                </CardBody>
            </Card>
            <br></br>
            {this.state.cart.length>0?(
                <Card>
                <CardHeader>CART</CardHeader>
                <CardBody>
                <Table hover>
                <thead>
                    <tr>
                        <th>SNo</th>
                        <th>Product Name</th>
                        <th>Variant</th>
                        <th>Quantity</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.cart.map((prd,ind)=>{
                        return(
                            <tr key={ind}>
                                <td>{ind+1}</td>
                                <td>{prd.name}</td>
                                <td>{prd.variant}</td>
                                <td>{prd.quantity}</td>
                                <td><DeleteIcon onClick={()=>this.deleteitem(ind)}/></td>
                            </tr>
                        )
                    })}
                </tbody>
                </Table>    
                </CardBody>
                <CardFooter>
                    <Button size="sm" color="success" onClick={()=>this.setState({confirmordermodal:true})}>CONFIRM</Button>
                    <Button size="sm" color="danger" onClick={()=>this.setState({cart:[]})}>CLEAR CART</Button>
                </CardFooter>
            </Card>               
            
            ):(<></>)}

            <Modal isOpen={this.state.confirmordermodal}>
                        <ModalHeader>CONFIRM ORDER</ModalHeader>
                        <ModalBody>Order for {this.state.cart.length} products</ModalBody>
                        <ModalFooter>
                            <Row>
                            <Col sm={3}><Button color="success" onClick={this.postorder}>ORDER</Button></Col>{'  '}<Col sm={2}></Col>
                            
                            <Col><Button color="danger" onClick={()=>this.setState({confirmordermodal:false})}>CANCEL</Button></Col>
                            </Row>
                            
                        </ModalFooter>
                    </Modal>
            
            </Container>
        )
    }
}

export default Huborder
