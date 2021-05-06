import React, { Component } from 'react'
import { Container, Row, Col,Form, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Collapse } from 'reactstrap';
import axios from 'axios';
import {Table} from 'reactstrap';
import DeleteIcon from '@material-ui/icons/Delete';

class Payments extends Component {

    constructor(props) {
        super(props);
        this.state={

            paydet:[],
            fullpayflag:false,
            partialpayflag:false,
            showamt:0,
            showremamt:0,
            updateindex:-1,
            updateid:0,
            emi:0,
            modalproduct:false,
            modalprod:[]

        }
    }



    componentDidMount(){
       this.getpaymentdata();

    }

    getpaymentdata(){
        axios.get('http://localhost:8002/proc').then((response)=>{


            let temppay=response.data.filter(item=> item.status==='PARTIAL_PAID' || item.status==='UNPAID')
    
            console.log('filtered',temppay)
            this.setState({
    
                paydet:temppay
            })
    
    
            })
    }
    paymode(valstatus,valamt,valrem,id,index){

        if(valstatus==='PAID'){
            this.setState({
                fullpayflag:!this.state.fullpayflag,
                showamt:valamt,
                showremamt:valrem,
                updateid:id,
                updateindex:index
            })

        }
        else{
                this.setState({
                    partialpayflag:!this.state.partialpayflag,
                    showamt:valamt,
                    showremamt:valrem,
                    updateid:id,
                    updateindex:index
                })
        }
document.getElementById('paymode').value=''
    }

    togglefullpay=()=>{
        this.setState({
            fullpayflag:!this.state.fullpayflag
        })
    }


    togglepartialpay=()=>{
        this.setState({
            partialpayflag:!this.state.partialpayflag
        })
    }

    updatefullpay=()=>{

       
        
        let tempdata=this.state.paydet[this.state.updateindex]

        let statusupdate={
            bill_no:tempdata.bill_no ,
            bill_date: tempdata.bill_date,
            additionalcost: tempdata.additionalcost,
            status:"PAID",
            paidAmt:null,
            addProcuredProductList:tempdata.addProcuredProductList,
            sellerId: tempdata.sellerId
            
        }
       

      

        
        axios.put(`http://localhost:8002/proc/${this.state.updateid}`,statusupdate).then(response=>{
            console.log('updated',response.data)

            this.setState({
                fullpayflag:false,
                showamt:0,
                 updateindex:-1,
                 showremamt:0,
                 updateid:0

            })
        })
        
       

        
    }


    addpartialpay(val,amt){


        if(val===''){
            this.setState({
                emi:0
            })
        }
        else
        {
            if(parseFloat(val)<amt){
                this.setState({
                    emi:parseFloat(val)
                })
            }
            else{
                return ('Enter correct Amount')
            }

        }

    }

    updatepartialpay=()=>{

        let tempdata=this.state.paydet[this.state.updateindex]
        let statusupdate={
            bill_no:tempdata.bill_no ,
            bill_date: tempdata.bill_date,
            additionalcost: tempdata.additionalcost,
            status:"PARTIAL_PAID",
            paidAmt:(this.state.emi+tempdata.paidAmt),
            addProcuredProductList:tempdata.addProcuredProductList,
            sellerId: tempdata.sellerId
            
        }
       

        document.getElementById('paymode').value=''

        
        axios.put(`http://localhost:8002/proc/${this.state.updateid}`,statusupdate).then(response=>{
            console.log('updated',response.data)

            this.setState({
                partialpayflag:false,
                showamt:0,
                emi:0,
                 updateindex:-1,
                 showremamt:0,
                 updateid:0

            })
       })

      
    }



    delemi=()=>{
        document.getElementById('emi').value=''

        this.setState({
            emi:0
        })
    }

    modalprod(prodet){
        this.setState({
            modalproduct:!this.state.modalproduct,
            modalprod:prodet
        })
        console.log('a',prodet)
    }

    render() {

        let datas=this.state.paydet.map((it,ind)=>{
                let tempcost=0
                if(it.status==='PARTIAL_PAID'){
            return(
                <>
                <tr>
                    <td key={ind}>{ind+1}</td>
                    <td>{it.bill_no}</td>
                    <td>{it.status}</td>
                    <td><Button color="primary" onClick={(e)=>this.modalprod(it.addProcuredProductList)} >PRODUCTS</Button></td>

                    
                    
                    {it.addProcuredProductList.map((pro,i)=>{
                        tempcost+=(pro.totalunits*pro.priceperunit)*(1+(pro.tax/100))

                    })}
                    <td>{tempcost}</td>
                    <td>{tempcost-it.paidAmt}</td>
                    <td>
                    <select id="paymode" onChange={(e)=>this.paymode(e.target.value,tempcost,tempcost-it.paidAmt,it.id,ind)}>
                        <option>...</option>
                        <option value="PAID">FULL PAY</option>
                        <option value="PARTIAL_PAID">PARTIAL PAY</option>
                    </select>

                    </td>
                </tr>
               
                </>
            )
            }
            else{
                return(
                <>
                <tr>
                <td key={ind}>{ind+1}</td>
                <td>{it.bill_no}</td>
                <td>{it.status}</td>
                <td><Button color="primary" onClick={(e)=>this.modalprod(it.addProcuredProductList)}>PRODUCTS</Button></td>
                
                {it.addProcuredProductList.map((pro,i)=>{
                    tempcost+=(pro.totalunits*pro.priceperunit)*(1+(pro.tax/100))

                })}
                <td>{tempcost}</td>
                <td>{tempcost}</td>
                <td>
                <select id="paymode" onChange={(e)=>this.paymode(e.target.value,tempcost,tempcost,it.id,ind)}>
                    <option>...</option>
                    <option value="PAID">FULL PAY</option>
                    <option value="PARTIAL_PAID">PARTIAL PAY</option>
                </select>

                </td>
            </tr>
              
              </>
            
            )
            }

        })

        return (
           
             <Container>
            <h1>PAYMENTS</h1>
            <Table striped>
            <thead>
                <tr>
                <th>SNo</th>
                <th>BILL NO</th>
                <th>STATUS</th>
                <th>PRODUCTS</th>
                
                <th>TOTAL COST</th>
                <th>DUE AMOUNT</th>
                
                <th>UPDATE</th>
                </tr>
                
            </thead>
            <tbody>
            {datas}    
            </tbody>    
                
            </Table>
           
           


            <Modal isOpen={this.state.fullpayflag} toggle={this.togglefullpay}>
                <ModalHeader toggle={this.togglefullpay}>
                    CONFIRM FULL PAYMENT
                </ModalHeader>
                <ModalBody>
                    <Row> <h5>DUE AMOUNT={' '}</h5><b><h5>{this.state.showamt}</h5></b></Row>
                   
                    <Row><h5>AMOUNT PAID={' '}</h5><b><h5>{this.state.showremamt}</h5></b></Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={this.updatefullpay}>CONFIRM</Button>
                    <Button color="danger" onClick={this.togglefullpay}>CLOSE</Button>
                    
                </ModalFooter>
            </Modal>


            <Modal isOpen={this.state.partialpayflag} toggle={this.togglepartialpay}>
                <ModalHeader toggle={this.togglepartialpay}>
                    ADD PARTIAL PAYMENT
                </ModalHeader>
                <ModalBody>
                    <Row> <h5>TOTAL AMOUNT={' '}</h5><b><h5>{this.state.showamt}</h5></b></Row>
                   
                    <Row><h5>DUE AMOUNT ={' '}</h5><b><h5>{this.state.showremamt}</h5></b></Row>

                    <Row><h5>ENTER AMOUNT PAID ={' '}</h5><Col xs='4'><Input id='emi' onChange={(e)=>this.addpartialpay(e.target.value,this.state.showremamt)}/></Col>{' '}
                    <DeleteIcon onClick={this.delemi}/>
                    </Row>

                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={this.updatepartialpay}>CONFIRM</Button>
                    <Button color="danger" onClick={this.togglepartialpay}>CLOSE</Button>
                    
                </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.modalproduct} toggle={()=>this.setState({modalproduct:!this.state.modalproduct,modalprod:[]})} size='lg'>
                <ModalHeader toggle={()=>this.setState({modalproduct:!this.state.modalproduct,modalprod:[]})}>
                PRODUCT LIST    
                </ModalHeader>
                <ModalBody>
                    <Table>
                        <thead>
                        <tr>
                        <th>SNo</th>
                        
                        <th>PRODUCT GROUP</th>
                        <th>PRICE PER UNIT</th>
                        <th>TOTAL UNITS</th>
                        <th>MEASUREMENT UNIT</th>
                        <th>TAX%</th>
                        
                        <th>QUANTITY PER UNIT</th>
                        
                        <th>PRODUCTCOST + TAX</th>
                        
                        </tr>
                        </thead>
                        <tbody>
                        {
                        
                      this.state.modalprod.map((pro,ind)=>{

                        
                        return(
                            <tr>
                                <td>{ind+1}</td>
                                <td>{pro.productgroupId}</td>
                                <td>Rs.{pro.priceperunit}</td>
                                <td>{pro.totalunits}</td>
                                <td>{pro.measurementunit}</td>
                            
                                <td>{pro.tax}</td>
                                <td>{pro.quantityperunit}</td>
                                
                                <td>Rs.{(pro.priceperunit*pro.totalunits)*(1+(pro.tax/100))}</td>

                            </tr>
                            )
                  

                      })


                        }
                        
                        
                        </tbody>
                    </Table>
                 </ModalBody>
                 <ModalFooter>
                     <Button color="danger" onClick={()=>this.setState({modalproduct:!this.state.modalproduct,modalprod:[]})}>Cancel</Button>
                 </ModalFooter>

            </Modal>

            </Container>
          
        )
    }
}

export default Payments
