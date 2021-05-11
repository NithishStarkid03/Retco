import React, { Component } from 'react';
import { Container, Row, Col,Form, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Collapse } from 'reactstrap';
import axios from 'axios';
import {Table} from 'reactstrap';
import ReactPaginate from 'react-paginate';
import './pagination.css';
import DeleteIcon from '@material-ui/icons/Delete';


class Paymenthistory extends Component {

    constructor(props) {
        super(props);
        this.state={
            modalproduct:false,
            modalprod:[],
            paydet:[],
            searchdata:[],
            searchinput:'',
            offset:0,
            perpage:5,
            currentpage:0,
            pagecount:0
        }
    }

    componentDidMount(){
        this.getpaymentdata();
 
     }


     getpaymentdata(){
        axios.get('http://localhost:8002/proc').then((response)=>{


            let temppay=response.data.filter(item=> item.status==='PAID')
    
            console.log('filtered',temppay)

            var split=temppay.slice(this.state.offset, this.state.offset + this.state.perpage) 

            this.setState({
                pagecount:Math.ceil(temppay.length/this.state.perpage),
                paydet:temppay,
                searchdata:split
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
      let filterdata=this.state.paydet.filter(val=>{
      
      return(
        val.bill_no.toLowerCase().includes(searchinput.toLowerCase()) ||
        val.sellerId.toLowerCase().includes(searchinput.toLowerCase()) 
      
      
      
      )
      
      
      })
      
      this.setState({
      
      searchdata:filterdata
      
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

        let datas=this.state.searchdata.map((it,ind)=>{
            let tempcost=0
            
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
            </tr>
           
            </>
        )
        })

        return (
            <Container>
            <center><h3>PAYMENT HISTORY</h3></center>
            <Row>
            <b>Search</b>: <input
        style={{ marginLeft: 5 }}
        type="text"
        placeholder="Type to search..."
        value={this.state.searchinput}
        onChange={e => this.handlesearch(e)}
      
        />
        <DeleteIcon onClick={()=>this.setState({searchinput:'',searchdata:this.state.paydet})}></DeleteIcon>


        
            {this.state.searchdata.length === 0 && <span>No records found!</span> }
            
            <Table striped>
            <thead>
                <tr>
                <th>SNo</th>
                <th>BILL NO</th>
                <th>STATUS</th>
                <th>PRODUCTS</th>
                
                <th>TOTAL COST</th>
                </tr>
                
            </thead>
            <tbody>
            {datas}    
            </tbody>    
                
            </Table>
            </Row>
           
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

export default Paymenthistory
